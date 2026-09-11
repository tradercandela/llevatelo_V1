import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Store as StoreIcon, 
  Package, 
  Layers, 
  Calendar, 
  TrendingUp, 
  Eye, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  PauseCircle, 
  XCircle,
  Plus,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  Phone
} from 'lucide-react';
import { Store, Product, Order, AuditLogItem } from '../../types';
import { STATUS_EXPLANATIONS } from './adminHelpers';
import { ProductManagementTable } from './ProductManagementTable';
import { ProductEditorDrawer } from './ProductEditorDrawer';
import { CategoryManager } from './CategoryManager';
import { BusinessInfoEditor } from './BusinessInfoEditor';
import { BusinessAnalyticsView } from './BusinessAnalyticsView';
import { BusinessLivePreview } from './BusinessLivePreview';

interface BusinessDetailViewProps {
  store: Store;
  products: Product[];
  orders: Order[];
  auditLogs: AuditLogItem[];
  onBack: () => void;
  onUpdateStore: (updatedData: Partial<Store>) => void;
  onSaveProduct: (productData: Omit<Product, 'id'>, editId?: string) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleProductAvailability: (productId: string, currentStatus: boolean) => void;
  onQuickUpdatePrice: (productId: string, newPrice: number) => void;
  onBulkUpdateAvailability: (productIds: string[], isAvailable: boolean) => void;
  onBulkDeleteProducts: (productIds: string[]) => void;
  onUpdateCategories: (newCategories: string[]) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onAddAuditLog: (action: string, details: string) => void;
}

export const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({
  store,
  products,
  orders,
  auditLogs,
  onBack,
  onUpdateStore,
  onSaveProduct,
  onDeleteProduct,
  onToggleProductAvailability,
  onQuickUpdatePrice,
  onBulkUpdateAvailability,
  onBulkDeleteProducts,
  onUpdateCategories,
  onRenameCategory,
  onAddAuditLog
}) => {
  const [activeTab, setActiveTab] = useState<'productos' | 'categorias' | 'informacion' | 'analitica' | 'previsualizacion' | 'auditoria'>('productos');
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Products belonging to this store
  const storeProducts = products.filter(p => p.storeId === store.id);

  // Status computation
  const currentStatusMode = store.statusMode || (store.isOpen ? 'open' : 'closed');
  const statusConfig = STATUS_EXPLANATIONS[currentStatusMode] || STATUS_EXPLANATIONS.open;

  // Status changer handler
  const handleStatusChange = (newMode: 'open' | 'closed' | 'paused' | 'unavailable') => {
    const isNowOpen = newMode === 'open';
    onUpdateStore({
      statusMode: newMode,
      isOpen: isNowOpen
    });
    onAddAuditLog(
      'Cambio de Estado del Negocio',
      `Estado actualizado a ${STATUS_EXPLANATIONS[newMode]?.title || newMode}`
    );
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsProductDrawerOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Header */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-[#D0D5DD] hover:bg-[#F9FAFB] text-[#344054] transition-colors"
              title="Volver al directorio de comercios"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4E7EC] overflow-hidden shadow-xs flex-shrink-0">
                <img 
                  src={store.logo} 
                  alt={store.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-[#111827]">{store.name}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
                    <span>{statusConfig.title}</span>
                  </span>
                  {store.isVerified && (
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Verificado
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                  <span>{store.cuisine || 'Comercio'}</span>
                  <span>·</span>
                  <span>{storeProducts.length} productos</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {store.address || 'Ubicación local'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick status selector buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-xl border border-[#D0D5DD] p-0.5 bg-[#F9FAFB] text-xs">
              <button
                type="button"
                onClick={() => handleStatusChange('open')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentStatusMode === 'open' 
                    ? 'bg-white shadow-xs text-emerald-700 font-bold' 
                    : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                ● Abierto
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('paused')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentStatusMode === 'paused' 
                    ? 'bg-white shadow-xs text-amber-700 font-bold' 
                    : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                ⏸ Pausar
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('closed')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentStatusMode === 'closed' 
                    ? 'bg-white shadow-xs text-slate-700 font-bold' 
                    : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                ○ Cerrado
              </button>
            </div>

            <button
              onClick={handleOpenNewProduct}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Producto</span>
            </button>
          </div>
        </div>

        {/* Status Explanation Banner */}
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${statusConfig.alertClass}`}>
          <div className="flex items-center gap-2">
            {currentStatusMode === 'open' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {currentStatusMode === 'paused' && <PauseCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
            {currentStatusMode === 'closed' && <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />}
            {currentStatusMode === 'unavailable' && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            <span>{statusConfig.description}</span>
          </div>
          <span className="text-[11px] font-semibold opacity-75 hidden sm:inline">
            Control de Operaciones
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl px-4 flex items-center gap-6 overflow-x-auto no-scrollbar shadow-xs">
        <button
          onClick={() => setActiveTab('productos')}
          className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'productos'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Productos & Menú ({storeProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categorias')}
          className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'categorias'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categorías ({store.categories?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('informacion')}
          className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'informacion'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          <StoreIcon className="w-4 h-4" />
          <span>Información & Horarios</span>
        </button>

        <button
          onClick={() => setActiveTab('analitica')}
          className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'analitica'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Rendimiento de Ventas</span>
        </button>

        <button
          onClick={() => setActiveTab('previsualizacion')}
          className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'previsualizacion'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          <Eye className="w-4 h-4 text-teal-600" />
          <span>Vista Previa Cliente</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'auditoria'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-[#667085] hover:text-[#111827]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historial de Cambios</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'productos' && (
        <ProductManagementTable
          products={storeProducts}
          store={store}
          onAddProduct={handleOpenNewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={productId => {
            onDeleteProduct(productId);
            onAddAuditLog('Eliminación de Producto', `Se eliminó el producto con ID ${productId}`);
          }}
          onToggleAvailability={(productId, current) => {
            onToggleProductAvailability(productId, current);
            onAddAuditLog('Cambio de Stock', `Disponibilidad cambiada a ${!current ? 'Disponible' : 'Agotado'}`);
          }}
          onQuickUpdatePrice={(productId, price) => {
            onQuickUpdatePrice(productId, price);
            onAddAuditLog('Ajuste de Precio', `Precio actualizado a $${price.toLocaleString('es-CO')}`);
          }}
          onBulkUpdateAvailability={(ids, status) => {
            onBulkUpdateAvailability(ids, status);
            onAddAuditLog('Actualización Masiva de Stock', `${ids.length} productos marcados como ${status ? 'Disponibles' : 'Agotados'}`);
          }}
          onBulkDelete={ids => {
            onBulkDeleteProducts(ids);
            onAddAuditLog('Eliminación Masiva', `Se eliminaron ${ids.length} productos`);
          }}
        />
      )}

      {activeTab === 'categorias' && (
        <CategoryManager
          store={store}
          products={storeProducts}
          onUpdateCategories={newCats => {
            onUpdateCategories(newCats);
            onAddAuditLog('Reorganización de Categorías', `Nuevo orden: ${newCats.join(', ')}`);
          }}
          onRenameCategory={(oldName, newName) => {
            onRenameCategory(oldName, newName);
            onAddAuditLog('Renombrado de Categoría', `"${oldName}" renombrada a "${newName}"`);
          }}
        />
      )}

      {activeTab === 'informacion' && (
        <BusinessInfoEditor
          store={store}
          onSaveStore={updatedData => {
            onUpdateStore(updatedData);
            onAddAuditLog('Actualización de Comercio', 'Se guardaron los datos de contacto, horarios y perfil comercial');
          }}
        />
      )}

      {activeTab === 'analitica' && (
        <BusinessAnalyticsView
          store={store}
          products={storeProducts}
          orders={orders}
        />
      )}

      {activeTab === 'previsualizacion' && (
        <BusinessLivePreview
          store={store}
          products={storeProducts}
        />
      )}

      {activeTab === 'auditoria' && (
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <History className="w-5 h-5 text-teal-600" />
              <span>Registro de Auditoría y Cambios Recientes</span>
            </h3>
            <p className="text-xs text-[#667085]">
              Traza de todas las modificaciones realizadas en este comercio
            </p>
          </div>

          <div className="border border-[#E4E7EC] rounded-xl divide-y divide-[#E4E7EC] overflow-hidden">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111827]">{log.action}</span>
                    <span className="text-[11px] text-[#667085]">por {log.user}</span>
                  </div>
                  <p className="text-[11px] text-[#475467]">{log.details}</p>
                </div>
                <span className="text-[11px] font-medium text-[#98A2B3] whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawer for creating / editing a product */}
      <ProductEditorDrawer
        isOpen={isProductDrawerOpen}
        onClose={() => {
          setIsProductDrawerOpen(false);
          setEditingProduct(null);
        }}
        onSave={(data, id) => {
          onSaveProduct(data, id);
          onAddAuditLog(
            id ? 'Edición de Producto' : 'Creación de Producto',
            `${id ? 'Actualizado' : 'Creado'} "${data.name}" por $${data.price.toLocaleString('es-CO')}`
          );
        }}
        initialProduct={editingProduct}
        store={store}
      />
    </div>
  );
};
