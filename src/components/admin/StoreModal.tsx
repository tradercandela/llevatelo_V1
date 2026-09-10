import React, { useState, useEffect } from 'react';
import { X, Store as StoreIcon, Image as ImageIcon, MapPin, Clock, DollarSign, Sparkles, Check } from 'lucide-react';
import { Store, CategoryType } from '../../types';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (storeData: Omit<Store, 'id'>, editId?: string) => void;
  initialStore?: Store | null;
}

const CATEGORY_OPTIONS: { id: CategoryType; label: string }[] = [
  { id: 'restaurantes', label: 'Restaurantes' },
  { id: 'antojos_cafe', label: 'Antojos & Café' },
  { id: 'supermercado_farmacia', label: 'Supermercado & Farmacia' },
  { id: 'mensajeria', label: 'Mensajería & Paquetes' },
  { id: 'plomeros_electricistas', label: 'Plomeros & Electricistas' },
  { id: 'mantenimiento', label: 'Mantenimiento & Hogar' }
];

const PRESET_LOGOS = [
  { name: 'Café & Donas', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&auto=format&fit=crop&q=80' },
  { name: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80' },
  { name: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80' },
  { name: 'Super & Fresh', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80' },
  { name: 'Farmacia', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80' },
  { name: 'Tacos & Grill', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=150&auto=format&fit=crop&q=80' }
];

const PRESET_COVERS = [
  { name: 'Coffee Shop', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80' },
  { name: 'Restaurante Moderno', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80' },
  { name: 'Gourmet Kitchen', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
  { name: 'Mercado Fresco', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80' }
];

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStore
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [category, setCategory] = useState<CategoryType>('restaurantes');
  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('20-30 min');
  const [deliveryFee, setDeliveryFee] = useState<number>(3500);
  const [minOrder, setMinOrder] = useState<number>(15000);
  const [distance, setDistance] = useState('1.5 km');
  const [logo, setLogo] = useState(PRESET_LOGOS[0].url);
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [isOpenStore, setIsOpenStore] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (initialStore) {
      setName(initialStore.name);
      setTagline(initialStore.tagline || '');
      setDescription(initialStore.description || '');
      setCuisine(initialStore.cuisine || '');
      setCategory(initialStore.category);
      setAddress(initialStore.address || '');
      setDeliveryTime(initialStore.deliveryTime || '20-30 min');
      setDeliveryFee(initialStore.deliveryFee);
      setMinOrder(initialStore.minOrder);
      setDistance(initialStore.distance || '1.5 km');
      setLogo(initialStore.logo);
      setCoverImage(initialStore.coverImage);
      setIsOpenStore(initialStore.isOpen);
      setIsVerified(initialStore.isVerified);
      setFeatured(!!initialStore.featured);
    } else {
      setName('');
      setTagline('');
      setDescription('');
      setCuisine('');
      setCategory('restaurantes');
      setAddress('');
      setDeliveryTime('20-30 min');
      setDeliveryFee(3500);
      setMinOrder(15000);
      setDistance('1.5 km');
      setLogo(PRESET_LOGOS[0].url);
      setCoverImage(PRESET_COVERS[0].url);
      setIsOpenStore(true);
      setIsVerified(true);
      setFeatured(false);
    }
  }, [initialStore, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const storeData: Omit<Store, 'id'> = {
      name: name.trim(),
      tagline: tagline.trim() || `${cuisine || 'Comida'} de alta calidad`,
      description: description.trim() || `Los mejores productos de ${name.trim()}.`,
      cuisine: cuisine.trim() || 'Gastronomía & Variedades',
      category,
      address: address.trim() || 'Zona Metropolitana',
      deliveryTime,
      deliveryFee: Number(deliveryFee) || 0,
      minOrder: Number(minOrder) || 0,
      distance,
      logo,
      coverImage,
      rating: initialStore ? initialStore.rating : 4.9,
      reviewsCount: initialStore ? initialStore.reviewsCount : 1,
      isOpen: isOpenStore,
      isVerified,
      featured,
      categories: initialStore?.categories || ['Populares', 'Especiales', 'Bebidas']
    };

    onSave(storeData, initialStore?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialStore ? 'Editar Comercio' : 'Agregar Nuevo Comercio'}
              </h2>
              <p className="text-xs text-slate-400">
                Completa los datos del establecimiento para el marketplace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
          {/* Row 1: Name & Cuisine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nombre del Comercio *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Hamburguesas El Corral"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Especialidad / Cocina
              </label>
              <input
                type="text"
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
                placeholder="Ej. Hamburguesas & Snacks"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Category & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Categoría Principal
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Dirección / Ubicación
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Ej. Cra 33 # 48-12, Cabecera"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Tagline & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Eslogan Corto / Tagline
            </label>
            <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="Ej. Las mejores carnes artesanales al carbón"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Descripción del Comercio
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe lo que ofrece el negocio, ingredientes o promociones destacadas..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Row 4: Delivery Fees & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Tiempo Entrega
              </label>
              <input
                type="text"
                value={deliveryTime}
                onChange={e => setDeliveryTime(e.target.value)}
                placeholder="15-25 min"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Costo Envío ($)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={deliveryFee}
                onChange={e => setDeliveryFee(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Pedido Mínimo ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={minOrder}
                onChange={e => setMinOrder(Number(e.target.value))}
                placeholder="15000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Row 5: Preset Logos and Custom Logo */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Logo del Comercio (Presets o URL)
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {PRESET_LOGOS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setLogo(p.url)}
                  className={`flex-shrink-0 flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                    logo === p.url ? 'border-teal-500 bg-teal-500/20' : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="text-[11px] text-slate-300 whitespace-nowrap pr-1">{p.name}</span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={logo}
              onChange={e => setLogo(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-[11px] text-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Row 6: Cover Image Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Imagen de Portada (Banner)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-1.5">
              {PRESET_COVERS.map((cov, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverImage(cov.url)}
                  className={`relative rounded-xl overflow-hidden border transition-all h-14 ${
                    coverImage === cov.url ? 'border-2 border-teal-500 ring-2 ring-teal-500/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={cov.url} alt={cov.name} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] font-bold text-white px-1 py-0.5 text-center truncate">
                    {cov.name}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-[11px] text-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Row 7: Toggles */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOpenStore}
                onChange={e => setIsOpenStore(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-bold text-slate-200">Abierto para pedidos hoy</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={e => setIsVerified(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Comercio Verificado
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-bold text-amber-400">Destacado en Home</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{initialStore ? 'Guardar Cambios' : 'Registrar Comercio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
