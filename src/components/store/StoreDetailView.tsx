import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  ShoppingCart, 
  MapPin, 
  Star, 
  Plus, 
  Search,
  Clock,
  Info,
  Check
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { Product } from '../../types';
import { motion } from 'motion/react';

export const StoreDetailView: React.FC = () => {
  const { 
    selectedStoreId, 
    stores, 
    products, 
    setCurrentView, 
    setSelectedProductForModal,
    addToCart,
    cartItemCount,
    setIsCartDrawerOpen,
    showToast
  } = useApp();

  const store = stores.find(s => s.id === selectedStoreId) || stores[0];
  const storeProducts = products.filter(p => p.storeId === store.id);

  // Derive categories from store's products
  const categoryTabs = store.categories && store.categories.length > 0
    ? store.categories
    : ['Populares', 'Especiales', 'Bebidas', 'Combos'];

  const [activeTab, setActiveTab] = useState(categoryTabs[0]);
  const [storeSearch, setStoreSearch] = useState('');

  const filteredProducts = storeProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(storeSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(storeSearch.toLowerCase());
    const matchesTab = activeTab === 'Todos' || p.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && (storeSearch ? true : matchesTab);
  });

  const handleProductClick = (product: Product) => {
    if (product.optionGroups && product.optionGroups.length > 0) {
      setSelectedProductForModal(product);
    } else {
      addToCart(product, store, 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `¡Mira el menú de ${store.name} en MANDÚ!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace copiado', 'Enlace del comercio copiado al portapapeles.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Top App Bar (Sticky) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setCurrentView('home')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95 text-[#0F172A]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#0F172A] truncate max-w-[200px] text-center">
          {store.name}
        </h1>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95 text-[#0F172A]"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors relative active:scale-95 text-[#0F172A]"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </header>

      {/* Store Header & Cover */}
      <section className="bg-white border-b border-slate-100">
        <div className="w-full h-48 sm:h-64 relative bg-slate-200">
          <img
            src={store.coverImage}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <div className="p-4 sm:p-6 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {store.name}
          </h2>

          {/* Meta Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {store.address}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
              <span>{store.rating} ({store.reviewsCount}+)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-emerald-800 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Abierto ahora
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {store.deliveryTime}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            {store.description}
          </p>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <section className="sticky top-16 z-20 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-2 max-w-7xl mx-auto">
          {categoryTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* Product List */}
      <main className="p-4 max-w-7xl mx-auto space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-100 p-6">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0F172A]">No hay productos en esta categoría</p>
            <p className="text-xs text-slate-500 mt-1">Intenta seleccionando otra pestaña.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredProducts.map((prod) => (
              <motion.article
                key={prod.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleProductClick(prod)}
                className="bg-white rounded-2xl p-4 flex items-center justify-between gap-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Left Info */}
                <div className="flex-1 flex flex-col justify-between min-h-[90px]">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-teal-600 transition-colors leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-2 mt-1">
                      {prod.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm font-black text-[#0F172A]">
                      ${prod.price.toLocaleString('es-CO')}
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      Disponible
                    </span>
                  </div>
                </div>

                {/* Right Image + Add Button */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl relative flex-shrink-0 bg-slate-100 overflow-hidden shadow-inner">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(prod);
                    }}
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    title="Añadir producto"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
