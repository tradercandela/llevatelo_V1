import React, { useState } from 'react';
import { 
  Store as StoreIcon, 
  Package, 
  Truck, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  SlidersHorizontal,
  LayoutDashboard,
  Layers,
  ChevronDown,
  Sparkles,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { Store, Product, Courier, Order, OrderStatus, AuditLogItem } from '../../types';
import { AlertsCenter } from './AlertsCenter';
import { AdminStoresList } from './AdminStoresList';
import { BusinessDetailView } from './BusinessDetailView';
import { ProductManagementTable } from './ProductManagementTable';
import { ProductEditorDrawer } from './ProductEditorDrawer';
import { StoreModal } from './StoreModal';
import { RiderModal } from './RiderModal';
import { INITIAL_AUDIT_LOGS } from './adminHelpers';

type AdminMainTab = 'overview' | 'stores' | 'products' | 'orders' | 'couriers' | 'stats';

export const AdminDashboard: React.FC = () => {
  const {
    stores,
    products,
    couriers,
    orders,
    syncStatus,
    setCurrentView,
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
    advanceOrderStatus,
    assignRiderToOrder
  } = useApp();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<AdminMainTab>('overview');
  const [selectedStoreForDetailId, setSelectedStoreForDetailId] = useState<string | null>(null);

  // Global Product tab filter
  const [productTabStoreFilter, setProductTabStoreFilter] = useState<string>('all');

  // Modals state
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productDrawerStore, setProductDrawerStore] = useState<Store>(stores[0]);

  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = (action: string, details: string, storeName?: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      storeName: storeName || 'Plataforma MANDÚ',
      user: 'Julián Candela (Admin)',
      action,
      details,
      timestamp: 'Ahora mismo'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 40)]);
  };

  // Currently selected store for deep view (if any)
  const selectedStore = stores.find(s => s.id === selectedStoreForDetailId);

  // Filtered products for the global product tab
  const productsForProductTab = productTabStoreFilter === 'all'
    ? products
    : products.filter(p => p.storeId === productTabStoreFilter);

  // Handlers for Store CRUD
  const handleSaveStoreModal = (storeData: Omit<Store, 'id'>, editId?: string) => {
    if (editId) {
      updateStore(editId, storeData);
      addAuditLog('Actualización de Comercio', `Comercio "${storeData.name}" modificado`, storeData.name);
    } else {
      const created = addStore(storeData);
      addAuditLog('Nuevo Comercio', `Se registró "${created.name}" en la plataforma`, created.name);
    }
  };

  const handleOpenEditStoreModal = (store: Store) => {
    setEditingStore(store);
    setIsStoreModalOpen(true);
  };

  const handleOpenAddStoreModal = () => {
    setEditingStore(null);
    setIsStoreModalOpen(true);
  };

  // Handlers for Product CRUD
  const handleSaveProductDrawer = (prodData: Omit<Product, 'id'>, editId?: string) => {
    if (editId) {
      updateProduct(editId, prodData);
      addAuditLog('Edición de Producto', `Se actualizó "${prodData.name}"`, productDrawerStore.name);
    } else {
      addProduct(prodData);
      addAuditLog('Creación de Producto', `Nuevo producto "${prodData.name}"`, productDrawerStore.name);
    }
  };

  const handleOpenAddProduct = (defaultStore?: Store) => {
    const targetStore = defaultStore || (productTabStoreFilter !== 'all' ? stores.find(s => s.id === productTabStoreFilter) : stores[0]) || stores[0];
    setProductDrawerStore(targetStore);
    setEditingProduct(null);
    setIsProductDrawerOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    const parentStore = stores.find(s => s.id === prod.storeId) || stores[0];
    setProductDrawerStore(parentStore);
    setEditingProduct(prod);
    setIsProductDrawerOpen(true);
  };

  // Handlers for Couriers
  const handleSaveCourierModal = (courierData: Omit<Courier, 'id'>, editId?: string) => {
    if (editId) {
      updateCourier(editId, courierData);
      addAuditLog('Actualización de Repartidor', `Datos de "${courierData.name}" modificados`);
    } else {
      addCourier(courierData);
      addAuditLog('Nuevo Repartidor', `Rider "${courierData.name}" registrado`);
    }
  };

  // Bulk Product actions
  const handleBulkUpdateAvailability = (ids: string[], isAvailable: boolean) => {
    ids.forEach(id => {
      updateProduct(id, { isAvailable });
    });
    addAuditLog('Disponibilidad Masiva', `${ids.length} productos marcados como ${isAvailable ? 'Disponibles' : 'Agotados'}`);
  };

  const handleBulkDeleteProducts = (ids: string[]) => {
    ids.forEach(id => {
      deleteProduct(id);
    });
    addAuditLog('Eliminación Masiva', `Se eliminaron ${ids.length} productos`);
  };

  // Order status advance
  const handleAdvanceOrderStatus = (orderId: string, status?: OrderStatus) => {
    advanceOrderStatus(orderId, status);
    addAuditLog('Despacho de Pedido', `Pedido ${orderId} avanzado a ${status || 'siguiente fase'}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans">
      {/* Top Professional Executive Header */}
      <header className="bg-white border-b border-[#E4E7EC] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-teal-500/30">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black tracking-tight text-[#111827] uppercase">
                    MANDÚ Admin
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold">
                    v2.0 Console
                  </span>
                </div>
                <p className="text-[11px] text-[#667085]">
                  Gestión Comercial, Catálogo & Despacho
                </p>
              </div>
            </div>

            {/* Middle Quick Store Switcher (if on desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-[#667085] font-medium">Comercio activo:</span>
              <select
                value={selectedStoreForDetailId || 'all'}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'all') {
                    setSelectedStoreForDetailId(null);
                  } else {
                    setSelectedStoreForDetailId(val);
                  }
                }}
                className="text-xs px-3 py-1.5 rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] text-[#111827] font-semibold focus:outline-none focus:border-teal-600 focus:bg-white"
              >
                <option value="all">Todos los Comercios ({stores.length})</option>
                {stores.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.cuisine})
                  </option>
                ))}
              </select>
            </div>

            {/* Right Actions & Sync Status */}
            <div className="flex items-center gap-3">
              {/* Cloud Sync Status */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E4E7EC] bg-[#F9FAFB] text-[11px]">
                <span className={`w-2 h-2 rounded-full ${syncStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="font-semibold text-[#344054]">
                  {syncStatus === 'online' ? 'Firestore Sincronizado' : 'Modo Local'}
                </span>
              </div>

              {/* Jump to customer app */}
              <button
                onClick={() => setCurrentView('home')}
                className="px-3.5 py-1.5 rounded-xl border border-[#D0D5DD] hover:bg-[#F9FAFB] text-xs font-semibold text-[#344054] flex items-center gap-1.5 transition-colors"
                title="Abrir la experiencia del cliente"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#667085]" />
                <span className="hidden sm:inline">Ver Tienda de Clientes</span>
                <span className="sm:hidden">Tienda</span>
              </button>
            </div>
          </div>

          {/* Primary Top Navigation Tabs (when not inside deep detail view) */}
          {!selectedStoreForDetailId && (
            <nav className="flex items-center gap-1 sm:gap-6 overflow-x-auto no-scrollbar pt-1 border-t border-[#F2F4F7]">
              <button
                onClick={() => setCurrentTab('overview')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === 'overview'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-[#667085] hover:text-[#111827]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Vista General</span>
              </button>

              <button
                onClick={() => setCurrentTab('stores')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === 'stores'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-[#667085] hover:text-[#111827]'
                }`}
              >
                <StoreIcon className="w-4 h-4" />
                <span>Comercios ({stores.length})</span>
              </button>

              <button
                onClick={() => setCurrentTab('products')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === 'products'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-[#667085] hover:text-[#111827]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Catálogo & Productos ({products.length})</span>
              </button>

              <button
                onClick={() => setCurrentTab('orders')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === 'orders'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-[#667085] hover:text-[#111827]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Despacho de Pedidos ({orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})</span>
              </button>

              <button
                onClick={() => setCurrentTab('couriers')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === 'couriers'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-[#667085] hover:text-[#111827]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Flota Riders ({couriers.length})</span>
              </button>

              <button
                onClick={() => setCurrentTab('stats')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === 'stats'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-[#667085] hover:text-[#111827]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Métricas Globales</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* CASE A: Deep Business Detail View */}
        {selectedStore ? (
          <BusinessDetailView
            store={selectedStore}
            products={products}
            orders={orders}
            auditLogs={auditLogs.filter(l => l.storeName === selectedStore.name || !l.storeName)}
            onBack={() => setSelectedStoreForDetailId(null)}
            onUpdateStore={updatedData => updateStore(selectedStore.id, updatedData)}
            onSaveProduct={handleSaveProductDrawer}
            onDeleteProduct={deleteProduct}
            onToggleProductAvailability={toggleProductAvailability}
            onQuickUpdatePrice={(id, price) => updateProduct(id, { price })}
            onBulkUpdateAvailability={handleBulkUpdateAvailability}
            onBulkDeleteProducts={handleBulkDeleteProducts}
            onUpdateCategories={newCategories => updateStore(selectedStore.id, { categories: newCategories })}
            onRenameCategory={(oldName, newName) => {
              const updatedCats = (selectedStore.categories || []).map(c => c === oldName ? newName : c);
              updateStore(selectedStore.id, { categories: updatedCats });
              // Update products belonging to this store
              products.filter(p => p.storeId === selectedStore.id && p.category === oldName).forEach(p => {
                updateProduct(p.id, { category: newName });
              });
            }}
            onAddAuditLog={(action, details) => addAuditLog(action, details, selectedStore.name)}
          />
        ) : (
          /* CASE B: General Multi-Tab Dashboard */
          <>
            {/* TAB 1: OVERVIEW */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                {/* Executive KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#667085]">Comercios Registrados</span>
                      <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                        <StoreIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#111827]">
                      {stores.length}
                    </div>
                    <p className="text-[11px] text-[#667085] mt-1">
                      {stores.filter(s => s.isOpen).length} abiertos ahora para despacho
                    </p>
                  </div>

                  <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#667085]">Productos en Menú</span>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#111827]">
                      {products.length}
                    </div>
                    <p className="text-[11px] text-[#667085] mt-1">
                      {products.filter(p => p.isAvailable).length} en stock / {products.filter(p => !p.isAvailable).length} agotados
                    </p>
                  </div>

                  <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#667085]">Flota de Repartidores</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#111827]">
                      {couriers.length}
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      {couriers.filter(c => c.status === 'active' || c.status === 'on_route').length} activos en calle
                    </p>
                  </div>

                  <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#667085]">Pedidos Activos</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#111827]">
                      {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                    </div>
                    <p className="text-[11px] text-[#667085] mt-1">
                      {orders.length} pedidos históricos en sistema
                    </p>
                  </div>
                </div>

                {/* Centro de Diagnóstico y Alertas */}
                <AlertsCenter
                  stores={stores}
                  products={products}
                  onSelectStore={storeId => setSelectedStoreForDetailId(storeId)}
                  onFilterOutOfStock={() => setCurrentTab('products')}
                />

                {/* Quick Action Shortcuts */}
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-[#111827] mb-3">Acciones Rápidas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      onClick={handleOpenAddStoreModal}
                      className="p-3.5 rounded-xl border border-[#D0D5DD] hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <Plus className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#111827]">Registrar Comercio</h4>
                      <p className="text-[11px] text-[#667085]">Crear un nuevo establecimiento</p>
                    </button>

                    <button
                      onClick={() => handleOpenAddProduct()}
                      className="p-3.5 rounded-xl border border-[#D0D5DD] hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <Package className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#111827]">Añadir Producto</h4>
                      <p className="text-[11px] text-[#667085]">Agregar ítem al catálogo</p>
                    </button>

                    <button
                      onClick={() => setCurrentTab('orders')}
                      className="p-3.5 rounded-xl border border-[#D0D5DD] hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#111827]">Despachar Pedidos</h4>
                      <p className="text-[11px] text-[#667085]">Ver cola activa de órdenes</p>
                    </button>

                    <button
                      onClick={() => {
                        setEditingCourier(null);
                        setIsRiderModalOpen(true);
                      }}
                      className="p-3.5 rounded-xl border border-[#D0D5DD] hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <Truck className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#111827]">Nuevo Repartidor</h4>
                      <p className="text-[11px] text-[#667085]">Vincular rider a la flota</p>
                    </button>
                  </div>
                </div>

                {/* Quick Stores Grid */}
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">Comercios Destacados</h3>
                      <p className="text-xs text-[#667085]">Selecciona un negocio para administrar su catálogo completo</p>
                    </div>
                    <button
                      onClick={() => setCurrentTab('stores')}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      <span>Ver todos ({stores.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stores.slice(0, 6).map(s => {
                      const count = products.filter(p => p.storeId === s.id).length;
                      return (
                        <div 
                          key={s.id}
                          className="p-4 rounded-xl border border-[#E4E7EC] hover:border-teal-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-[#E4E7EC] flex-shrink-0">
                              <img src={s.logo} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-[#111827] truncate">{s.name}</h4>
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              </div>
                              <p className="text-[11px] text-[#667085] truncate">{s.cuisine || 'Comercio'}</p>
                              <span className="text-[10px] text-[#98A2B3]">{count} productos registrados</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedStoreForDetailId(s.id)}
                            className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Administrar Negocio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Log Overview */}
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-[#111827]">Historial Reciente de Operaciones</h3>
                  <div className="divide-y divide-[#E4E7EC] border border-[#E4E7EC] rounded-xl overflow-hidden text-xs">
                    {auditLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="p-3 flex items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-[#111827]">{log.action}</span>
                          <span className="text-[#667085] ml-2">({log.storeName})</span>
                          <p className="text-[11px] text-[#667085]">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-[#98A2B3] whitespace-nowrap">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STORES DIRECTORY */}
            {currentTab === 'stores' && (
              <AdminStoresList
                stores={stores}
                products={products}
                onSelectStore={storeId => setSelectedStoreForDetailId(storeId)}
                onAddNewStore={handleOpenAddStoreModal}
                onEditStoreInfo={handleOpenEditStoreModal}
                onDeleteStore={deleteStore}
                onQuickToggleStoreStatus={(storeId, current) => {
                  updateStore(storeId, { isOpen: !current });
                  addAuditLog('Cambio Rápido de Estado', `Comercio ${!current ? 'Abierto' : 'Cerrado'}`);
                }}
              />
            )}

            {/* TAB 3: PRODUCTS & CATALOG */}
            {currentTab === 'products' && (
              <div className="space-y-4">
                {/* Store selector for products */}
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#111827]">Filtrar por comercio:</span>
                    <select
                      value={productTabStoreFilter}
                      onChange={e => setProductTabStoreFilter(e.target.value)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] text-[#111827] font-semibold focus:outline-none focus:border-teal-600"
                    >
                      <option value="all">Todos los Comercios ({products.length} productos)</option>
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({products.filter(p => p.storeId === s.id).length} productos)
                        </option>
                      ))}
                    </select>
                  </div>

                  {productTabStoreFilter !== 'all' && (
                    <button
                      onClick={() => setSelectedStoreForDetailId(productTabStoreFilter)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      <span>Abrir vista completa de este comercio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <ProductManagementTable
                  products={productsForProductTab}
                  store={productTabStoreFilter !== 'all' ? stores.find(s => s.id === productTabStoreFilter) : undefined}
                  allStores={stores}
                  onAddProduct={() => handleOpenAddProduct()}
                  onEditProduct={handleOpenEditProduct}
                  onDeleteProduct={deleteProduct}
                  onToggleAvailability={toggleProductAvailability}
                  onQuickUpdatePrice={(id, price) => updateProduct(id, { price })}
                  onBulkUpdateAvailability={handleBulkUpdateAvailability}
                  onBulkDelete={handleBulkDeleteProducts}
                />
              </div>
            )}

            {/* TAB 4: ORDERS DISPATCH */}
            {currentTab === 'orders' && (
              <div className="space-y-5">
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">Centro de Despacho & Pedidos en Vivo</h3>
                    <p className="text-xs text-[#667085]">
                      Supervisa órdenes entrantes, tiempos de cocina y asignación de repartidores en tiempo real
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                      {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length} órdenes en curso
                    </span>
                  </div>
                </div>

                {/* Orders Kanban Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Column 1: Pendientes */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Pendientes / Confirmados</span>
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center">
                        {orders.filter(o => o.status === 'confirmed').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {orders.filter(o => o.status === 'confirmed').map(order => (
                        <div key={order.id} className="p-3.5 rounded-2xl border border-[#E4E7EC] bg-white shadow-xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#111827]">#{order.orderNumber}</span>
                            <span className="text-[10px] text-[#667085]">{order.timeline?.confirmedAt || 'Hace poco'}</span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-teal-800">{order.storeName}</h4>
                            <p className="text-[11px] text-[#667085]">{order.items?.length} productos · ${order.total?.toLocaleString('es-CO')}</p>
                          </div>

                          <button
                            onClick={() => handleAdvanceOrderStatus(order.id, 'preparing')}
                            className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Pasar a Preparación →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: En Preparación */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900">En Cocina / Preparación</span>
                      <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-bold flex items-center justify-center">
                        {orders.filter(o => o.status === 'preparing').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {orders.filter(o => o.status === 'preparing').map(order => (
                        <div key={order.id} className="p-3.5 rounded-2xl border border-[#E4E7EC] bg-white shadow-xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#111827]">#{order.orderNumber}</span>
                            <span className="text-[10px] text-[#667085]">{order.timeline?.preparingAt || 'Preparando'}</span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-teal-800">{order.storeName}</h4>
                            <p className="text-[11px] text-[#667085]">{order.deliveryAddress?.label || 'Dirección de entrega'}</p>
                          </div>

                          {/* Rider assigner */}
                          <div className="pt-1 border-t border-[#F2F4F7]">
                            <label className="text-[10px] font-bold text-[#667085] block mb-1">Rider Asignado:</label>
                            <select
                              value={order.courier?.id || couriers[0]?.id}
                              onChange={e => assignRiderToOrder(order.id, e.target.value)}
                              className="w-full text-xs px-2 py-1 rounded-lg border border-[#D0D5DD] bg-white text-[#111827]"
                            >
                              {couriers.map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.vehicle})
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => handleAdvanceOrderStatus(order.id, 'on_the_way')}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Despachar en Ruta →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: En Ruta */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-900">En Ruta de Entrega</span>
                      <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-bold flex items-center justify-center">
                        {orders.filter(o => o.status === 'on_the_way').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {orders.filter(o => o.status === 'on_the_way').map(order => (
                        <div key={order.id} className="p-3.5 rounded-2xl border border-[#E4E7EC] bg-white shadow-xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#111827]">#{order.orderNumber}</span>
                            <span className="text-[10px] text-teal-700 font-bold">En camino</span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-[#111827]">{order.deliveryAddress?.label || 'Dirección cliente'}</h4>
                            <p className="text-[11px] text-[#667085]">Rider: {order.courier?.name || 'Rider Asignado'}</p>
                          </div>

                          <button
                            onClick={() => handleAdvanceOrderStatus(order.id, 'delivered')}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            ✓ Marcar como Entregado
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: Entregados */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">Entregados Hoy</span>
                      <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold flex items-center justify-center">
                        {orders.filter(o => o.status === 'delivered').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {orders.filter(o => o.status === 'delivered').slice(0, 5).map(order => (
                        <div key={order.id} className="p-3 rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#111827]">#{order.orderNumber}</span>
                            <span className="text-[10px] text-emerald-700 font-bold">Completado</span>
                          </div>
                          <p className="text-[11px] text-[#667085]">{order.storeName} · ${order.total?.toLocaleString('es-CO')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: COURIERS */}
            {currentTab === 'couriers' && (
              <div className="space-y-5">
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">Flota de Repartidores & Riders</h3>
                    <p className="text-xs text-[#667085]">
                      Gestión de conductores activos, vehículos, estado de conexión y entregas
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingCourier(null);
                      setIsRiderModalOpen(true);
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar Rider</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {couriers.map(rider => (
                    <div key={rider.id} className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs">
                          <img src={rider.avatar} alt={rider.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-[#111827]">{rider.name}</h4>
                          <p className="text-[11px] text-[#667085]">{rider.vehicle} · {rider.plate}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-amber-500 font-bold text-[11px]">★ {rider.rating}</span>
                            <span className="text-[10px] text-[#98A2B3]">({rider.completedDeliveries} entregas)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F2F4F7] text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rider.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : rider.status === 'on_route' 
                            ? 'bg-amber-50 text-amber-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rider.status === 'active' ? 'Disponible' : rider.status === 'on_route' ? 'En ruta' : 'Desconectado'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCourier(rider);
                              setIsRiderModalOpen(true);
                            }}
                            className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteCourier(rider.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: METRICS / STATS */}
            {currentTab === 'stats' && (
              <div className="space-y-6">
                <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs">
                  <h3 className="text-base font-bold text-[#111827] mb-1">Métricas de Plataforma & Marketplace</h3>
                  <p className="text-xs text-[#667085]">Monitoreo de SLAs, volumen de transacciones y conversión</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs space-y-1">
                    <span className="text-xs text-[#667085]">Tasa de Cumplimiento Logístico</span>
                    <p className="text-2xl font-bold text-emerald-700">99.4%</p>
                    <span className="text-[11px] text-emerald-700">SLA Óptimo en Cañaveral</span>
                  </div>

                  <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs space-y-1">
                    <span className="text-xs text-[#667085]">Tiempo Promedio de Entrega</span>
                    <p className="text-2xl font-bold text-teal-700">18.2 min</p>
                    <span className="text-[11px] text-[#667085]">Meta &lt; 25 min cumplida</span>
                  </div>

                  <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs space-y-1">
                    <span className="text-xs text-[#667085]">Índice de Stock Activo</span>
                    <p className="text-2xl font-bold text-indigo-700">
                      {Math.round((products.filter(p => p.isAvailable).length / (products.length || 1)) * 100)}%
                    </p>
                    <span className="text-[11px] text-[#667085]">Salud del inventario</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={() => {
          setIsStoreModalOpen(false);
          setEditingStore(null);
        }}
        onSave={handleSaveStoreModal}
        initialStore={editingStore}
      />

      <ProductEditorDrawer
        isOpen={isProductDrawerOpen}
        onClose={() => {
          setIsProductDrawerOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProductDrawer}
        initialProduct={editingProduct}
        store={productDrawerStore}
      />

      <RiderModal
        isOpen={isRiderModalOpen}
        onClose={() => {
          setIsRiderModalOpen(false);
          setEditingCourier(null);
        }}
        onSave={handleSaveCourierModal}
        initialCourier={editingCourier}
      />
    </div>
  );
};
