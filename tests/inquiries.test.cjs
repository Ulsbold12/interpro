const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { createHash } = require('node:crypto');

// Compile the actual TypeScript modules for Node without adding a test dependency.
const root = path.resolve(__dirname, '..');
const cache = new Map();
const cookieJar = new Map();
function load(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename);
  cache.set(filename, mod);
  mod.filename = filename;
  mod.require = name => {
    if (name === 'server-only') return {};
    if (name === 'next/headers') return { cookies: async () => ({
      get: key => cookieJar.has(key) ? { value: cookieJar.get(key) } : undefined,
      set: (key, value) => cookieJar.set(key, value),
    }) };
    if (name.startsWith('@/')) return load(path.join(root, 'src', `${name.slice(2)}.ts`));
    if (name.startsWith('.')) return load(path.resolve(path.dirname(filename), `${name}.ts`));
    return require(name);
  };
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  mod._compile(output.outputText, filename);
  return mod.exports;
}
const { validateInquiry } = load(path.join(root, 'src/lib/inquiry.ts'));
const { sameOrigin } = load(path.join(root, 'src/lib/server/backend.ts'));
const publicRoute = load(path.join(root, 'src/app/api/inquiries/route.ts'));
const adminRoute = load(path.join(root, 'src/app/api/admin/inquiries/route.ts'));
const sessionRoute = load(path.join(root, 'src/app/api/admin/session/route.ts'));
const notificationRoute = load(path.join(root, 'src/app/api/admin/notifications/route.ts'));
const originalFetch = global.fetch;
const envNames = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY', 'ADMIN_EMAILS', 'RESEND_API_KEY', 'INQUIRY_EMAIL_FROM', 'INQUIRY_EMAIL_TO', 'NEXT_PUBLIC_SITE_URL'];
const originalEnv = Object.fromEntries(envNames.map(name => [name, process.env[name]]));
afterEach(() => {
  global.fetch = originalFetch; cookieJar.clear();
  for (const name of envNames) {
    if (originalEnv[name] === undefined) delete process.env[name]; else process.env[name] = originalEnv[name];
  }
});
function setup() {
  Object.assign(process.env, {
    SUPABASE_URL: 'https://supabase.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-server-key', SUPABASE_ANON_KEY: 'test-anon-key',
    ADMIN_EMAILS: 'admin@example.test', RESEND_API_KEY: 'test-email-key', INQUIRY_EMAIL_FROM: 'INTERPRO <requests@example.test>',
    INQUIRY_EMAIL_TO: 'inbox@example.test', NEXT_PUBLIC_SITE_URL: 'https://interpro.test',
  });
}
const input = {
  id: '29d87318-5c45-471e-b468-7e8c5f9ac75c', name: 'Тест хэрэглэгч', phone: '99112233', email: 'client@example.test',
  subject: 'Shure микрофон', event_date: '2026-10-15', guests: '80', note: 'Хоёр микрофоны үнийн санал авъя.',
};
const row = { ...validateInquiry(input), created_at: '2026-10-04T00:00:00Z', status: 'new', notification_status: 'pending', notification_sent_at: null };
function request(url, method, body, origin = 'https://interpro.test') {
  return new Request(`https://interpro.test${url}`, { method, headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Forwarded-For': '192.0.2.1' }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
function mockFetch(steps) {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), ...options });
    assert.ok(steps.length, `Unexpected upstream request: ${url}`);
    const step = steps.shift();
    assert.ok(String(url).includes(step.path), `Expected ${step.path}, got ${url}`);
    if (step.check) step.check(options);
    return new Response(JSON.stringify(step.data ?? null), { status: step.status || 200, headers: { 'Content-Type': 'application/json' } });
  };
  return { calls, done: () => assert.equal(steps.length, 0, 'All expected upstream calls ran') };
}
const authorized = { path: '/auth/v1/user', data: { id: 'admin-id', email: 'admin@example.test', email_confirmed_at: '2026-10-01' } };

test('validation keeps product and note, rejects bad phone, date, size and ID', () => {
  assert.equal(validateInquiry(input).guests, 80);
  assert.equal(validateInquiry({ ...input, email: '', guests: '', event_date: '' }).event_date, null);
  for (const change of [{ phone: 'badnumber' }, { email: 'bademail' }, { event_date: '2026-02-30' }, { note: 'x'.repeat(4001) }, { id: 'invalid' }, { guests: 0 }, { guests: 1.5 }]) {
    assert.throws(() => validateInquiry({ ...input, ...change }));
  }
});
test('cross-origin submission is rejected before touching services', async () => {
  setup(); const upstream = mockFetch([]);
  assert.equal((await publicRoute.POST(request('/api/inquiries', 'POST', input, 'https://other.test'))).status, 403);
  upstream.done();
});
test('local origin checks use browser host rather than Next internal hostname', () => {
  setup(); delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.doesNotThrow(() => sameOrigin(new Request('http://localhost:3000/api/inquiries', { headers: { Host: '127.0.0.1:3000', Origin: 'http://127.0.0.1:3000' } })));
  assert.throws(() => sameOrigin(new Request('http://localhost:3000/api/inquiries', { headers: { Host: '127.0.0.1:3000', Origin: 'http://evil.test' } })));
});
test('unconfigured database never reports a successful submission', async () => {
  setup(); delete process.env.SUPABASE_SERVICE_ROLE_KEY; const upstream = mockFetch([]);
  assert.equal((await publicRoute.POST(request('/api/inquiries', 'POST', input))).status, 503);
  upstream.done();
});
test('request is saved before email; failed email leaves a retryable inquiry', async () => {
  setup();
  const upstream = mockFetch([
    { path: '/inquiries?id=', data: [] }, { path: '/rpc/consume_inquiry_limit', data: true },
    { path: '/inquiries?on_conflict=', data: [row], check: options => {
      const saved = JSON.parse(options.body); assert.equal(saved.subject, input.subject); assert.equal(saved.status, undefined);
    } },
    { path: 'api.resend.com/emails', status: 503 },
    { path: '/inquiries?id=', check: options => assert.equal(JSON.parse(options.body).notification_status, 'failed') },
  ]);
  const response = await publicRoute.POST(request('/api/inquiries', 'POST', { ...input, status: 'done' }));
  assert.equal(response.status, 201); assert.equal((await response.json()).success, true); upstream.done();
});
test('successful notification contains customer information and a stable idempotency key', async () => {
  setup();
  const upstream = mockFetch([
    { path: '/inquiries?id=', data: [] }, { path: '/rpc/consume_inquiry_limit', data: true }, { path: '/inquiries?on_conflict=', data: [row] },
    { path: 'api.resend.com/emails', data: { id: 'email-id' }, check: options => {
      const email = JSON.parse(options.body); assert.equal(email.reply_to, input.email); assert.deepEqual(email.to, ['inbox@example.test']);
      assert.ok(email.text.includes(input.note)); assert.ok(email.text.includes('https://interpro.test/admin'));
      assert.equal(options.headers['Idempotency-Key'], `inquiry/${input.id}`); assert.equal(email.html, undefined);
    } },
    { path: '/inquiries?id=', check: options => assert.equal(JSON.parse(options.body).notification_status, 'sent') },
  ]);
  assert.equal((await publicRoute.POST(request('/api/inquiries', 'POST', input))).status, 201); upstream.done();
});
test('same submission ID does not create or email a second request', async () => {
  setup(); const hash = createHash('sha256').update(JSON.stringify(validateInquiry(input))).digest('hex');
  const upstream = mockFetch([{ path: '/inquiries?id=', data: [{ ...row, request_hash: hash }] }]);
  assert.equal((await publicRoute.POST(request('/api/inquiries', 'POST', input))).status, 200); upstream.done();
});
test('changed payload with an existing ID is rejected', async () => {
  setup(); const upstream = mockFetch([{ path: '/inquiries?id=', data: [{ ...row, request_hash: 'different' }] }]);
  assert.equal((await publicRoute.POST(request('/api/inquiries', 'POST', input))).status, 409); upstream.done();
});
test('rate-limited submission is never inserted', async () => {
  setup(); const upstream = mockFetch([{ path: '/inquiries?id=', data: [] }, { path: '/rpc/consume_inquiry_limit', data: false }]);
  assert.equal((await publicRoute.POST(request('/api/inquiries', 'POST', input))).status, 429); upstream.done();
});
test('anonymous users cannot list, change or retry private inquiries', async () => {
  setup(); const upstream = mockFetch([]);
  assert.equal((await adminRoute.GET(request('/api/admin/inquiries', 'GET'))).status, 401);
  assert.equal((await adminRoute.PATCH(request('/api/admin/inquiries', 'PATCH', { id: input.id, status: 'done' }))).status, 401);
  assert.equal((await notificationRoute.POST(request('/api/admin/notifications', 'POST', { id: input.id }))).status, 401); upstream.done();
});
test('authenticated non-admin users still cannot read inquiries', async () => {
  setup(); cookieJar.set('interpro-admin', 'non-admin-token');
  const upstream = mockFetch([{ path: '/auth/v1/user', data: { id: 'other-user', email: 'other@example.test', email_confirmed_at: '2026-10-01' } }]);
  assert.equal((await adminRoute.GET(request('/api/admin/inquiries', 'GET'))).status, 401); upstream.done();
});
test('confirmed admin can read inquiries and change a valid status', async () => {
  setup(); cookieJar.set('interpro-admin', 'admin-token');
  const upstream = mockFetch([authorized, { path: '/inquiries?select=', data: [row] }, authorized, {
    path: '/inquiries?id=', data: [{ ...row, status: 'contacted' }], check: options => assert.deepEqual(JSON.parse(options.body), { status: 'contacted' }),
  }]);
  const list = await adminRoute.GET(request('/api/admin/inquiries', 'GET')); assert.equal((await list.json()).inquiries[0].name, input.name);
  const updated = await adminRoute.PATCH(request('/api/admin/inquiries', 'PATCH', { id: input.id, status: 'contacted', note: 'must not be modified' }));
  assert.equal((await updated.json()).inquiry.status, 'contacted'); upstream.done();
});
test('admin notification retry sends pending email and records success', async () => {
  setup(); cookieJar.set('interpro-admin', 'admin-token');
  const upstream = mockFetch([authorized, { path: '/inquiries?id=', data: [{ ...row, notification_status: 'failed' }] }, { path: 'api.resend.com/emails', data: { id: 'email-id' } }, { path: '/inquiries?id=' }]);
  assert.equal((await notificationRoute.POST(request('/api/admin/notifications', 'POST', { id: input.id }))).status, 200); upstream.done();
});
test('admin login sets a cookie and logout clears it', async () => {
  setup(); const upstream = mockFetch([{ path: '/auth/v1/token?grant_type=password', data: { access_token: 'test-token', expires_in: 3600, user: { email: 'admin@example.test', email_confirmed_at: '2026-10-01' } } }]);
  assert.equal((await sessionRoute.POST(request('/api/admin/session', 'POST', { email: 'admin@example.test', password: 'test-password' }))).status, 200);
  assert.equal(cookieJar.get('interpro-admin'), 'test-token');
  assert.equal((await sessionRoute.DELETE(request('/api/admin/session', 'DELETE'))).status, 200);
  assert.equal(cookieJar.get('interpro-admin'), ''); upstream.done();
});
