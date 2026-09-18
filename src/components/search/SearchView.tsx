import React, { useState } from 'react';
import { 
  Search as SearchIcon, 
  X, 
  Star, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Utensils, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { Store, Product } from '../../types';

export const SearchView: React.FC = () => {
  const { 
    stores, 
    products, 
    searchQuery, 
    setSearchQuery, 
    setSelectedStoreId, 
    setSelectedProductForModal,
    setCurrentView 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'free_delivery' | 'fast' | 'top_rated'>('all');

  const filterTags = [
    { id: 'all', label: 'Todo' },
    { id: 'free_delivery', label: 'Envío Gratis' },
    { id: 'fast', label: 'Rápidos (<25 min)' },
    { id: 'top_rated', label: 'Top Calificados (4.8+)' },
  ];

  // Filter stores
  const matchedStores = stores.filter(s => {
    const matchesText = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesText) return false;
    if (activeFilter === 'free_delivery') return s.deliveryFee === 0;
    if (activeFilter === 'top_rated') return s.rating >= 4.8;
    if (activeFilter === 'fast') return s.deliveryTime.includes('15') || s.deliveryTime.includes('10');
    return true;
  });

  // Filter products
  const matchedProducts = products.filter(p => {
    if (!searchQuery) return false;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenStore = (store: Store) => {
    setSelectedStoreId(store.id);
    setCurrentView('store-detail');
  };

  const handleOpenProduct = (product: Product) => {
    const store = stores.find(s => s.id === product.storeId);
    if (store) {
      setSelectedStoreId(store.id);
      setSelectedProductForModal(product);
      setCurrentView('store-detail');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Top Search Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 shadow-sm">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="relative flex items-center">
            <SearchIcon className="w-4 h-4 absolute left-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar comida o servicios..."
              className="w-full h-11 pl-11 pr-10 rounded-full bg-slate-50 border-0 ring-1 ring-inset ring-slate-200 text-sm text-[#0F172A] placeholder:text-slate-400 placeholder:truncate focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filterTags.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  activeFilter === f.id
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        {/* Matched Products Section (if any search query) */}
        {matchedProducts.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Platos y Productos ({matchedProducts.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchedProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => handleOpenProduct(prod)}
                  className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-all"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate">{prod.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{prod.description}</p>
                    <span className="text-xs font-black text-teal-600 mt-1 block">
                      ${prod.price.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Matched Stores */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Comercios ({matchedStores.length})
          </h3>

          {matchedStores.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl p-6 border border-slate-100">
              <SearchIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0F172A]">No se encontraron comercios</p>
              <p className="text-xs text-slate-500 mt-1">Prueba con otra palabra clave o quita los filtros.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedStores.map(store => (
                <div
                  key={store.id}
                  onClick={() => handleOpenStore(store)}
                  className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5"
                >
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#0F172A] truncate">{store.name}</h4>
                      <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{store.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{store.cuisine} • {store.address}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold mt-1">
                      <span className="flex items-center gap-1 text-teal-700">
                        <Clock className="w-3 h-3 text-teal-600" />
                        {store.deliveryTime}
                      </span>
                      <span>•</span>
                      <span>{store.deliveryFee === 0 ? 'Envío Gratis' : `$${store.deliveryFee.toLocaleString('es-CO')}`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
