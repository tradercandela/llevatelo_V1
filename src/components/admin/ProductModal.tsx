import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Clock, Flame, Check } from 'lucide-react';
import { Product, Store } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, editId?: string) => void;
  initialProduct?: Product | null;
  stores: Store[];
  defaultStoreId?: string | null;
}

const PRESET_FOOD_IMAGES = [
  { name: 'Dona Arequipe', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80' },
  { name: 'Dona Chocolate', url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&auto=format&fit=crop&q=80' },
  { name: 'Capuchino Vainilla', url: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?w=500&auto=format&fit=crop&q=80' },
  { name: 'Croissant Mantequilla', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80' },
  { name: 'Hamburguesa Doble', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
  { name: 'Pizza Pepperoni', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80' },
  { name: 'Papas Rústicas', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80' },
  { name: 'Gaseosa / Bebida', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80' }
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  stores,
  defaultStoreId
}) => {
  const [storeId, setStoreId] = useState<string>(stores[0]?.id || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(15000);
  const [category, setCategory] = useState('Populares');
  const [image, setImage] = useState(PRESET_FOOD_IMAGES[0].url);
  const [isAvailable, setIsAvailable] = useState(true);
  const [popular, setPopular] = useState(false);
  const [preparationTime, setPreparationTime] = useState('10-15 min');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setStoreId(initialProduct.storeId);
      setName(initialProduct.name);
      setDescription(initialProduct.description || '');
      setPrice(initialProduct.price);
      setCategory(initialProduct.category || 'Populares');
      setImage(initialProduct.image);
      setIsAvailable(initialProduct.isAvailable);
      setPopular(!!initialProduct.popular);
      setPreparationTime(initialProduct.preparationTime || '10-15 min');
      setCalories(initialProduct.calories || '');
    } else {
      setStoreId(defaultStoreId || stores[0]?.id || '');
      setName('');
      setDescription('');
      setPrice(15000);
      setCategory('Populares');
      setImage(PRESET_FOOD_IMAGES[0].url);
      setIsAvailable(true);
      setPopular(false);
      setPreparationTime('10-15 min');
      setCalories('');
    }
  }, [initialProduct, isOpen, defaultStoreId, stores]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !storeId) return;

    const productData: Omit<Product, 'id'> = {
      storeId,
      name: name.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      category: category.trim() || 'General',
      image,
      isAvailable,
      popular,
      preparationTime,
      calories: calories.trim() || undefined,
      optionGroups: initialProduct?.optionGroups || []
    };

    onSave(productData, initialProduct?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialProduct ? 'Actualizar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <p className="text-xs text-slate-400">
                Gestiona precio, disponibilidad y detalles del menú
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
          {/* Store Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Comercio / Establecimiento *
            </label>
            <select
              value={storeId}
              onChange={e => setStoreId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cuisine})
                </option>
              ))}
            </select>
          </div>

          {/* Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Dona Artesanal de Nutella"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Sección / Categoría del Menú
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Ej. Populares, Bebidas, Combos"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Price & Prep time */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Precio ($ COP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                placeholder="15000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold text-teal-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Tiempo Preparación
              </label>
              <input
                type="text"
                value={preparationTime}
                onChange={e => setPreparationTime(e.target.value)}
                placeholder="10-15 min"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Calorías (Opcional)
              </label>
              <input
                type="text"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                placeholder="Ej. 340 kcal"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Descripción e Ingredientes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalla los ingredientes, salsas o porciones..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Image Presets & URL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Foto del Producto (Galería rápida o URL)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_FOOD_IMAGES.map((imgItem, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImage(imgItem.url)}
                  className={`relative rounded-xl overflow-hidden border transition-all h-14 ${
                    image === imgItem.url ? 'border-2 border-teal-500 ring-2 ring-teal-500/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgItem.url} alt={imgItem.name} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white px-1 py-0.5 truncate text-center block">
                    {imgItem.name}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-[11px] text-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Availability & Popular Toggles */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={e => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500 bg-slate-800 border-slate-700"
              />
              <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isAvailable ? 'En Stock (Disponible para pedir)' : 'Agotado / Pausado'}
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={e => setPopular(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Más Vendido / Destacado
              </span>
            </label>
          </div>

          {/* Actions */}
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
              <span>{initialProduct ? 'Guardar Cambios' : 'Añadir Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
