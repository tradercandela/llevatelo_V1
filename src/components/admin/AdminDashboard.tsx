import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Package, 
  Users, 
  Truck, 
  CheckCircle, 
  Clock, 
  Store as StoreIcon, 
  Plus, 
  Percent, 
  DollarSign, 
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Sparkles,
  ExternalLink,
  MapPin,
  Flame,
  Check,
  XCircle,
  BarChart3,
  RefreshCw,
  Database
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { OrderStatus, Store, Product, Courier, CategoryType } from '../../types';
import { StoreModal } from './StoreModal';
import { ProductModal } from './ProductModal';
import { RiderModal } from './RiderModal';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    stores, 
    products, 
    couriers,
    advanceOrderStatus, 
    cancelOrder,
    assignCourierToOrder,
    addStore,
    updateStore,
    deleteStore,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    addCourier,
    updateCourier,
    deleteCourier,
    toggleCourierStatus,
    setCurrentView, 
    setSelectedStoreId,
    showToast,
    isFirebaseConnected,
    syncStatus
  } = useApp();

  const [adminTab, setAdminTab] = useState<'orders' | 'stores' | 'products' | 'couriers' | 'stats'>('orders');

  // Modals state
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterStoreIdForProducts, setFilterStoreIdForProducts] = useState<string>('all');

  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

  // Filters state
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [storeSearch, setStoreSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [riderSearch, setRiderSearch] = useState('');

  // Calculations & KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 2450000);
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const activeRiders = couriers.filter(c => c.status === 'active');
  const onRouteRiders = couriers.filter(c => c.status === 'on_route');
  const openStores = stores.filter(s => s.isOpen);

  // Filtered lists
  const filteredOrders = orders.filter(ord => {
    if (orderStatusFilter === 'all') return true;
    return ord.status === orderStatusFilter;
  });

  const filteredStores = stores.filter(st => {
    const q = storeSearch.toLowerCase();
    return st.name.toLowerCase().includes(q) || st.cuisine.toLowerCase().includes(q) || st.category.toLowerCase().includes(q);
  });

  const filteredProducts = products.filter(pr => {
    const matchesStore = filterStoreIdForProducts === 'all' || pr.storeId === filterStoreIdForProducts;
    const matchesSearch = pr.name.toLowerCase().includes(productSearch.toLowerCase()) || pr.category.toLowerCase().includes(productSearch.toLowerCase());
    return matchesStore && matchesSearch;
  });

  const filteredCouriers = couriers.filter(cr => {
    const q = riderSearch.toLowerCase();
    return cr.name.toLowerCase().includes(q) || cr.phone.toLowerCase().includes(q) || cr.vehicle.toLowerCase().includes(q) || cr.plate.toLowerCase().includes(q);
  });

  // Handlers for Store CRUD
  const handleSaveStore = (storeData: Omit<Store, 'id'>, editId?: string) => {
    if (editId) {
      updateStore(editId, storeData);
    } else {
      addStore(storeData);
    }
  };

  const handleDeleteStore = (store: Store) => {
    if (confirm(`¿Estás seguro de eliminar el comercio "${store.name}" y todos sus productos?`)) {
      deleteStore(store.id);
    }
  };

  // Handlers for Product CRUD
  const handleSaveProduct = (productData: Omit<Product, 'id'>, editId?: string) => {
    if (editId) {
      updateProduct(editId, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`¿Eliminar "${product.name}" del catálogo?`)) {
      deleteProduct(product.id);
    }
  };

  // Handlers for Courier CRUD
  const handleSaveCourier = (courierData: Omit<Courier, 'id'>, editId?: string) => {
    if (editId) {
      updateCourier(editId, courierData);
    } else {
      addCourier(courierData);
    }
  };

  const handleDeleteCourier = (courier: Courier) => {
    if (confirm(`¿Retirar a "${courier.name}" de la flota?`)) {
      deleteCourier(courier.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      {/* Admin Top Sticky Navigation */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors active:scale-95 border border-slate-700/60"
            title="Volver a la App Principal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Llévatelo Operations</span>
              <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full">
                ADMIN CONSOLE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Torre de control logística, comercios, productos y flota en tiempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Database Indicator */}
          <div 
            title="Base de datos persistente en la nube (Google Cloud Firebase Firestore)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs"
          >
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200 hidden md:inline">Firebase Firestore:</span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
              {syncStatus === 'connected' ? 'En Línea' : (syncStatus === 'syncing' ? 'Sincronizando' : 'Local')}
            </span>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Ver App Cliente</span>
            <span className="sm:hidden">App</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3.5 sm:p-6 space-y-6">
        {/* KPI Metrics Summary */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Revenue */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-1 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-teal-400">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Ventas Hoy</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-black text-white">
              ${totalRevenue.toLocaleString('es-CO')}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              ● {orders.length} pedidos procesados
            </span>
          </div>

          {/* Active Orders */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-1 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">En Despacho</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-black text-white">
              {activeOrders.length}
            </p>
            <span className="text-[10px] text-amber-400 font-semibold">
              Tiempo prom: ~16 min
            </span>
          </div>

          {/* Stores */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-1 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Comercios</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <StoreIcon className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-black text-white">
              {stores.length}
            </p>
            <span className="text-[10px] text-blue-400 font-semibold">
              {openStores.length} abiertos ahora
            </span>
          </div>

          {/* Couriers */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-1 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Flota Riders</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-black text-white">
              {couriers.length}
            </p>
            <span className="text-[10px] text-purple-400 font-semibold">
              {activeRiders.length} listos • {onRouteRiders.length} en ruta
            </span>
          </div>
        </section>

        {/* Responsive Navigation Tabs */}
        <div className="overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 min-w-max">
            {[
              { id: 'orders', label: 'Pedidos en Vivo', icon: Package, badge: activeOrders.length },
              { id: 'stores', label: 'Comercios', icon: StoreIcon, badge: stores.length },
              { id: 'products', label: 'Productos & Menú', icon: Flame, badge: products.length },
              { id: 'couriers', label: 'Flota Riders', icon: Truck, badge: couriers.length },
              { id: 'stats', label: 'Métricas & KPIs', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: LIVE ORDERS KANBAN */}
        {adminTab === 'orders' && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Cola de Despacho Logístico</span>
                  <span className="bg-teal-500/20 text-teal-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    LIVE SYNC
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Controla y avanza el estado de los pedidos o reasigna repartidores
                </p>
              </div>

              {/* Status Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'confirmed', label: 'Confirmados' },
                  { id: 'preparing', label: 'Preparación' },
                  { id: 'on_the_way', label: 'En Camino' },
                  { id: 'delivered', label: 'Entregados' },
                  { id: 'cancelled', label: 'Cancelados' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setOrderStatusFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      orderStatusFilter === filter.id
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Cards */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-2">
                  <Package className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">No hay pedidos en este estado</p>
                  <p className="text-xs text-slate-500">Los nuevos pedidos se sincronizan en tiempo real.</p>
                </div>
              ) : (
                filteredOrders.map(order => {
                  const statusColors: Record<OrderStatus, string> = {
                    confirmed: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    preparing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    picked_up: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                    on_the_way: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
                    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-white">#{order.orderNumber}</span>
                          <span className="text-xs text-slate-400">• {order.createdAt}</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <span className="text-xs text-slate-400">Total:</span>
                          <span className="text-base font-black text-teal-400">
                            ${order.total.toLocaleString('es-CO')}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Items & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Productos ({order.items.reduce((s, i) => s + i.quantity, 0)})
                          </span>
                          <div className="space-y-1 text-xs text-slate-200">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-slate-800/60 px-3 py-1.5 rounded-xl">
                                <span>{it.quantity}x {it.product.name}</span>
                                <span className="text-slate-400 font-mono">${(it.product.price * it.quantity).toLocaleString('es-CO')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Destino & Pago
                          </span>
                          <div className="bg-slate-800/60 p-3 rounded-xl space-y-1 text-slate-300">
                            <p className="font-bold text-white flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-teal-400" />
                              <span>{order.deliveryAddress.fullAddress}</span>
                            </p>
                            <p className="text-slate-400 text-[11px]">{order.deliveryAddress.area}</p>
                            <p className="text-slate-400 text-[11px] pt-1">
                              Método: <span className="text-white font-bold">{order.paymentMethod.toUpperCase()}</span> • Propina: ${order.tip.toLocaleString('es-CO')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Controls: Courier Assignment & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                        {/* Courier Selector */}
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-slate-400">Rider:</span>
                          <select
                            value={order.courier?.id || ''}
                            onChange={e => assignCourierToOrder(order.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
                          >
                            <option value="">-- Sin Asignar --</option>
                            {couriers.map(cr => (
                              <option key={cr.id} value={cr.id}>
                                {cr.name} ({cr.vehicle} - {cr.status === 'active' ? 'Libre' : cr.status})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status Transition Action Buttons */}
                        <div className="flex items-center gap-2 ml-auto">
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => advanceOrderStatus(order.id, 'preparing')}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Pasar a Preparando</span>
                            </button>
                          )}

                          {order.status === 'preparing' && (
                            <button
                              onClick={() => advanceOrderStatus(order.id, 'on_the_way')}
                              className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Despachar (En Camino)</span>
                            </button>
                          )}

                          {order.status === 'on_the_way' && (
                            <button
                              onClick={() => advanceOrderStatus(order.id, 'delivered')}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Marcar Entregado</span>
                            </button>
                          )}

                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 rounded-xl text-xs font-bold transition-all"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* TAB 2: STORES MANAGEMENT (AGREGAR Y EDITAR COMERCIOS) */}
        {adminTab === 'stores' && (
          <section className="space-y-4">
            {/* Top Store Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={e => setStoreSearch(e.target.value)}
                  placeholder="Buscar comercio por nombre o cocina..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                onClick={() => {
                  setEditingStore(null);
                  setIsStoreModalOpen(true);
                }}
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Comercio</span>
              </button>
            </div>

            {/* Stores Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStores.map(store => {
                const storeProducts = products.filter(p => p.storeId === store.id);

                return (
                  <div
                    key={store.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    {/* Header Banner */}
                    <div className="relative h-28 w-full bg-slate-800">
                      <img
                        src={store.coverImage}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          store.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                        }`}>
                          {store.isOpen ? 'Abierto' : 'Cerrado'}
                        </span>
                      </div>

                      {store.isVerified && (
                        <div className="absolute top-3 right-3 bg-teal-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" /> Verificado
                        </div>
                      )}

                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-900 shadow-md absolute -bottom-3 left-4 bg-slate-800"
                      />
                    </div>

                    {/* Body */}
                    <div className="p-4 pt-5 space-y-3 flex-1">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center justify-between">
                          <span className="truncate">{store.name}</span>
                          <span className="text-xs text-amber-400 font-bold ml-2">★ {store.rating}</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{store.cuisine}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{store.address}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-slate-800/60 p-2.5 rounded-xl text-center text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Tiempo</span>
                          <span className="font-bold text-white">{store.deliveryTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Envío</span>
                          <span className="font-bold text-teal-400">
                            {store.deliveryFee === 0 ? 'Gratis' : `$${store.deliveryFee.toLocaleString('es-CO')}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">Productos</span>
                          <span className="font-bold text-white">{storeProducts.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setFilterStoreIdForProducts(store.id);
                          setAdminTab('products');
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Ver Menú</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingStore(store);
                            setIsStoreModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                          title="Editar Comercio"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStore(store)}
                          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors"
                          title="Eliminar Comercio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 3: PRODUCTS & CATALOG MANAGEMENT (AGREGAR Y ACTUALIZAR PRODUCTOS) */}
        {adminTab === 'products' && (
          <section className="space-y-4">
            {/* Top Product Filters & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Store Filter Selector */}
                <select
                  value={filterStoreIdForProducts}
                  onChange={e => setFilterStoreIdForProducts(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Todos los Comercios ({products.length} productos)</option>
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Buscar producto por nombre o categoría..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Producto</span>
              </button>
            </div>

            {/* Products Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredProducts.map(prod => {
                const store = stores.find(s => s.id === prod.storeId);

                return (
                  <div
                    key={prod.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div className="flex gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                            {store?.name || 'Comercio'}
                          </span>
                          {prod.popular && (
                            <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> Top
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-0.5">{prod.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{prod.description}</p>
                        <span className="text-sm font-black text-teal-400 block mt-1">
                          ${prod.price.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleProductAvailability(prod.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                          prod.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                        }`}
                      >
                        {prod.isAvailable ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>{prod.isAvailable ? 'En Stock' : 'Pausado'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsProductModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod)}
                          className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 4: COURIERS & RIDERS MANAGEMENT (AGREGAR Y GESTIONAR RIDERS) */}
        {adminTab === 'couriers' && (
          <section className="space-y-4">
            {/* Top Couriers Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={riderSearch}
                  onChange={e => setRiderSearch(e.target.value)}
                  placeholder="Buscar rider por nombre, placa o celular..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                onClick={() => {
                  setEditingCourier(null);
                  setIsRiderModalOpen(true);
                }}
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Rider</span>
              </button>
            </div>

            {/* Couriers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCouriers.map(rider => {
                const statusBadge = {
                  active: { label: 'Disponible', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                  on_route: { label: 'En Ruta', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                  offline: { label: 'Desconectado', color: 'bg-slate-700/60 text-slate-400 border-slate-600' }
                }[rider.status || 'active'];

                return (
                  <div
                    key={rider.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rider.avatar}
                          alt={rider.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/50 shadow-md bg-slate-800"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{rider.name}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Truck className="w-3.5 h-3.5 text-slate-500" />
                            <span>{rider.vehicle}</span>
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                            Placa: {rider.plate}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCourierStatus(rider.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all ${statusBadge.color}`}
                        title="Click para alternar estado"
                      >
                        ● {statusBadge.label}
                      </button>
                    </div>

                    {/* Stats & Phone */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-2.5 rounded-2xl text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Entregas</span>
                        <span className="font-bold text-white">{rider.completedDeliveries.toLocaleString('es-CO')} pedidos</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Calificación</span>
                        <span className="font-bold text-amber-400">★ {rider.rating}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${rider.phone}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-teal-400" />
                        <span>{rider.phone}</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCourier(rider);
                            setIsRiderModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                          title="Editar Rider"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourier(rider)}
                          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors"
                          title="Eliminar de la Flota"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 5: STATS & ANALYTICS */}
        {adminTab === 'stats' && (
          <section className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Métricas y Rendimiento Operativo</h3>
                <p className="text-xs text-slate-400">Estadísticas consolidadas de la red Llévatelo</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Ticket Promedio por Pedido</span>
                  <p className="text-xl font-bold text-teal-400">
                    ${Math.round(totalRevenue / Math.max(1, orders.length)).toLocaleString('es-CO')}
                  </p>
                  <span className="text-[10px] text-emerald-400">+12% vs semana anterior</span>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Tasa de Cumplimiento Logístico</span>
                  <p className="text-xl font-bold text-white">99.4%</p>
                  <span className="text-[10px] text-emerald-400">Excelente SLA</span>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Tiempo Promedio de Entrega</span>
                  <p className="text-xl font-bold text-amber-400">18.2 min</p>
                  <span className="text-[10px] text-slate-400">Objetivo &lt; 25 min cumplido</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Global Admin Modals */}
      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={() => {
          setIsStoreModalOpen(false);
          setEditingStore(null);
        }}
        onSave={handleSaveStore}
        initialStore={editingStore}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
        stores={stores}
        defaultStoreId={filterStoreIdForProducts !== 'all' ? filterStoreIdForProducts : undefined}
      />

      <RiderModal
        isOpen={isRiderModalOpen}
        onClose={() => {
          setIsRiderModalOpen(false);
          setEditingCourier(null);
        }}
        onSave={handleSaveCourier}
        initialCourier={editingCourier}
      />
    </div>
  );
};
