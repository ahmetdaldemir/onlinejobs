import { Category } from '../categories/entities/category.entity';

export const categoriesSeed: Partial<Category>[] = [
  {
    name: 'Elektrikçi',
    description: 'Elektrik tesisatı, arıza giderme, bakım onarım',
    icon: '⚡',
    orderIndex: 1,
  },
  {
    name: 'Sıhhi Tesisatçı',
    description: 'Su tesisatı, kanalizasyon, ısıtma sistemleri',
    icon: '🚰',
    orderIndex: 2,
  },
  {
    name: 'Taksici',
    description: 'Şehir içi ve şehirler arası ulaşım',
    icon: '🚕',
    orderIndex: 3,
  },
  {
    name: 'Temizlikçi',
    description: 'Ev ve ofis temizliği, genel temizlik hizmetleri',
    icon: '🧹',
    orderIndex: 4,
  },
  {
    name: 'Bakıcı',
    description: 'Çocuk, yaşlı ve hasta bakımı',
    icon: '👶',
    orderIndex: 5,
  },
  {
    name: 'Bahçıvan',
    description: 'Bahçe bakımı, çim biçme, ağaç budama',
    icon: '🌱',
    orderIndex: 6,
  },
  {
    name: 'Tesisatçı',
    description: 'Doğalgaz, su, ısıtma tesisatı',
    icon: '🔧',
    orderIndex: 7,
  },
  {
    name: 'Boya Badana',
    description: 'İç ve dış cephe boya, badana işleri',
    icon: '🎨',
    orderIndex: 8,
  },
  {
    name: 'Marangoz',
    description: 'Ahşap işleri, mobilya yapımı ve tamiri',
    icon: '🪚',
    orderIndex: 9,
  },
  {
    name: 'Çilingir',
    description: 'Kilit açma, anahtar yapımı',
    icon: '🔑',
    orderIndex: 10,
  },
  {
    name: 'Klima Teknisyeni',
    description: 'Klima montaj, bakım, onarım',
    icon: '❄️',
    orderIndex: 11,
  },
  {
    name: 'Asansör Teknisyeni',
    description: 'Asansör bakım, onarım, montaj',
    icon: '🛗',
    orderIndex: 12,
  },
  {
    name: 'Çatı Ustası',
    description: 'Çatı yapımı, onarımı, izolasyon',
    icon: '🏠',
    orderIndex: 13,
  },
  {
    name: 'Seramikçi',
    description: 'Seramik, fayans döşeme işleri',
    icon: '🧱',
    orderIndex: 14,
  },
  {
    name: 'Demirci',
    description: 'Demir işleri, kaynak, metal işleme',
    icon: '🔨',
    orderIndex: 15,
  },
]; 