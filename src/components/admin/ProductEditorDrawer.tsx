import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Image as ImageIcon, 
  Flame, 
  Check, 
  Plus, 
  Trash2, 
  Layers, 
  Sparkles, 
  Info, 
  Clock, 
  DollarSign, 
  Sliders, 
  ExternalLink 
} from 'lucide-react';
import { Product, Store, ProductVariant, ProductOptionGroup, ProductOption } from '../../types';

interface ProductEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, editId?: string) => void;
  initialProduct?: Product | null;
  store: Store;
}

const PRESET_IMAGE_INSPIRATIONS = [
  { name: 'Hamburguesa Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Pizza al Horno', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
  { name: 'Dona Glaseada', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80' },
  { name: 'Café & Latte', url: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?w=600&auto=format&fit=crop&q=80' },
  { name: 'Papas & Snacks', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80' },
  { name: 'Bebida Refrescante', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80' },
  { name: 'Arepa Criolla', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80' },
  { name: 'Postre & Helado', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80' }
];

export const ProductEditorDrawer: React.FC<ProductEditorDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  store
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'variants' | 'modifiers' | 'combo'>('general');

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(15000);
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [category, setCategory] = useState('Populares');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [popular, setPopular] = useState(false);
  const [preparationTime, setPreparationTime] = useState('15-20 min');
  const [calories, setCalories] = useState('');

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Option Groups / Modifiers
  const [optionGroups, setOptionGroups] = useState<ProductOptionGroup[]>([]);

  // Combo state
  const [isCombo, setIsCombo] = useState(false);
  const [comboItemsText, setComboItemsText] = useState('');

  // Image load error indicator
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setDescription(initialProduct.description || '');
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice ? initialProduct.originalPrice.toString() : '');
      setCategory(initialProduct.category || store.categories[0] || 'Populares');
      setImageUrl(initialProduct.image || '');
      setIsAvailable(initialProduct.isAvailable);
      setPopular(!!initialProduct.popular);
      setPreparationTime(initialProduct.preparationTime || '15-20 min');
      setCalories(initialProduct.calories || '');
      setVariants(initialProduct.variants || []);
      setOptionGroups(initialProduct.optionGroups || []);
      setIsCombo(!!initialProduct.isCombo);
      setComboItemsText(initialProduct.comboItems?.join('\n') || '');
    } else {
      setName('');
      setDescription('');
      setPrice(15000);
      setOriginalPrice('');
      setCategory(store.categories[0] || 'Populares');
      setImageUrl(PRESET_IMAGE_INSPIRATIONS[0].url);
      setIsAvailable(true);
      setPopular(false);
      setPreparationTime('15-20 min');
      setCalories('');
      setVariants([]);
      setOptionGroups([]);
      setIsCombo(false);
      setComboItemsText('');
    }
    setActiveTab('general');
    setImageError(false);
  }, [initialProduct, isOpen, store]);

  if (!isOpen) return null;

  // Variant helpers
  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      name: 'Nueva Opción (ej. Mediana)',
      price: price,
      isAvailable: true
    };
    setVariants([...variants, newVariant]);
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, val: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: val } : v));
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  // Option group / modifier helpers
  const handleAddOptionGroup = () => {
    const newGroup: ProductOptionGroup = {
      id: `group-${Date.now()}`,
      name: 'Elige tu acompañamiento',
      required: false,
      minSelect: 0,
      maxSelect: 1,
      options: [
        { id: `opt-${Date.now()}-1`, name: 'Opción 1', price: 0 },
        { id: `opt-${Date.now()}-2`, name: 'Opción 2 con extra', price: 3000 }
      ]
    };
    setOptionGroups([...optionGroups, newGroup]);
  };

  const handleUpdateOptionGroup = (groupId: string, field: keyof ProductOptionGroup, val: any) => {
    setOptionGroups(optionGroups.map(g => g.id === groupId ? { ...g, [field]: val } : g));
  };

  const handleRemoveOptionGroup = (groupId: string) => {
    setOptionGroups(optionGroups.filter(g => g.id !== groupId));
  };

  const handleAddOptionToGroup = (groupId: string) => {
    setOptionGroups(optionGroups.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        options: [
          ...g.options,
          { id: `opt-${Date.now()}`, name: 'Nuevo Adicional', price: 0 }
        ]
      };
    }));
  };

  const handleUpdateOption = (groupId: string, optId: string, field: keyof ProductOption, val: any) => {
    setOptionGroups(optionGroups.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        options: g.options.map(opt => opt.id === optId ? { ...opt, [field]: val } : opt)
      };
    }));
  };

  const handleRemoveOption = (groupId: string, optId: string) => {
    setOptionGroups(optionGroups.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        options: g.options.filter(opt => opt.id !== optId)
      };
    }));
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedOriginalPrice = originalPrice.trim() ? Number(originalPrice) : undefined;
    const comboItems = isCombo 
      ? comboItemsText.split('\n').map(i => i.trim()).filter(Boolean)
      : undefined;

    const productPayload: Omit<Product, 'id'> = {
      storeId: store.id,
      name: name.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      originalPrice: parsedOriginalPrice,
      image: imageUrl.trim() || PRESET_IMAGE_INSPIRATIONS[0].url,
      category: category.trim() || 'Populares',
      isAvailable,
      popular,
      preparationTime: preparationTime.trim() || '15-20 min',
      calories: calories.trim() || undefined,
      variants: variants.length > 0 ? variants : undefined,
      optionGroups: optionGroups.length > 0 ? optionGroups : undefined,
      isCombo,
      comboItems,
      updatedAt: new Date().toISOString()
    };

    onSave(productPayload, initialProduct?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                {initialProduct ? `Editar: ${initialProduct.name}` : 'Crear Nuevo Producto'}
              </h2>
              <p className="text-xs text-[#667085]">
                Comercio: <span className="font-semibold text-teal-700">{store.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-[#E4E7EC] flex items-center gap-6 bg-[#F9FAFB]">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            Información General & Precios
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'variants'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            <span>Variantes & Tamaños</span>
            {variants.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                {variants.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modifiers')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'modifiers'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            <span>Complementos / Adicionales</span>
            {optionGroups.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                {optionGroups.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('combo')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'combo'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-[#667085] hover:text-[#111827]'
            }`}
          >
            Combo / Paquete
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: General Info */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Hamburguesa Especial Casalins"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Categoría / Sección del Menú *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
                    >
                      {store.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      {!store.categories.includes(category) && (
                        <option value={category}>{category}</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Precio de Venta ($ COP) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      value={price}
                      onChange={e => setPrice(Number(e.target.value))}
                      placeholder="15000"
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs font-bold rounded-xl border border-[#D0D5DD] bg-white text-teal-700 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Precio Anterior / Tachado ($ COP - Opcional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">$</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={originalPrice}
                      onChange={e => setOriginalPrice(e.target.value)}
                      placeholder="Ej. 18000 (para mostrar descuento)"
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#667085] focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Descripción e Ingredientes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detalla los ingredientes, preparación, porciones y recomendaciones..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Prep time & Calories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#667085]" />
                    <span>Tiempo de Preparación Estimado</span>
                  </label>
                  <input
                    type="text"
                    value={preparationTime}
                    onChange={e => setPreparationTime(e.target.value)}
                    placeholder="15-20 min"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Calorías / Información Nutricional (Opcional)
                  </label>
                  <input
                    type="text"
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    placeholder="Ej. 450 kcal"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Image URL with live preview (Preserving URL System strictly) */}
              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E4E7EC] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-teal-600" />
                      <span>URL de Imagen del Producto (CDN / Web)</span>
                    </label>
                    <p className="text-[11px] text-[#667085]">
                      Pega la URL de la imagen del producto. Se procesa con previsualización en vivo.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Live preview box */}
                  <div className="w-28 h-28 rounded-2xl bg-white border border-[#D0D5DD] overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-xs">
                    {imageUrl && !imageError ? (
                      <img
                        src={imageUrl}
                        alt="Previsualización"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                    ) : (
                      <div className="text-center p-2 text-[#98A2B3]">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                        <span className="text-[10px] block">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => {
                        setImageUrl(e.target.value);
                        setImageError(false);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
                    />

                    {imageError && (
                      <p className="text-[11px] text-red-600 font-medium">
                        ⚠️ No se pudo cargar la imagen desde este enlace. Verifica la URL.
                      </p>
                    )}

                    {/* Quick Presets */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider block mb-1.5">
                        Imágenes de inspiración rápida:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGE_INSPIRATIONS.map(p => (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => {
                              setImageUrl(p.url);
                              setImageError(false);
                            }}
                            className="text-[10px] px-2 py-1 rounded-lg border border-[#D0D5DD] bg-white hover:bg-teal-50 hover:border-teal-300 text-[#344054] transition-colors"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="p-4 rounded-2xl border border-[#E4E7EC] bg-white flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={e => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-[#D0D5DD]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">Disponible para ordenar</span>
                    <span className="text-[11px] text-[#667085]">
                      {isAvailable ? 'Aparece activo en el menú' : 'Marcado como agotado para clientes'}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={e => setPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-[#D0D5DD]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Destacar como Más Vendido (Top)</span>
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      Aparece en la sección recomendada del comercio
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Variants */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">Variantes de Tamaño o Porción</h4>
                  <p className="text-[11px] text-[#667085]">
                    Ejemplo: Personal, Mediana, Familiar o Sencilla, Doble, Triple con sus respectivos precios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Variante</span>
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#D0D5DD] rounded-2xl bg-[#F9FAFB]">
                  <Layers className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#111827]">No hay variantes configuradas</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    El producto se venderá con el precio base estándar (${price.toLocaleString('es-CO')}).
                  </p>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="mt-3 px-3 py-1.5 bg-white border border-[#D0D5DD] hover:bg-slate-50 text-[#344054] rounded-lg text-xs font-semibold"
                  >
                    + Configurar primera variante
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {variants.map(variant => (
                    <div 
                      key={variant.id}
                      className="p-3 bg-[#F9FAFB] border border-[#E4E7EC] rounded-xl flex items-center gap-3"
                    >
                      <input
                        type="text"
                        value={variant.name}
                        onChange={e => handleUpdateVariant(variant.id, 'name', e.target.value)}
                        placeholder="Nombre de la variante (ej. Mediana 30cm)"
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#D0D5DD] bg-white text-[#111827]"
                      />

                      <div className="w-32 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">$</span>
                        <input
                          type="number"
                          step="500"
                          value={variant.price}
                          onChange={e => handleUpdateVariant(variant.id, 'price', Number(e.target.value))}
                          placeholder="Precio"
                          className="w-full pl-6 pr-2.5 py-1.5 text-xs font-bold rounded-lg border border-[#D0D5DD] bg-white text-teal-700"
                        />
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-[#344054] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variant.isAvailable}
                          onChange={e => handleUpdateVariant(variant.id, 'isAvailable', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-teal-600 border-[#D0D5DD]"
                        />
                        <span>En stock</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                        title="Eliminar variante"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Modifiers / Option Groups */}
          {activeTab === 'modifiers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">Grupos de Modificadores & Complementos</h4>
                  <p className="text-[11px] text-[#667085]">
                    Personalizaciones del cliente: salsas, ingredientes extra, bebidas o nivel de picante.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOptionGroup}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Grupo</span>
                </button>
              </div>

              {optionGroups.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#D0D5DD] rounded-2xl bg-[#F9FAFB]">
                  <Sliders className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#111827]">Sin modificadores asignados</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Permite a los clientes personalizar ingredientes como queso extra, salsas o cubiertos.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddOptionGroup}
                    className="mt-3 px-3 py-1.5 bg-white border border-[#D0D5DD] hover:bg-slate-50 text-[#344054] rounded-lg text-xs font-semibold"
                  >
                    + Crear grupo de modificadores
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {optionGroups.map(group => (
                    <div 
                      key={group.id}
                      className="p-4 bg-[#F9FAFB] border border-[#E4E7EC] rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={group.name}
                          onChange={e => handleUpdateOptionGroup(group.id, 'name', e.target.value)}
                          placeholder="Nombre del grupo (ej. Elige tus salsas)"
                          className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#D0D5DD] bg-white text-[#111827]"
                        />

                        <label className="flex items-center gap-1.5 text-xs text-[#344054] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={group.required}
                            onChange={e => handleUpdateOptionGroup(group.id, 'required', e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-teal-600 border-[#D0D5DD]"
                          />
                          <span className="font-semibold">Obligatorio</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveOptionGroup(group.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Eliminar grupo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options within group */}
                      <div className="space-y-2 pl-2 border-l-2 border-teal-200">
                        {group.options.map(opt => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt.name}
                              onChange={e => handleUpdateOption(group.id, opt.id, 'name', e.target.value)}
                              placeholder="Nombre del adicional"
                              className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-[#D0D5DD] bg-white text-[#111827]"
                            />
                            <div className="w-28 relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#667085]">+$</span>
                              <input
                                type="number"
                                step="500"
                                value={opt.price}
                                onChange={e => handleUpdateOption(group.id, opt.id, 'price', Number(e.target.value))}
                                placeholder="0"
                                className="w-full pl-6 pr-2 py-1 text-xs rounded-lg border border-[#D0D5DD] bg-white text-teal-700 font-semibold"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(group.id, opt.id)}
                              className="p-1 text-slate-400 hover:text-red-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleAddOptionToGroup(group.id)}
                          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar opción a este grupo</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Combo */}
          {activeTab === 'combo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E4E7EC] space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCombo}
                    onChange={e => setIsCombo(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-[#D0D5DD]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Este producto es un Combo / Paquete compuesto
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      Muestra la insignia de Combo y el desglose de productos incluidos al cliente
                    </span>
                  </div>
                </label>

                {isCombo && (
                  <div className="pt-2 border-t border-[#E4E7EC] space-y-2">
                    <label className="block text-xs font-semibold text-[#111827]">
                      Productos o Elementos incluidos en el Combo (un renglón por ítem):
                    </label>
                    <textarea
                      rows={4}
                      value={comboItemsText}
                      onChange={e => setComboItemsText(e.target.value)}
                      placeholder="1x Hamburguesa Clásica Artesanal&#10;1x Porción de Papas a la Francesa medianas&#10;1x Gaseosa 400ml o Té helado"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600 font-mono"
                    />
                    <p className="text-[11px] text-[#667085]">
                      El cliente verá claramente qué incluye el paquete al desplegar el producto en el marketplace.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-[#E4E7EC] flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D0D5DD] hover:bg-[#F9FAFB] text-xs font-semibold text-[#344054] transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="product-form"
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{initialProduct ? 'Guardar Cambios' : 'Registrar Producto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
