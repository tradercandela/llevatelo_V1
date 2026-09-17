import { Category, Store, Product, QuickService, PromotionCoupon, Address, Courier } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'restaurantes', name: 'Restaurantes', iconName: 'Utensils', count: 48 },
  { id: 'antojos_cafe', name: 'Antojos & Café', iconName: 'Coffee', count: 32 },
  { id: 'plomeros_electricistas', name: 'Plomeros & Elec', iconName: 'Wrench', count: 18 },
  { id: 'mantenimiento', name: 'Mantenimiento', iconName: 'Hammer', count: 14 },
  { id: 'supermercado_farmacia', name: 'Super & Farmacia', iconName: 'ShoppingBag', count: 26 },
  { id: 'mensajeria', name: 'Mensajería', iconName: 'Truck', count: 12 },
];

export const STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Donas & Café Cañaveral',
    tagline: 'Donas artesanales y café de especialidad',
    description: 'Donas artesanales, café de especialidad y mucho más. Todo preparado diariamente con ingredientes frescos.',
    logo: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 120,
    deliveryTime: '15-25 min',
    deliveryFee: 0,
    minOrder: 15000,
    distance: '1.2 km',
    category: 'antojos_cafe',
    cuisine: 'Cafetería & Donas',
    address: 'Cañaveral Plaza, Local 104',
    isOpen: true,
    isVerified: true,
    featured: true,
    categories: ['Populares', 'Especiales', 'Bebidas', 'Combos'],
    phone: '+57 318 450 9988'
  },
  {
    id: 'store-2',
    name: 'Pizzería La 27',
    tagline: 'Auténtica pizza al horno de leña',
    description: 'Pizzas artesanales con masa madre fermentada por 48 horas, quesos seleccionados y salsas de tomate San Marzano.',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 340,
    deliveryTime: '15-25 min',
    deliveryFee: 3500,
    minOrder: 25000,
    distance: '2.0 km',
    category: 'restaurantes',
    cuisine: 'Italiana',
    address: 'Cra 27 # 45-12, Cañaveral',
    isOpen: true,
    isVerified: true,
    featured: true,
    categories: ['Populares', 'Pizzas Clásicas', 'Pizzas Gourmet', 'Bebidas & Postres'],
    phone: '+57 312 889 0011'
  },
  {
    id: 'store-3',
    name: 'Sabor Santandereano',
    tagline: 'Tradición criolla y comida típica',
    description: 'Las mejores arepas de choclo, empanadas doradas, carne oreada y mute santandereano tradicional.',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 410,
    deliveryTime: '20-30 min',
    deliveryFee: 2900,
    minOrder: 20000,
    distance: '1.8 km',
    category: 'restaurantes',
    cuisine: 'Local & Tradicional',
    address: 'Av. El Bosque # 14-22',
    isOpen: true,
    isVerified: true,
    featured: true,
    categories: ['Populares', 'Platos Fuertes', 'Entradas & Arepas', 'Bebidas Típicas'],
    phone: '+57 315 223 7744'
  },
  {
    id: 'store-4',
    name: 'Burger & Smokehouse Co.',
    tagline: 'Hamburguesas smash y carnes ahumadas',
    description: 'Carne 100% Black Angus molida a diario, pan brioche artesanal tostado con mantequilla clarificada y salsas de autor.',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 280,
    deliveryTime: '25-35 min',
    deliveryFee: 4000,
    minOrder: 22000,
    distance: '3.1 km',
    category: 'restaurantes',
    cuisine: 'Americana & Burgers',
    address: 'Calle 31 # 24-08',
    isOpen: true,
    isVerified: true,
    featured: false,
    categories: ['Populares', 'Burgers Dobles', 'Acompañamientos', 'Bebidas'],
    phone: '+57 320 998 1234'
  },
  {
    id: 'store-5',
    name: 'Farmacia & Market Express 24h',
    tagline: 'Medicamentos, cuidado personal y snacks',
    description: 'Medicamentos certificados con entrega prioritaria garantizada en menos de 20 minutos.',
    logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 195,
    deliveryTime: '10-20 min',
    deliveryFee: 2000,
    minOrder: 10000,
    distance: '0.9 km',
    category: 'supermercado_farmacia',
    cuisine: 'Farmacia & Cuidado',
    address: 'Centro Comercial Ruitoque Mall',
    isOpen: true,
    isVerified: true,
    featured: false,
    categories: ['Medicamentos', 'Cuidado Personal', 'Bebidas & Snacks', 'Bebé'],
    phone: '+57 311 444 8899'
  }
];

export const PRODUCTS: Product[] = [
  // Products for Donas & Café Cañaveral (Store 1)
  {
    id: 'prod-101',
    storeId: 'store-1',
    name: 'Dona de Arequipe',
    description: 'Dona artesanal rellena de arequipe cremoso y topping crujiente de coco tostado.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
    category: 'Populares',
    isAvailable: true,
    popular: true,
    preparationTime: '5 min',
    optionGroups: [
      {
        id: 'opt-topping',
        name: 'Topping adicional',
        required: false,
        maxSelect: 2,
        options: [
          { id: 'top-1', name: 'Lluvia de chocolate blanco', price: 2000 },
          { id: 'top-2', name: 'Almendras laminadas', price: 3000 },
          { id: 'top-3', name: 'Chispas de caramelo', price: 1500 }
        ]
      }
    ]
  },
  {
    id: 'prod-102',
    storeId: 'store-1',
    name: 'Dona Glaseada Clásica',
    description: 'Nuestra dona icónica, esponjosa y bañada en un suave glaseado de vainilla natural.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    category: 'Populares',
    isAvailable: true,
    popular: true,
    preparationTime: '3 min'
  },
  {
    id: 'prod-103',
    storeId: 'store-1',
    name: 'Capuchino Helado',
    description: 'Espresso doble de origen, leche espumada y hielo frappé. El acompañante perfecto.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    category: 'Bebidas',
    isAvailable: true,
    popular: true,
    preparationTime: '6 min',
    optionGroups: [
      {
        id: 'opt-milk',
        name: 'Tipo de Leche',
        required: true,
        options: [
          { id: 'milk-1', name: 'Leche entera', price: 0 },
          { id: 'milk-2', name: 'Leche deslactosada', price: 0 },
          { id: 'milk-3', name: 'Bebida de almendras', price: 3000 },
          { id: 'milk-4', name: 'Bebida de avena', price: 3000 }
        ]
      },
      {
        id: 'opt-sweet',
        name: 'Nivel de Dulzor',
        required: false,
        options: [
          { id: 'sw-1', name: 'Sin azúcar', price: 0 },
          { id: 'sw-2', name: 'Con Stevia', price: 0 },
          { id: 'sw-3', name: 'Jarabe de Vainilla (+)', price: 2500 }
        ]
      }
    ]
  },
  {
    id: 'prod-104',
    storeId: 'store-1',
    name: 'Combo Pareja Dulce',
    description: '2 Donas rellenas a elección + 2 Capuchinos o Lattes calientes.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    category: 'Combos',
    isAvailable: true,
    popular: true,
    preparationTime: '10 min'
  },
  {
    id: 'prod-105',
    storeId: 'store-1',
    name: 'Dona Frutos Rojos & Nutella',
    description: 'Masa suave rellena de Nutella cremosa y coulis artesanal de frambuesas frescas.',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&auto=format&fit=crop&q=80',
    category: 'Especiales',
    isAvailable: true,
    preparationTime: '5 min'
  },

  // Products for Pizzería La 27 (Store 2)
  {
    id: 'prod-201',
    storeId: 'store-2',
    name: 'Pizza Margherita Di Bufala',
    description: 'Salsa de tomate San Marzano DOP, mozzarella di bufala fresca, albahaca y aceite de oliva virgen extra.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
    category: 'Populares',
    isAvailable: true,
    popular: true,
    preparationTime: '15 min'
  },
  {
    id: 'prod-202',
    storeId: 'store-2',
    name: 'Pizza Cuatro Quesos & Miel Trufada',
    description: 'Gorgonzola, mozzarella fior di latte, parmesano reggiano, provolone y un toque de miel con trufa.',
    price: 44000,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    category: 'Pizzas Gourmet',
    isAvailable: true,
    popular: true,
    preparationTime: '18 min'
  },

  // Products for Sabor Santandereano (Store 3)
  {
    id: 'prod-301',
    storeId: 'store-3',
    name: 'Trilogía de Empanadas y Arepa Santandereana',
    description: '3 empanadas doradas de carne desmechada con papa criolla, ají casero y mini arepa de maíz pelao.',
    price: 19500,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    category: 'Populares',
    isAvailable: true,
    popular: true,
    preparationTime: '12 min'
  },
  {
    id: 'prod-302',
    storeId: 'store-3',
    name: 'Picada Especial de la Casa',
    description: 'Carne oreada al carbón, costillitas ahumadas, chicharrón crocante, arepa de choclo y plátano maduro.',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    category: 'Platos Fuertes',
    isAvailable: true,
    popular: true,
    preparationTime: '20 min'
  }
];

export const QUICK_SERVICES: QuickService[] = [
  {
    id: 'serv-1',
    title: 'Plomeros 24/7',
    subtitle: 'Fugas, instalaciones y destapes urgentes',
    icon: 'Wrench',
    category: 'plumbing',
    badge: 'Técnico en 20 min',
    priceEstimate: 'Desde $35.000',
    availableTechnicians: 6,
    responseTime: '15-20 min'
  },
  {
    id: 'serv-2',
    title: 'Electricistas Certificados',
    subtitle: 'Cortocircuitos, cableado y luminarias',
    icon: 'Zap',
    category: 'electrical',
    badge: 'Garantía 6 meses',
    priceEstimate: 'Desde $40.000',
    availableTechnicians: 4,
    responseTime: '20-30 min'
  },
  {
    id: 'serv-3',
    title: 'Cerrajero de Urgencia',
    subtitle: 'Apertura de puertas, cambio de guardas',
    icon: 'Key',
    category: 'locksmith',
    badge: 'Disponibilidad 24h',
    priceEstimate: 'Desde $30.000',
    availableTechnicians: 5,
    responseTime: '15 min'
  },
  {
    id: 'serv-4',
    title: 'Mensajería Express Ya',
    subtitle: 'Envío de paquetes, llaves y documentos',
    icon: 'Truck',
    category: 'courier',
    badge: 'Rastreo GPS en vivo',
    priceEstimate: 'Desde $8.500',
    availableTechnicians: 12,
    responseTime: '8-12 min'
  }
];

export const COUPONS: PromotionCoupon[] = [
  {
    code: 'MANDU10',
    discountPercent: 10,
    minOrder: 25000,
    description: '10% de descuento en pedidos mayores a $25.000',
    expiresAt: '2026-12-31'
  },
  {
    code: 'LLEVATELO10',
    discountPercent: 10,
    minOrder: 25000,
    description: '10% de descuento en pedidos mayores a $25.000',
    expiresAt: '2026-12-31'
  },
  {
    code: 'ENVIOGRATIS',
    discountAmount: 4000,
    minOrder: 20000,
    description: 'Costo de envío $0 en tu compra',
    expiresAt: '2026-12-31'
  },
  {
    code: 'BIENVENIDO',
    discountAmount: 10000,
    minOrder: 30000,
    description: '$10.000 de regalo para nuevos usuarios',
    expiresAt: '2026-12-31'
  }
];

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    title: 'Casa',
    fullAddress: 'Calle 12 # 4-55, Apto 502, Torre B',
    area: 'Cañaveral, Ruitoque',
    notes: 'Timbre 502. Dejar en recepción si no contesto.',
    isDefault: true
  },
  {
    id: 'addr-2',
    title: 'Oficina / Coworking',
    fullAddress: 'Cra 27 # 36-10, Piso 8, Of. 804',
    area: 'Cabecera del Llano',
    notes: 'Anunciarse con seguridad en el lobby.',
    isDefault: false
  }
];

export const INITIAL_COURIERS: Courier[] = [
  {
    id: 'cour-01',
    name: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Moto Yamaha FZ 2.0',
    plate: 'LVT-89D',
    phone: '+57 317 555 9012',
    rating: 4.9,
    completedDeliveries: 1420,
    status: 'on_route',
    currentLat: 7.065,
    currentLng: -73.105
  },
  {
    id: 'cour-02',
    name: 'Valentina Restrepo',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Bicicleta Eléctrica Specialized',
    plate: 'ECO-24',
    phone: '+57 310 889 3321',
    rating: 4.95,
    completedDeliveries: 890,
    status: 'active',
    currentLat: 7.068,
    currentLng: -73.102
  },
  {
    id: 'cour-03',
    name: 'Andrés Felipe Gómez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Moto Bajaj Pulsar 200',
    plate: 'KJH-45F',
    phone: '+57 320 445 1190',
    rating: 4.85,
    completedDeliveries: 1120,
    status: 'active',
    currentLat: 7.071,
    currentLng: -73.109
  },
  {
    id: 'cour-04',
    name: 'Mariana Duarte',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Moto Honda CB160F',
    plate: 'TYR-90E',
    phone: '+57 315 220 8901',
    rating: 4.92,
    completedDeliveries: 650,
    status: 'offline',
    currentLat: 7.062,
    currentLng: -73.108
  }
];
