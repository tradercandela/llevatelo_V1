import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Plus
} from 'lucide-react';
import { Store, Product } from '../../types';

interface BusinessLivePreviewProps {
  store: Store;
  products: Product[];
}

export const BusinessLivePreview: React.FC<BusinessLivePreviewProps> = ({
  store,
  products
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Top toolbar */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#111827] block">
            Previsualización en Tiempo Real de la Tienda
          </span>
          <p className="text-[11px] text-[#667085]">
            Así es exactamente como los clientes ven tu negocio en la aplicación de MANDÚ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-[#D0D5DD] p-0.5 bg-[#F9FAFB] text-xs">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                deviceMode === 'mobile' 
                  ? 'bg-white shadow-xs text-teal-800 font-bold' 
                  : 'text-[#667085] hover:text-[#111827]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Móvil</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                deviceMode === 'desktop' 
                  ? 'bg-white shadow-xs text-teal-800 font-bold' 
                  : 'text-[#667085] hover:text-[#111827]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Escritorio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator canvas */}
      <div className="flex justify-center p-2 sm:p-6 bg-slate-100 rounded-2xl border border-[#E4E7EC] overflow-hidden">
        <div 
          className={`bg-white shadow-xl transition-all overflow-hidden ${
            deviceMode === 'mobile'
              ? 'w-full max-w-[400px] rounded-[36px] border-[6px] border-slate-800 min-h-[720px]'
              : 'w-full max-w-4xl rounded-2xl border border-[#E4E7EC] min-h-[600px]'
          }`}
        >
          {/* Store Banner */}
          <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden">
            {store.coverImage ? (
              <img 
                src={store.coverImage} 
                alt={store.name} 
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Portada de la tienda
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Logo and store title */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white overflow-hidden shadow-lg flex-shrink-0">
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="text-white pb-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-bold drop-shadow-sm">{store.name}</h3>
                  {store.isVerified && (
                    <span className="w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-200 line-clamp-1">{store.tagline || store.cuisine}</p>
              </div>
            </div>
          </div>

          {/* Quick specs bar */}
          <div className="p-3.5 border-b border-[#F2F4F7] bg-[#F9FAFB] flex items-center justify-between text-xs text-[#475467]">
            <div className="flex items-center gap-1">
              <span className="text-amber-500 font-bold">★ {store.rating || 4.8}</span>
              <span className="text-[11px] text-[#98A2B3]">({store.reviewsCount || 120})</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#667085]" />
              <span>{store.deliveryTime || '20-30 min'}</span>
            </div>
            <span>·</span>
            <div>
              {store.deliveryFee === 0 ? (
                <span className="font-bold text-emerald-700">Envío Gratis</span>
              ) : (
                <span>Envío ${store.deliveryFee.toLocaleString('es-CO')}</span>
              )}
            </div>
          </div>

          {/* Categories bar */}
          <div className="p-3 flex items-center gap-2 overflow-x-auto border-b border-[#F2F4F7] no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-[#F2F4F7] text-[#475467] hover:bg-slate-200'
              }`}
            >
              Todos ({products.length})
            </button>
            {store.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-[#F2F4F7] text-[#475467] hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products menu list */}
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#98A2B3]">
                No hay productos disponibles en esta categoría
              </div>
            ) : (
              filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="p-3 rounded-2xl border border-[#E4E7EC] hover:border-teal-300 transition-colors flex gap-3 bg-white"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-[#111827]">{product.name}</h4>
                      {product.popular && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold">
                          Top
                        </span>
                      )}
                      {product.isCombo && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">
                          Combo
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#667085] line-clamp-2 mt-0.5">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-[#111827]">
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-[#98A2B3] line-through">
                          ${product.originalPrice.toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white uppercase">Agotado</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
