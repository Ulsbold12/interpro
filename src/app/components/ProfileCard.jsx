'use client';

// Adapted from the React Bits ProfileCard source supplied for this project.
// Keeps the pointer-driven tilt and shine, with a silver finish for INTERPRO.
// Copyright (c) 2026 David Haz. See THIRD_PARTY_NOTICES.md for the license.
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = value => Math.round(value * 1000) / 1000;

/**
 * @param {{avatarUrl?: string, iconUrl?: string, grainUrl?: string,
 * innerGradient?: string, behindGlowEnabled?: boolean, behindGlowColor?: string,
 * behindGlowSize?: string, className?: string, enableTilt?: boolean,
 * enableMobileTilt?: boolean, mobileTiltSensitivity?: number, miniAvatarUrl?: string,
 * name?: string, title?: string, handle?: string, status?: string,
 * contactText?: string, showUserInfo?: boolean, onContactClick?: () => void}} props
 */
function ProfileCardComponent({
  avatarUrl = '', iconUrl = '', grainUrl = '', innerGradient,
  behindGlowEnabled = true, behindGlowColor = 'rgba(210, 215, 225, 0.25)',
  behindGlowSize = '65%', className = '', enableTilt = true,
  enableMobileTilt = false, mobileTiltSensitivity = 5, miniAvatarUrl,
  name = '', title = '', handle = '', status = '', contactText = 'Холбогдох',
  showUserInfo = true, onContactClick
}) {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null, lastTs = 0, running = false;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0, initialUntil = 0;
    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current, wrap = wrapRef.current;
      if (!shell || !wrap) return;
      const px = clamp(100 * x / (shell.clientWidth || 1));
      const py = clamp(100 * y / (shell.clientHeight || 1));
      const properties = {
        '--pointer-x': `${px}%`, '--pointer-y': `${py}%`,
        '--background-x': `${35 + px * .3}%`, '--background-y': `${35 + py * .3}%`,
        '--pointer-from-center': `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${py / 100}`, '--pointer-from-left': `${px / 100}`,
        '--rotate-x': `${round(-(px - 50) / 7)}deg`, '--rotate-y': `${round((py - 50) / 6)}deg`
      };
      Object.entries(properties).forEach(([key, value]) => wrap.style.setProperty(key, value));
    };
    const step = ts => {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      const k = 1 - Math.exp(-((ts - lastTs) / 1000) / (ts < initialUntil ? .6 : .14));
      lastTs = ts;
      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;
      setVarsFromXY(currentX, currentY);
      if (Math.abs(targetX - currentX) > .05 || Math.abs(targetY - currentY) > .05) {
        rafId = requestAnimationFrame(step);
      } else { running = false; lastTs = 0; rafId = null; }
    };
    const start = () => {
      if (running) return;
      running = true; lastTs = 0; rafId = requestAnimationFrame(step);
    };
    return {
      setImmediate(x, y) { currentX = x; currentY = y; setVarsFromXY(x, y); },
      setTarget(x, y) { targetX = x; targetY = y; start(); },
      toCenter() { const shell = shellRef.current; if (shell) this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2); },
      beginInitial(duration) { initialUntil = performance.now() + duration; start(); },
      getCurrent() { return { x: currentX, y: currentY, tx: targetX, ty: targetY }; },
      cancel() { if (rafId !== null) cancelAnimationFrame(rafId); rafId = null; running = false; lastTs = 0; }
    };
  }, [enableTilt]);

  const move = useCallback(event => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine || event.pointerType === 'touch') return;
    const rect = shell.getBoundingClientRect();
    tiltEngine.setTarget(event.clientX - rect.left, event.clientY - rect.top);
  }, [tiltEngine]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const center = () => tiltEngine.setImmediate(shell.clientWidth / 2, shell.clientHeight / 2);
    const reset = () => { tiltEngine.cancel(); shell.classList.remove('active', 'entering'); center(); };
    const enter = event => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      shell.classList.add('active', 'entering');
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => shell.classList.remove('entering'), 180);
      move(event);
    };
    const pointerMove = event => { if (!reducedMotion.matches) move(event); };
    const leave = () => {
      if (reducedMotion.matches) { reset(); return; }
      tiltEngine.toCenter();
      const settle = () => {
        const { x, y, tx, ty } = tiltEngine.getCurrent();
        if (Math.hypot(tx - x, ty - y) < .6) { shell.classList.remove('active'); leaveRafRef.current = null; }
        else leaveRafRef.current = requestAnimationFrame(settle);
      };
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      leaveRafRef.current = requestAnimationFrame(settle);
    };
    const orientation = event => {
      if (reducedMotion.matches || event.beta == null || event.gamma == null) return;
      tiltEngine.setTarget(clamp(shell.clientWidth / 2 + event.gamma * mobileTiltSensitivity, 0, shell.clientWidth), clamp(shell.clientHeight / 2 + (event.beta - 20) * mobileTiltSensitivity, 0, shell.clientHeight));
    };
    let disposed = false;
    const activateMotion = async () => {
      if (!enableMobileTilt || reducedMotion.matches || !window.isSecureContext) return;
      const api = window.DeviceOrientationEvent;
      try {
        if (typeof api?.requestPermission === 'function' && await api.requestPermission() !== 'granted') return;
        if (!disposed) window.addEventListener('deviceorientation', orientation);
      } catch { /* Pointer interaction remains available if motion is unavailable. */ }
    };
    const visibility = () => { if (document.hidden) reset(); };
    shell.addEventListener('pointerenter', enter);
    shell.addEventListener('pointermove', pointerMove);
    shell.addEventListener('pointerleave', leave);
    shell.addEventListener('click', activateMotion);
    document.addEventListener('visibilitychange', visibility);
    reducedMotion.addEventListener('change', reset);
    const resize = new ResizeObserver(center);
    resize.observe(shell);
    center();
    return () => {
      disposed = true;
      shell.removeEventListener('pointerenter', enter);
      shell.removeEventListener('pointermove', pointerMove);
      shell.removeEventListener('pointerleave', leave);
      shell.removeEventListener('click', activateMotion);
      window.removeEventListener('deviceorientation', orientation);
      document.removeEventListener('visibilitychange', visibility);
      reducedMotion.removeEventListener('change', reset);
      resize.disconnect();
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
    };
  }, [tiltEngine, move, enableMobileTilt, mobileTiltSensitivity]);

  const cardStyle = useMemo(() => ({
    '--icon': iconUrl ? `url(${iconUrl})` : 'none', '--grain': grainUrl ? `url(${grainUrl})` : 'none',
    '--inner-gradient': innerGradient ?? 'linear-gradient(145deg, #54575d 0%, #17181b 75%)',
    '--behind-glow-color': behindGlowColor, '--behind-glow-size': behindGlowSize
  }), [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  return <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
    {behindGlowEnabled && <div className="pc-behind" aria-hidden="true" />}
    <div ref={shellRef} className="pc-card-shell"><section className="pc-card" aria-label={`${name}, ${title}`}><div className="pc-inside">
      <div className="pc-content pc-avatar-content"><img className="avatar" src={avatarUrl} alt={`${name} — INTERPRO багийн гишүүн`} loading="lazy" /></div>
      <div className="pc-shine" aria-hidden="true" /><div className="pc-glare" aria-hidden="true" />
      <div className="pc-content pc-details"><h3>{name}</h3><p>{title}</p></div>
      {showUserInfo && <div className="pc-user-info"><div className="pc-user-details"><div className="pc-mini-avatar"><img src={miniAvatarUrl || avatarUrl} alt="" loading="lazy" /></div><div className="pc-user-text"><div className="pc-handle">{handle}</div><div className="pc-status">{status}</div></div></div><button className="pc-contact-btn" type="button" aria-label={`${name}-тай холбогдох`} onClick={onContactClick}>{contactText}<span aria-hidden="true">↗</span></button></div>}
    </div></section></div>
  </div>;
}
export default React.memo(ProfileCardComponent);
