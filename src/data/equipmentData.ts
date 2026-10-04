export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  image: string;
}

export const CATEGORIES = [
  { id: 'conf', name: 'Хурлын систем' },
  { id: 'interpretation', name: 'Орчуулгын төхөөрөмж' },
  { id: 'audio', name: 'Аудио төхөөрөмж' },
  { id: 'screen', name: 'Дэлгэц' },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'pro1', sku: 'PRO-01', name: 'Хурлын болон синхрон орчуулгын систем',
    category: 'Хурлын систем', brand: 'HUAIN',
    description: 'Хурлын микрофон, орчуулагчийн консол болон камер бүхий төхөөрөмжүүд. Уулзалт, хэлэлцүүлэг, олон хэлний хуралд ашиглана.',
    image: '/pro1.jpeg',
  },
  {
    id: 'pro2', sku: 'PRO-02', name: 'Орчуулгын хүлээн авагч, чихэвчийн багц',
    category: 'Орчуулгын төхөөрөмж', brand: '',
    description: 'Оролцогчид орчуулгыг чихэвчээр сонсох хүлээн авагч төхөөрөмж. Чихэвч болон тээвэрлэх хайрцагтай багц.',
    image: '/pro2.jpeg',
  },
  {
    id: 'pro3', sku: 'PRO-03', name: 'AKG K72 чихэвч',
    category: 'Аудио төхөөрөмж', brand: 'AKG',
    description: 'Толгой дээр зүүдэг утастай чихэвч. Орчуулга сонсох болон аудио системийн дууг хянахад ашиглана.',
    image: '/pro3.jpeg',
  },
  {
    id: 'pro4', sku: 'PRO-04', name: 'PreSonus StudioLive AR8c миксер',
    category: 'Аудио төхөөрөмж', brand: 'PreSonus',
    description: 'Микрофон болон бусад аудио эх үүсвэрийг холбож, дууны түвшнийг тохируулах миксер. Хурлын аудио системд ашиглана.',
    image: '/pro4.jpeg',
  },
  {
    id: 'pro5', sku: 'PRO-05', name: 'Илтгэгчийн хяналтын дэлгэц',
    category: 'Дэлгэц', brand: '',
    description: 'Илтгэгчид танилцуулга, тэмдэглэл болон үлдсэн хугацаагаа харах зориулалттай дэлгэц. Тайзны өмнө байрлуулж ашиглана.',
    image: '/pro5.jpeg',
  },
];

export const PRODUCT_CATEGORY_IDS: Record<string, string> = {
  'Хурлын систем': 'conf',
  'Орчуулгын төхөөрөмж': 'interpretation',
  'Аудио төхөөрөмж': 'audio',
  'Дэлгэц': 'screen',
};
