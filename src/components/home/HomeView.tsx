import React from 'react';
import { 
  Utensils, 
  Coffee, 
  Wrench, 
  Hammer, 
  ShoppingBag, 
  Truck, 
  Zap, 
  Star, 
  CheckCircle2, 
  Clock, 
  Percent, 
  Sparkles,
  Heart,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { CATEGORIES, QUICK_SERVICES } from '../../data/mockData';
import { Store, CategoryType } from '../../types';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { 
    stores, 
    selectedCategory, 
    setSelectedCategory, 
    setSelectedStoreId, 
    setCurrentView, 
    favorites, 
    toggleFavorite,
    setQuickServiceModal,
    applyCoupon
  } = useApp();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return Utensils;
      case 'Coffee': return Coffee;
      case 'Wrench': return Wrench;
      case 'Hammer': return Hammer;
      case 'ShoppingBag': return ShoppingBag;
      case 'Truck': return Truck;
      default: return Sparkles;
    }
  };

  const filteredStores = selectedCategory === 'all' 
    ? stores 
    : stores.filter(s => s.category === selectedCategory);

  const handleOpenStore = (store: Store) => {
    setSelectedStoreId(store.id);
    setCurrentView('store-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Category Chips Scrollbar */}
      <section className="overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-3 pt-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border transition-all active:scale-95 w-24 ${
            selectedCategory === 'all'
              ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/25 font-bold'
              : 'bg-white text-slate-700 border-slate-100 shadow-sm hover:border-teal-200'
          }`}
        >
          <Sparkles className={`w-6 h-6 ${selectedCategory === 'all' ? 'text-white' : 'text-teal-600'}`} />
          <span className="text-xs font-semibold leading-tight text-center">Todos</span>
        </button>

        {CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryType)}
              className={`flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-2xl border transition-all active:scale-95 w-24 ${
                isSelected
                  ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/25 font-bold'
                  : 'bg-white text-slate-700 border-slate-100 shadow-sm hover:border-teal-200'
              }`}
            >
              <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
              <span className="text-xs font-semibold leading-tight text-center line-clamp-2">
                {cat.name}
              </span>
            </button>
          );
        })}
      </section>

      {/* Hero Promo Banner (Matching reference image 1) */}
      <section className="w-full">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => applyCoupon('ENVIOGRATIS')}
          className="w-full bg-gradient-to-r from-[#14B8A6] via-[#0D9488] to-[#2DD4BF] rounded-2xl p-5 shadow-lg shadow-teal-500/15 text-white relative overflow-hidden cursor-pointer"
        >
          {/* Background Lightning bolt watermark */}
          <div className="absolute -right-4 -top-6 opacity-20 pointer-events-none">
            <Zap className="w-36 h-36 text-white fill-white" />
          </div>

          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
              <Zap className="w-3 h-3 fill-white" />
              <span>Lo pides. Te lo llevan.</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Bienvenido a MANDÚ
            </h2>
            <p className="text-sm font-medium opacity-95">
              $0 costo de envío en tu primer pedido
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-lg">
                CÓDIGO: ENVIOGRATIS
              </span>
              <span className="text-xs font-bold text-white underline underline-offset-2">
                Aplicar ahora →
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Comercios Destacados (Featured Stores from Reference) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
              Comercios Destacados
            </h3>
            <p className="text-xs text-slate-500">Restaurantes y tiendas con entrega prioritaria</p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700"
            >
              Ver todos
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStores.map((store) => {
            const isFav = favorites.includes(store.id);

            return (
              <motion.div
                key={store.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOpenStore(store)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md group"
              >
                {/* Store Cover Image with Badge and Favorite */}
                <div className="w-full h-40 sm:h-44 bg-slate-200 relative overflow-hidden">
                  <img
                    src={store.coverImage}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>

                  {/* MANDÚ Verificado Badge */}
                  {store.isVerified && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-teal-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wide">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>MANDÚ Verificado</span>
                    </div>
                  )}

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(store.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Free shipping pill if applicable */}
                  {store.deliveryFee === 0 && (
                    <div className="absolute bottom-2.5 left-3 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Envío Gratis
                    </div>
                  )}
                </div>

                {/* Store Meta Card Body */}
                <div className="p-4 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-bold text-[#0F172A] group-hover:text-teal-600 transition-colors">
                      {store.name}
                    </h4>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-extrabold text-amber-800">{store.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                    <span>{store.cuisine}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {store.deliveryTime}
                    </span>
                    <span>•</span>
                    <span>{store.distance}</span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Servicios Rápidos (Quick Services from Reference) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
              Servicios Rápidos
            </h3>
            <p className="text-xs text-slate-500">Técnicos certificados listos para emergencias</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {QUICK_SERVICES.map((serv) => {
            let IconComp = Wrench;
            let bgColor = 'bg-blue-50 text-blue-600';
            if (serv.category === 'electrical') {
              IconComp = Zap;
              bgColor = 'bg-amber-50 text-amber-600';
            } else if (serv.category === 'locksmith') {
              bgColor = 'bg-emerald-50 text-emerald-600';
            } else if (serv.category === 'courier') {
              IconComp = Truck;
              bgColor = 'bg-purple-50 text-purple-600';
            }

            return (
              <div
                key={serv.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center text-center gap-2.5 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-13 h-13 rounded-2xl ${bgColor} flex items-center justify-center p-3 shadow-inner`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] h-10 flex items-center justify-center leading-tight">
                  {serv.title}
                </h4>
                <span className="text-[10px] text-teal-600 font-semibold">{serv.badge}</span>
                <button
                  onClick={() => setQuickServiceModal(serv)}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl py-2.5 mt-auto shadow-sm transition-all"
                >
                  Pedir Técnico
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Branding Tagline */}
      <footer className="pt-4 pb-2 text-center">
        <p className="text-xs font-bold text-slate-400 tracking-wide">
          MANDÚ • Lo pides. Te lo llevan.
        </p>
      </footer>
    </div>
  );
};
