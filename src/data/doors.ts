import { Door } from '../types';

export const doorsData: Door[] = [
  {
    id: '1',
    slug: 'premium-steel-door',
    name: 'דלת פלדה פרימיום',
    short_description: 'דלת פלדה עמידה עם בידוד אקוסטי וטרמי מעולה',
    description: 'דלת פלדה איכותית עם מסגרת חזקה ובידוד מתקדם. מתאימה לכניסה ראשית ומעניקה ביטחון וחיסכון באנרגיה.',
    category: 'חוץ',
    style: ['מודרני'],
    tags: ['בידוד גבוה', 'עמיד מזג אוויר', ''],
    materials: ['פלדה', 'בידוד פוליאוריתן'],
    finishes: ['אפוקסי', 'צבע אנטי קורוזיה'],
    colors: ['שחור', 'חום', 'לבן'],
    sizes: ['80x200', '90x210', '100x210'],
    addons: ['ידית מעוצבת', 'מנעול רב בריח', 'עינית פנורמית'],
    price: null,
    price_range: null,
    images: [
      { url: 'https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg', alt: 'דלת פלדה פרימיום חזית' },
      { url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', alt: 'דלת פלדה פרימיום תקריב' }
    ],
    display_priority: 10,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    slug: 'wooden-interior-door',
    name: 'דלת עץ פנימית',
    short_description: 'דלת עץ מלא מעוצבת לחללים פנימיים',
    description: 'דלת עץ איכותית מעובדת ידנית, מושלמת לחדרים פנימיים ומעניקה תחושה חמה וביתית.',
    category: 'פנים',
    style: ['קלאסי', 'מודרני'],
    tags: ['עץ טבעי', 'מעוצבת'],
    materials: ['עץ אלון', 'MDF'],
    finishes: ['לכה שקופה', 'צבע לבן'],
    colors: ['עץ טבעי', 'לבן', 'חום כהה'],
    sizes: ['70x200', '80x200'],
    addons: ['ידיות עץ', 'צירים נסתרים'],
    images: [
      { url: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg', alt: 'דלת עץ פנימית' },
      { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', alt: 'דלת עץ פרטים' }
    ],
    display_priority: 9,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    slug: 'security-door-mamad',
    name: 'דלת ביטחון לממ"ד',
    short_description: 'דלת פלדה מיוחדת לחדר מוגן תקן ישראלי',
    description: 'דלת ביטחון המיועדת לחדר מוגן, עומדת בתקן ישראלי ומעניקה הגנה מירבית.',
    category: 'ממ"ד',
    style: ['ביטחון'],
    tags: ['תקן ישראלי', 'הגנה מירבית', 'איטום'],
    materials: ['פלדה מחוסמת', 'גומי איטום'],
    finishes: ['אפוקסי עמיד אש'],
    colors: ['ירוק צבאי', 'אפור'],
    sizes: ['80x200', '90x210'],
    addons: ['מנגנון סגירה מיוחד', 'ידיות חירום'],
    price: null,
    price_range: null,
    images: [
      { url: 'https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg', alt: 'דלת ממ"ד' }
    ],
    display_priority: 8,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    slug: 'glass-modern-door',
    name: 'דלת זכוכית מודרנית',
    short_description: 'דלת זכוכית מעוצבת למשרדים ובתים מודרניים',
    description: 'דלת זכוכית איכותית עם מסגרת אלומיניום, מושלמת לעיצוב מודרני ומעניקה תחושת מרחב.',
    category: 'זכוכית',
    style: ['מודרני', 'תעשייתי'],
    tags: ['זכוכית מחוסמת', 'עיצוב מודרני'],
    materials: ['זכוכית מחוסמת', 'אלומיניום'],
    finishes: ['אנודייז', 'פאודר קואטינג'],
    colors: ['שחור מט', 'לבן', 'אלומיניום טבעי'],
    sizes: ['80x210', '90x210', '100x210'],
    addons: ['ידיות מעוצבות', 'מנגנון סגירה עצמית'],
    price: null,
    price_range: null,
    images: [
      { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', alt: 'דלת זכוכית מודרנית' }
    ],
    display_priority: 7,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    slug: 'acoustic-door',
    name: 'דלת אקוסטית',
    short_description: 'דלת בידוד אקוסטי לסטודיו ומשרדים',
    description: 'דלת מיוחדת לבידוד אקוסטי, מתאימה לסטודיו, משרדים וחדרי ישיבות.',
    category: 'פנים',
    style: ['מקצועי'],
    tags: ['בידוד אקוסטי', 'משרדים', 'סטודיו'],
    materials: ['MDF כבד', 'חומר בידוד אקוסטי'],
    finishes: ['למינציה', 'צבע אקריליק'],
    colors: ['אפור', 'לבן', 'שחור'],
    sizes: ['80x200', '90x200'],
    addons: ['ידיות שקטות', 'אטמים אקוסטיים'],
    price: null,
    price_range: null,
    images: [
      { url: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg', alt: 'דלת אקוסטית' }
    ],
    display_priority: 6,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    slug: 'fire-resistant-door',
    name: 'דלת עמידת אש',
    short_description: 'דלת עמידת אש למבני ציבור ותעשייה',
    description: 'דלת עמידת אש המותאמת לדרישות בטיחות במבני ציבור, בתי חולים ומתקני תעשייה.',
    category: 'ביטחון',
    style: ['תעשייתי', 'ביטחון'],
    tags: ['עמידת אש', 'תקן בטיחות', 'מבני ציבור'],
    materials: ['פלדה מחוסמת', 'חומר עמיד אש'],
    finishes: ['צבע עמיד אש'],
    colors: ['אדום', 'לבן', 'אפור'],
    sizes: ['80x200', '90x210', '120x210'],
    addons: ['מנגנון סגירה אוטומטי', 'שלט בטיחות'],
    price: null,
    price_range: null,
    images: [
      { url: 'https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg', alt: 'דלת עמידת אש' }
    ],
    display_priority: 5,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const categories = [
  'כל הקטגוריות',
  'פנים',
  'חוץ',
  'ביטחון',
  'ממ"ד',
  'זכוכית',
  'פרימיום'
];

export const styles = [
  'כל הסגנונות',
  'מודרני',
  'קלאסי',
  'תעשייתי',
  'ביטחון',
  'מקצועי'
];
