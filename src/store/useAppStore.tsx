import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Store, 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  Address, 
  PaymentMethodType, 
  UserProfile, 
  PromotionCoupon, 
  NotificationItem, 
  QuickService, 
  CategoryType,
  Courier
} from '../types';
import { STORES, PRODUCTS, COUPONS, DEFAULT_ADDRESSES, INITIAL_COURIERS } from '../data/mockData';
import {
  seedInitialDataIfEmpty,
  subscribeToStores,
  subscribeToProducts,
  subscribeToCouriers,
  subscribeToOrders,
  dbSaveStore,
  dbUpdateStore,
  dbDeleteStore,
  dbSaveProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbSaveCourier,
  dbUpdateCourier,
  dbDeleteCourier,
  dbSaveOrder,
  dbUpdateOrder
} from '../lib/firestoreService';

export type AppView = 
  | 'home'
  | 'store-detail'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'order-tracking'
  | 'profile'
  | 'admin'
  | 'quick-services';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  quickServiceModal: QuickService | null;
  setQuickServiceModal: (service: QuickService | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isMobileFrameMode: boolean;
  setIsMobileFrameMode: (isMobile: boolean) => void;

  // Catalog
  stores: Store[];
  products: Product[];
  selectedCategory: CategoryType | 'all';
  setSelectedCategory: (cat: CategoryType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favorites: string[];
  toggleFavorite: (storeId: string) => void;
  
  // Store CRUD
  addStore: (store: Omit<Store, 'id'>) => Store;
  updateStore: (storeId: string, updates: Partial<Store>) => void;
  deleteStore: (storeId: string) => void;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;

  // Couriers / Riders CRUD
  couriers: Courier[];
  addCourier: (courier: Omit<Courier, 'id'>) => Courier;
  updateCourier: (courierId: string, updates: Partial<Courier>) => void;
  deleteCourier: (courierId: string) => void;
  toggleCourierStatus: (courierId: string) => void;
  assignCourierToOrder: (orderId: string, courierId: string) => void;

  // Cart
  cart: CartItem[];
  appliedCoupon: PromotionCoupon | null;
  addToCart: (product: Product, store: Store, quantity?: number, selectedOptions?: any[], specialInstructions?: string) => void;
  updateCartItemQty: (itemId: string, delta: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartServiceFee: number;
  cartDiscount: number;
  cartTotal: number;
  cartItemCount: number;

  // Orders & Real-time tracking
  orders: Order[];
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  placeOrder: (paymentMethod: PaymentMethodType, tip: number, address: Address) => Order;
  cancelOrder: (orderId: string) => void;
  advanceOrderStatus: (orderId: string, manualStatus?: OrderStatus) => void;
  repeatOrder: (order: Order) => void;

  // User & Addresses
  user: UserProfile;
  selectedAddress: Address;
  addresses: Address[];
  setSelectedAddress: (addr: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Notifications & Toasts
  notifications: NotificationItem[];
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  markNotificationsAsRead: () => void;

  // Cloud Database (Firebase Firestore)
  isFirebaseConnected: boolean;
  syncStatus: 'connected' | 'syncing' | 'offline';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAMPLE_COURIER: Courier = {
  id: 'cour-01',
  name: 'Carlos Mendoza',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  vehicle: 'Moto Yamaha FZ 2.0',
  plate: 'LVT-89D',
  phone: '+57 317 555 9012',
  rating: 4.9,
  completedDeliveries: 1420,
  currentLat: 7.065,
  currentLng: -73.105
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [quickServiceModal, setQuickServiceModal] = useState<QuickService | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(false); // Default to full-width responsive preview, toggleable to Mobile Device Frame

  const [stores, setStores] = useState<Store[]>(STORES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [couriers, setCouriers] = useState<Courier[]>(INITIAL_COURIERS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['store-1', 'store-2']);

  // Initial cart with 2 items from Donas & Café Cañaveral as shown in reference Image 3
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      product: PRODUCTS[0], // Dona de Arequipe ($15.000)
      quantity: 1,
      store: {
        id: STORES[0].id,
        name: STORES[0].name,
        deliveryFee: STORES[0].deliveryFee
      }
    },
    {
      id: 'cart-init-2',
      product: PRODUCTS[1], // Dona Glaseada Clásica ($12.000) + topping/price adjusted or Capuchino
      quantity: 1,
      store: {
        id: STORES[0].id,
        name: STORES[0].name,
        deliveryFee: STORES[0].deliveryFee
      }
    }
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState<PromotionCoupon | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(DEFAULT_ADDRESSES[0]);

  const [user, setUser] = useState<UserProfile>({
    id: 'usr-001',
    name: 'Julián Candela',
    email: 'juliancandelacely@gmail.com',
    phone: '+57 318 700 8921',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    defaultAddressId: 'addr-1',
    addresses: DEFAULT_ADDRESSES,
    favorites: ['store-1', 'store-2'],
    membershipTier: 'Llévatelo Prime',
    savedCoupons: ['LLEVATELO10', 'ENVIOGRATIS']
  });

  // Pre-loaded active order for live tracking demo
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-9021',
      orderNumber: 'LLV-8921',
      createdAt: 'Hace 8 minutos',
      items: [
        {
          id: 'item-ord-1',
          product: PRODUCTS[0],
          quantity: 2,
          store: { id: STORES[0].id, name: STORES[0].name, deliveryFee: 0 }
        }
      ],
      subtotal: 30000,
      deliveryFee: 0,
      serviceFee: 1500,
      tip: 2000,
      discount: 0,
      total: 33500,
      status: 'on_the_way',
      estimatedMinutes: 12,
      deliveryAddress: DEFAULT_ADDRESSES[0],
      paymentMethod: 'apple_pay',
      courier: SAMPLE_COURIER,
      timeline: {
        confirmedAt: '17:28',
        preparingAt: '17:31',
        pickedUpAt: '17:36'
      }
    }
  ]);

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('ord-9021');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: '¡Tu pedido está en camino!',
      message: 'Carlos Mendoza va en camino con tu pedido de Donas & Café Cañaveral.',
      time: 'Hace 3 min',
      read: false,
      type: 'order'
    },
    {
      id: 'notif-2',
      title: 'Cupón de bienvenida activo',
      message: 'Usa el código ENVIOGRATIS en tu próxima orden.',
      time: 'Hace 1 hora',
      read: true,
      type: 'promo'
    }
  ]);

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Cloud Database (Firestore) synchronization state
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Synchronize with Firebase Firestore on mount
  useEffect(() => {
    let isMounted = true;

    // Seed database if this is the first deployment run
    seedInitialDataIfEmpty(orders)
      .then(() => {
        if (isMounted) {
          setIsFirebaseConnected(true);
          setSyncStatus('connected');
        }
      })
      .catch((err) => {
        console.warn('[Firebase] Init seed note:', err);
        if (isMounted) setSyncStatus('offline');
      });

    // Real-time Firestore subscriptions
    const unsubStores = subscribeToStores((cloudStores) => {
      if (cloudStores && cloudStores.length > 0) {
        setStores(cloudStores);
      }
    });

    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    const unsubCouriers = subscribeToCouriers((cloudCouriers) => {
      if (cloudCouriers && cloudCouriers.length > 0) {
        setCouriers(cloudCouriers);
      }
    });

    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        // Keep order newest first
        setOrders(cloudOrders);
      }
    });

    return () => {
      isMounted = false;
      unsubStores();
      unsubProducts();
      unsubCouriers();
      unsubOrders();
    };
  }, []);

  // Cart Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const optionsExtra = item.selectedOptions?.reduce((oSum, opt) => oSum + opt.price, 0) || 0;
    return sum + (item.product.price + optionsExtra) * item.quantity;
  }, 0);

  // Delivery fee from the store of items (or highest if multiple)
  const cartDeliveryFee = cart.length > 0 ? (appliedCoupon?.code === 'ENVIOGRATIS' ? 0 : (cart[0]?.store?.deliveryFee || 0)) : 0;
  const cartServiceFee = cart.length > 0 ? 1500 : 0;

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = appliedCoupon.discountAmount;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee + cartServiceFee - cartDiscount);

  const addToCart = (
    product: Product, 
    store: Store, 
    quantity: number = 1, 
    selectedOptions?: any[], 
    specialInstructions?: string
  ) => {
    // Check if cart has items from another store
    if (cart.length > 0 && cart[0].store.id !== store.id) {
      if (!confirm(`Tu carrito contiene productos de "${cart[0].store.name}". ¿Deseas vaciarlo para agregar de "${store.name}"?`)) {
        return;
      }
      setCart([]);
    }

    const newItemId = `${product.id}-${Date.now()}`;
    const newItem: CartItem = {
      id: newItemId,
      product,
      quantity,
      store: {
        id: store.id,
        name: store.name,
        deliveryFee: store.deliveryFee
      },
      selectedOptions,
      specialInstructions
    };

    setCart(prev => [...prev, newItem]);
    showToast('¡Añadido al carrito!', `${product.name} x${quantity} agregado.`);
  };

  const updateCartItemQty = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeCartItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Producto eliminado', 'Se quitó el artículo del carrito.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS.find(c => c.code === cleanCode);
    if (!coupon) {
      return { success: false, message: 'Código de cupón inválido o expirado.' };
    }
    if (cartSubtotal < coupon.minOrder) {
      return { 
        success: false, 
        message: `El pedido mínimo para este cupón es de $${coupon.minOrder.toLocaleString('es-CO')}.` 
      };
    }
    setAppliedCoupon(coupon);
    showToast('¡Cupón aplicado!', coupon.description, 'success');
    return { success: true, message: '¡Cupón aplicado exitosamente!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'Se eliminó el descuento.', 'info');
  };

  const placeOrder = (paymentMethod: PaymentMethodType, tip: number, address: Address): Order => {
    const newOrderNumber = `LLV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: 'Justo ahora',
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      serviceFee: cartServiceFee,
      tip,
      discount: cartDiscount,
      total: cartTotal + tip,
      couponCode: appliedCoupon?.code,
      status: 'confirmed',
      estimatedMinutes: 22,
      deliveryAddress: address,
      paymentMethod,
      courier: SAMPLE_COURIER,
      timeline: {
        confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    clearCart();
    setCurrentView('order-tracking');
    showToast('¡Pedido realizado con éxito!', `Número de orden: ${newOrderNumber}`, 'success');

    // Persist order to Firestore database
    dbSaveOrder(newOrder);

    // Auto progress order demo after a few seconds
    setTimeout(() => {
      advanceOrderStatus(newOrder.id, 'preparing');
    }, 6000);

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, manualStatus?: OrderStatus) => {
    let finalNextStatus: OrderStatus = manualStatus || 'preparing';
    let finalTimeline: any = null;

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        let nextStatus: OrderStatus = manualStatus || 'preparing';
        if (!manualStatus) {
          if (ord.status === 'confirmed') nextStatus = 'preparing';
          else if (ord.status === 'preparing') nextStatus = 'on_the_way';
          else if (ord.status === 'on_the_way') nextStatus = 'delivered';
        }
        finalNextStatus = nextStatus;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = { ...ord.timeline };
        if (nextStatus === 'preparing') updatedTimeline.preparingAt = now;
        if (nextStatus === 'on_the_way') updatedTimeline.pickedUpAt = now;
        if (nextStatus === 'delivered') updatedTimeline.deliveredAt = now;
        finalTimeline = updatedTimeline;

        return {
          ...ord,
          status: nextStatus,
          timeline: updatedTimeline
        };
      }
      return ord;
    }));

    // Persist status update to Firestore
    if (finalTimeline) {
      dbUpdateOrder(orderId, { status: finalNextStatus, timeline: finalTimeline });
    } else {
      dbUpdateOrder(orderId, { status: finalNextStatus });
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: 'cancelled' } : ord));
    dbUpdateOrder(orderId, { status: 'cancelled' });
    showToast('Pedido cancelado', 'Se ha gestionado la cancelación.', 'warning');
  };

  const repeatOrder = (order: Order) => {
    if (order.items && order.items.length > 0) {
      setCart([...order.items]);
      setIsCartDrawerOpen(true);
      showToast('Pedido cargado en carrito', 'Puedes revisar o modificar los productos.', 'success');
    }
  };

  const toggleFavorite = (storeId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(storeId);
      const updated = exists ? prev.filter(id => id !== storeId) : [...prev, storeId];
      showToast(exists ? 'Eliminado de favoritos' : 'Guardado en favoritos', '', 'info');
      return updated;
    });
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    setAddresses(prev => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
    showToast('Dirección guardada', 'Nueva dirección registrada.', 'success');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    showToast('Perfil actualizado', 'Tus cambios han sido guardados.', 'success');
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Store Management CRUD
  const addStore = (newStoreData: Omit<Store, 'id'>): Store => {
    const newStore: Store = {
      ...newStoreData,
      id: `store-${Date.now()}`
    };
    setStores(prev => [newStore, ...prev]);
    dbSaveStore(newStore);
    showToast('Comercio creado', `"${newStore.name}" ha sido añadido al catálogo.`, 'success');
    return newStore;
  };

  const updateStore = (storeId: string, updates: Partial<Store>) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, ...updates } : s));
    dbUpdateStore(storeId, updates);
    showToast('Comercio actualizado', 'Los cambios se han guardado exitosamente.', 'success');
  };

  const deleteStore = (storeId: string) => {
    const target = stores.find(s => s.id === storeId);
    setStores(prev => prev.filter(s => s.id !== storeId));
    setProducts(prev => prev.filter(p => p.storeId !== storeId));
    dbDeleteStore(storeId);
    showToast('Comercio eliminado', `"${target?.name || 'Comercio'}" ha sido eliminado.`, 'info');
  };

  // Product Management CRUD
  const addProduct = (newProdData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    dbSaveProduct(newProd);
    showToast('Producto agregado', `"${newProd.name}" ha sido agregado al menú.`, 'success');
    return newProd;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    dbUpdateProduct(productId, updates);
    showToast('Producto actualizado', 'Los datos del producto han sido modificados.', 'success');
  };

  const deleteProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    dbDeleteProduct(productId);
    showToast('Producto eliminado', `"${target?.name || 'Producto'}" ha sido eliminado.`, 'info');
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const isNowAvailable = !p.isAvailable;
        dbUpdateProduct(productId, { isAvailable: isNowAvailable });
        showToast(
          isNowAvailable ? 'Producto disponible' : 'Producto agotado / pausado',
          `"${p.name}" ahora está ${isNowAvailable ? 'visible para pedidos' : 'pausado temporalmente'}.`,
          isNowAvailable ? 'success' : 'warning'
        );
        return { ...p, isAvailable: isNowAvailable };
      }
      return p;
    }));
  };

  // Couriers / Riders CRUD
  const addCourier = (newCourierData: Omit<Courier, 'id'>): Courier => {
    const newCourier: Courier = {
      ...newCourierData,
      id: `cour-${Date.now()}`
    };
    setCouriers(prev => [newCourier, ...prev]);
    dbSaveCourier(newCourier);
    showToast('Rider registrado', `"${newCourier.name}" ha sido dado de alta en la flota.`, 'success');
    return newCourier;
  };

  const updateCourier = (courierId: string, updates: Partial<Courier>) => {
    setCouriers(prev => prev.map(c => c.id === courierId ? { ...c, ...updates } : c));
    dbUpdateCourier(courierId, updates);
    showToast('Rider actualizado', 'Información del repartidor actualizada.', 'success');
  };

  const deleteCourier = (courierId: string) => {
    const target = couriers.find(c => c.id === courierId);
    setCouriers(prev => prev.filter(c => c.id !== courierId));
    dbDeleteCourier(courierId);
    showToast('Rider eliminado', `"${target?.name || 'Rider'}" fue retirado de la flota.`, 'info');
  };

  const toggleCourierStatus = (courierId: string) => {
    setCouriers(prev => prev.map(c => {
      if (c.id === courierId) {
        const current = c.status || 'active';
        const nextStatus: 'active' | 'on_route' | 'offline' = 
          current === 'active' ? 'offline' : (current === 'offline' ? 'active' : 'active');
        dbUpdateCourier(courierId, { status: nextStatus });
        showToast('Estado de rider actualizado', `${c.name}: ${nextStatus.toUpperCase()}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const assignCourierToOrder = (orderId: string, courierId: string) => {
    const rider = couriers.find(c => c.id === courierId);
    if (!rider) return;
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const nextStatus: OrderStatus = ord.status === 'confirmed' || ord.status === 'preparing' ? 'on_the_way' : ord.status;
        dbUpdateOrder(orderId, { courier: rider, status: nextStatus });
        return {
          ...ord,
          courier: rider,
          status: nextStatus
        };
      }
      return ord;
    }));
    setCouriers(prev => prev.map(c => c.id === courierId ? { ...c, status: 'on_route' } : c));
    dbUpdateCourier(courierId, { status: 'on_route' });
    showToast('Rider asignado', `${rider.name} asignado al pedido.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedStoreId,
        setSelectedStoreId,
        selectedProductForModal,
        setSelectedProductForModal,
        quickServiceModal,
        setQuickServiceModal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isMobileFrameMode,
        setIsMobileFrameMode,
        stores,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        favorites,
        toggleFavorite,
        addStore,
        updateStore,
        deleteStore,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        couriers,
        addCourier,
        updateCourier,
        deleteCourier,
        toggleCourierStatus,
        assignCourierToOrder,
        cart,
        appliedCoupon,
        addToCart,
        updateCartItemQty,
        removeCartItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDeliveryFee,
        cartServiceFee,
        cartDiscount,
        cartTotal,
        cartItemCount,
        orders,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        placeOrder,
        cancelOrder,
        advanceOrderStatus,
        repeatOrder,
        user,
        selectedAddress,
        addresses,
        setSelectedAddress,
        addAddress,
        updateUserProfile,
        notifications,
        toasts,
        showToast,
        removeToast,
        markNotificationsAsRead,
        isFirebaseConnected,
        syncStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
