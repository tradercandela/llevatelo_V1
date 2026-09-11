import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Store as StoreIcon, 
  MapPin, 
  Clock, 
  DollarSign, 
  Edit, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  Package,
  X
} from 'lucide-react';
import { Store, Product, CategoryType } from '../../types';
import { STATUS_EXPLANATIONS } from './adminHelpers';

interface AdminStoresListProps {
  stores: Store[];
  products: Product[];
  onSelectStore: (storeId: string) => void;
  onAddNewStore: () => void;
  onEditStoreInfo: (store: Store) => void;
  onDeleteStore: (storeId: string) => void;
  onQuickToggleStoreStatus: (storeId: string, currentStatus: boolean) => void;
}

export const AdminStoresList: React.FC<AdminStoresListProps> = ({
  stores,
  products,
  onSelectStore,
  onAddNewStore,
  onEditStoreInfo,
  onDeleteStore,
  onQuickToggleStoreStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'paused'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Count products per store
  const storeProductCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.storeId] = (map[p.storeId] || 0) + 1;
    });
    return map;
  }, [products]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = store.name.toLowerCase().includes(q);
        const matchesCuisine = (store.cuisine || '').toLowerCase().includes(q);
        const matchesAddress = (store.address || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCuisine && !matchesAddress) return false;
      }

      // Status
      if (statusFilter === 'open' && !store.isOpen) return false;
      if (statusFilter === 'closed' && store.isOpen) return false;
      if (statusFilter === 'paused' && store.statusMode !== 'paused') return false;

      // Category
      if (categoryFilter !== 'all' && store.category !== categoryFilter) return false;

      return true;
    });
  }, [stores, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-xs overflow-hidden">
      {/* Header controls */}
      <div className="p-4 sm:p-5 border-b border-[#E4E7EC] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <StoreIcon className="w-5 h-5 text-teal-600" />
              <span>Directorio General de Comercios</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2F4F7] text-[#344054]">
                {filteredStores.length} {filteredStores.length === 1 ? 'comercio' : 'comercios'}
              </span>
            </h3>
            <p className="text-xs text-[#667085]">
              Administra establecimientos, cartas de menú, horarios y visibilidad en el marketplace
            </p>
          </div>

          <button
            onClick={onAddNewStore}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nuevo Comercio</span>
          </button>
        </div>

        {/* Filters and search row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, cocina o dirección..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] text-[#111827] placeholder-[#98A2B3] focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#344054]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-[#D0D5DD] p-0.5 bg-[#F9FAFB] text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'all' ? 'bg-white shadow-xs text-[#111827] font-semibold' : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                Todos ({stores.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('open')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'open' ? 'bg-white shadow-xs text-emerald-700 font-semibold' : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                Abiertos ({stores.filter(s => s.isOpen).length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('closed')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === 'closed' ? 'bg-white shadow-xs text-slate-700 font-semibold' : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                Cerrados ({stores.filter(s => !s.isOpen).length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stores list */}
      <div className="divide-y divide-[#E4E7EC]">
        {filteredStores.length === 0 ? (
          <div className="py-12 text-center text-[#667085]">
            <StoreIcon className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
            <p className="font-semibold text-[#111827]">No se encontraron comercios</p>
            <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
              No hay coincidencias con los filtros aplicados.
            </p>
          </div>
        ) : (
          filteredStores.map(store => {
            const productCount = storeProductCounts[store.id] || 0;
            const statusMode = store.statusMode || (store.isOpen ? 'open' : 'closed');
            const statusCfg = STATUS_EXPLANATIONS[statusMode] || STATUS_EXPLANATIONS.open;

            return (
              <div 
                key={store.id}
                className="p-4 sm:p-5 hover:bg-[#F9FAFB] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Store info */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#E4E7EC] overflow-hidden flex-shrink-0 shadow-xs relative">
                    <img 
                      src={store.logo} 
                      alt={store.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    {!store.isOpen && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white uppercase">Cerrado</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 
                        onClick={() => onSelectStore(store.id)}
                        className="text-sm font-bold text-[#111827] hover:text-teal-700 cursor-pointer transition-colors"
                      >
                        {store.name}
                      </h4>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusCfg.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                        <span>{statusCfg.title}</span>
                      </span>
                      {store.isVerified && (
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          Verificado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#667085] flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#344054]">{store.cuisine || 'Comercio'}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-[#98A2B3]" />
                        <span>{productCount} productos</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#98A2B3]" />
                        <span>{store.deliveryTime || '20-30 min'}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#98A2B3]" />
                        <span>Envío ${store.deliveryFee.toLocaleString('es-CO')}</span>
                      </span>
                    </p>

                    {store.address && (
                      <p className="text-[11px] text-[#98A2B3] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{store.address}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick actions bar */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onQuickToggleStoreStatus(store.id, store.isOpen)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      store.isOpen
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Alternar estado abierto/cerrado rápidamente"
                  >
                    {store.isOpen ? '● Abierto' : '○ Cerrado'}
                  </button>

                  <button
                    onClick={() => onEditStoreInfo(store)}
                    className="p-2 rounded-xl border border-[#D0D5DD] hover:bg-[#F9FAFB] text-[#344054] transition-colors"
                    title="Editar información básica"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Estás seguro de eliminar el comercio "${store.name}" y todos sus productos?`)) {
                        onDeleteStore(store.id);
                      }
                    }}
                    className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar comercio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectStore(store.id)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Administrar Negocio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
