export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  specsSummary: string[];
  pricePerDay: number;
  stock: number;
  stockUnit: string;
  image: string;
}

export interface PackageItem {
  id: string;
  name: string;
  targetSize: string;
  packageNum: string;
  features: string[];
  price: string;
  pricePer: string;
  isPopular?: boolean;
}

export const CATEGORIES = [
  { id: 'mic', name: 'Микрофон', count: '24 төрөл', icon: 'Mic' },
  { id: 'audio', name: 'Дууны систем', count: '18 төрөл', icon: 'Volume2' },
  { id: 'proj', name: 'Проектор', count: '12 төрөл', icon: 'Projector' },
  { id: 'screen', name: 'Дэлгэц', count: '15 төрөл', icon: 'Tv' },
  { id: 'conf', name: 'Хурлын систем', count: '9 төрөл', icon: 'Sliders' },
  { id: 'laptop', name: 'Зөөврийн PC', count: '10 төрөл', icon: 'Laptop' },
  { id: 'video', name: 'Видео аппарат', count: '8 төрөл', icon: 'Video' },
  { id: 'cable', name: 'Дагалдах утас', count: '30+ төрөл', icon: 'Cable' },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'p1', sku: 'SHU-BLX24', name: 'Shure BLX24/SM58 Утасгүй микрофон',
    category: 'Утасгүй микрофон', brand: 'Shure • АНУ',
    specsSummary: ['UHF 100m', 'SM58 капсул', '14 цаг цэнэг'],
    pricePerDay: 45000, stock: 8, stockUnit: 'ш',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2', sku: 'JBL-EON715', name: 'JBL EON715 1300W Идэвхтэй дууны систем',
    category: 'Идэвхтэй спикер', brand: 'JBL Professional',
    specsSummary: ['1300W Peak', 'Bluetooth 5.0', 'DSP EQ'],
    pricePerDay: 80000, stock: 4, stockUnit: 'хос',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3', sku: 'EPS-L630U', name: 'Epson EB-L630U 6,200 Lumen Full HD',
    category: 'Лазер проектор', brand: 'Epson • Япон',
    specsSummary: ['6,200 ANSI', 'WUXGA 1920×1200', 'Laser 20,000h'],
    pricePerDay: 120000, stock: 3, stockUnit: 'ш',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4', sku: 'BOS-DICENTIS', name: 'Bosch Dicentis Хурлын суудлын микрофон',
    category: 'Ширээний хурлын систем', brand: 'Bosch Security',
    specsSummary: ['Gooseneck', 'Санал хураалттай', 'Багцаар олгоно'],
    pricePerDay: 25000, stock: 24, stockUnit: 'ширээний нэгж',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p5', sku: 'BEH-X32COMP', name: 'Behringer X32 Compact 40-Channel Mixer',
    category: 'Дижитал миксер', brand: 'Behringer • Герман',
    specsSummary: ['32 суваг', 'Motorized Fader', 'USB Аудио карт'],
    pricePerDay: 110000, stock: 2, stockUnit: 'ш',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p6', sku: 'SNY-FW75', name: 'Sony 75" 4K HDR Дэлгэц (Хөлтэй)',
    category: 'Хурлын дэлгэц', brand: 'Sony Professional',
    specsSummary: ['4K UHD 120Hz', 'Төмөр суурь хөл', 'HDMI/Type-C'],
    pricePerDay: 150000, stock: 5, stockUnit: 'ком',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  },
];

// Map descriptive product categories to navigation categories without changing the supplied data.
export const PRODUCT_CATEGORY_IDS: Record<string, string> = {
  'Утасгүй микрофон': 'mic',
  'Идэвхтэй спикер': 'audio',
  'Дижитал миксер': 'audio',
  'Лазер проектор': 'proj',
  'Ширээний хурлын систем': 'conf',
  'Хурлын дэлгэц': 'screen',
};

export const PACKAGES: PackageItem[] = [
  {
    id: 'pkg1', name: 'Жижиг хурлын багц', targetSize: '10–30 хүн', packageNum: 'Багц №1',
    features: ['2x Shure утасгүй гар микрофон', '2x 500W Идэвхтэй PA спикер + tripod', '1x 8-сувагтай аналог миксер', '1x 4,000 ANSI Full HD проектор'],
    price: '250,000₮', pricePer: '/ өдөр',
  },
  {
    id: 'pkg2', name: 'Дунд хэмжээний хурал', targetSize: '30–80 хүн', packageNum: 'Багц №2',
    features: ['4x Shure UHF Утасгүй гар микрофон', '2x JBL EON715 (1300W) + Монитор', '1x 65" 4K Sony presentation дэлгэц', '1x Roland видео switcher + оператор'],
    price: '450,000₮', pricePer: '/ өдөр', isPopular: true,
  },
  {
    id: 'pkg3', name: 'Том арга хэмжээ & Форум', targetSize: '80+ хүн', packageNum: 'Багц №3',
    features: ['RCF Line Array бүрэн өлгөдөг систем', 'Behringer X32 дижитал консол', 'P2.9 Тайзны LED дэлгэц (Хэмжээгээр)', 'Инженерийн багийн бүрэн хяналт'],
    price: 'Үнийн санал авах', pricePer: '/ Тусгай тооцоо',
  },
];
