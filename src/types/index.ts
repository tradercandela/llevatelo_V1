export type CategoryType = 
  | 'restaurantes'
  | 'antojos_cafe'
  | 'plomeros_electricistas'
  | 'mantenimiento'
  | 'mensajeria'
  | 'supermercado_farmacia';

export interface Category {
  id: CategoryType;
  name: string;
  iconName: string;
  count: number;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect?: number;
  options: ProductOption[];
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string; // e.g. 'Populares', 'Especiales', 'Bebidas', 'Combos'
  isAvailable: boolean;
  popular?: boolean;
  calories?: string;
  preparationTime?: string;
  optionGroups?: ProductOptionGroup[];
}

export interface Store {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string; // e.g. "15-25 min"
  deliveryFee: number;
  minOrder: number;
  distance: string;
  category: CategoryType;
  cuisine: string; // e.g. "Italiana", "Local", "Cafetería & Donas"
  address: string;
  isOpen: boolean;
  isVerified: boolean; // "Llévatelo Verificado"
  featured?: boolean;
  categories: string[];
  phone?: string;
}

export interface QuickService {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  category: 'plumbing' | 'electrical' | 'locksmith' | 'ac' | 'courier';
  badge: string;
  priceEstimate: string;
  availableTechnicians: number;
  responseTime: string;
}

export interface CartItemOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  quantity: number;
  store: {
    id: string;
    name: string;
    deliveryFee: number;
  };
  selectedOptions?: CartItemOption[];
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface Courier {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  plate: string;
  phone: string;
  rating: number;
  completedDeliveries: number;
  status?: 'active' | 'on_route' | 'offline';
  currentLat?: number;
  currentLng?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  estimatedMinutes: number;
  deliveryAddress: Address;
  paymentMethod: PaymentMethodType;
  courier?: Courier;
  timeline: {
    confirmedAt: string;
    preparingAt?: string;
    pickedUpAt?: string;
    deliveredAt?: string;
  };
}

export interface Address {
  id: string;
  title: string; // "Casa", "Trabajo", "Pareja"
  fullAddress: string;
  area: string; // "Cañaveral, Ruitoque"
  notes?: string;
  isDefault?: boolean;
}

export type PaymentMethodType = 
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'paypal'
  | 'bizum'
  | 'cash';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  defaultAddressId: string;
  addresses: Address[];
  favorites: string[]; // store IDs
  membershipTier: 'Llévatelo Prime' | 'Estándar';
  savedCoupons: string[];
}

export interface PromotionCoupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  description: string;
  expiresAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}
