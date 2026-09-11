import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Sparkles, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Copy, 
  Layers, 
  Flame, 
  ArrowUpDown, 
  CheckSquare, 
  Square,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Package
} from 'lucide-react';
import { Product, Store } from '../../types';

interface ProductManagementTableProps {
  products: Product[];
  store?: Store;
  allStores?: Store[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleAvailability: (productId: string, currentStatus: boolean) => void;
  onQuickUpdatePrice: (productId: string, newPrice: number) => void;
  onBulkUpdateAvailability: (productIds: string[], isAvailable: boolean) => void;
  onBulkDelete: (productIds: string[]) => void;
}

export const ProductManagementTable: React.FC<ProductManagementTableProps> = ({
  products,
  store,
  allStores,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleAvailability,
  onQuickUpdatePrice,
  onBulkUpdateAvailability,
  onBulkDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'out_of_stock' | 'combos' | 'popular'>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCat = (p.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'available' && !p.isAvailable) return false;
      if (availabilityFilter === 'out_of_stock' && p.isAvailable) return false;
      if (availabilityFilter === 'combos' && !p.isCombo) return false;
      if (availabilityFilter === 'popular' && !p.popular) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, availabilityFilter]);

  // Selection handlers
  const allFilteredSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedProductIds(prev => [...prev, id]);
    }
  };

  // Quick price edit
  const handleStartPriceEdit = (p: Product) => {
    setEditingPriceId(p.id);
    setTempPrice(p.price.toString());
  };

  const handleSavePrice = (id: string) => {
    const num = Number(tempPrice);
    if (!isNaN(num) && num >= 0) {
      onQuickUpdatePrice(id, num);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-xs overflow-hidden">
      {/* Header controls */}
      <div className="p-4 sm:p-5 border-b border-[#E4E7EC] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <span>Inventario y Catálogo de Productos</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2F4F7] text-[#344054]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </span>
            </h3>
            <p className="text-xs text-[#667085]">
              Administra precios, stock en tiempo real y disponibilidad para clientes
            </p>
          </div>

          <button
            onClick={onAddProduct}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
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
              placeholder="Buscar por nombre, ingrediente o sección..."
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

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[#D0D5DD] bg-white text-[#344054] font-medium focus:outline-none focus:border-teal-600"
            >
              <option value="all">Todas las categorías ({products.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({products.filter(p => p.category === cat).length})
                </option>
              ))}
            </select>

            {/* Status toggle pill group */}
            <div className="inline-flex rounded-xl border border-[#D0D5DD] p-0.5 bg-[#F9FAFB] text-xs">
              <button
                type="button"
                onClick={() => setAvailabilityFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  availabilityFilter === 'all' ? 'bg-white shadow-xs text-[#111827] font-semibold' : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  availabilityFilter === 'available' ? 'bg-white shadow-xs text-emerald-700 font-semibold' : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                Disponibles
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('out_of_stock')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  availabilityFilter === 'out_of_stock' ? 'bg-white shadow-xs text-amber-700 font-semibold' : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                Agotados
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('popular')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  availabilityFilter === 'popular' ? 'bg-white shadow-xs text-indigo-700 font-semibold' : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                ⭐ Destacados
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk action toolbar (when items selected) */}
      {selectedProductIds.length > 0 && (
        <div className="bg-[#F0FDF9] border-b border-teal-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px]">
              {selectedProductIds.length}
            </span>
            <span className="font-semibold text-teal-950">
              {selectedProductIds.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkUpdateAvailability(selectedProductIds, true)}
              className="px-3 py-1.5 bg-white border border-teal-300 hover:bg-teal-50 text-teal-800 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Marcar como Disponibles</span>
            </button>

            <button
              onClick={() => onBulkUpdateAvailability(selectedProductIds, false)}
              className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Marcar como Agotados</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm(`¿Estás seguro de eliminar los ${selectedProductIds.length} productos seleccionados?`)) {
                  onBulkDelete(selectedProductIds);
                  setSelectedProductIds([]);
                }
              }}
              className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-700 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>

            <button
              onClick={() => setSelectedProductIds([])}
              className="px-2.5 py-1.5 text-[#667085] hover:text-[#111827] font-medium"
            >
              Deseleccionar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E4E7EC] text-[11px] font-semibold text-[#475467] uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-[#D0D5DD] text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 w-16">Foto</th>
              <th className="py-3 px-4 min-w-[200px]">Producto</th>
              <th className="py-3 px-4 min-w-[140px]">Categoría</th>
              <th className="py-3 px-4 min-w-[140px]">Precio</th>
              <th className="py-3 px-4 min-w-[150px]">Disponibilidad</th>
              <th className="py-3 px-4 text-right w-28">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E7EC] text-xs">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#667085]">
                  <Package className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                  <p className="font-semibold text-[#111827]">No se encontraron productos</p>
                  <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                    {searchQuery 
                      ? `No hay coincidencias con el término "${searchQuery}". Intenta con otra palabra clave.`
                      : 'Este comercio aún no tiene productos registrados en esta sección.'}
                  </p>
                  <button
                    onClick={onAddProduct}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Producto Ahora</span>
                  </button>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                const isEditingThisPrice = editingPriceId === product.id;

                return (
                  <tr 
                    key={product.id}
                    className={`hover:bg-[#F9FAFB] transition-colors ${
                      isSelected ? 'bg-teal-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(product.id)}
                        className="w-4 h-4 rounded border-[#D0D5DD] text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </td>

                    {/* Image */}
                    <td className="py-3.5 px-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F2F4F7] border border-[#E4E7EC] overflow-hidden flex-shrink-0 relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback on image load error
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#98A2B3]">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        {!product.isAvailable && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white uppercase tracking-tight">Agotado</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Product Name and details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#111827]">{product.name}</span>
                        {product.popular && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                            <Flame className="w-3 h-3 text-amber-500" />
                            <span>Top</span>
                          </span>
                        )}
                        {product.isCombo && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                            <span>Combo</span>
                          </span>
                        )}
                        {product.variants && product.variants.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                            <span>{product.variants.length} variantes</span>
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-[11px] text-[#667085] line-clamp-1 mt-0.5 max-w-md">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#98A2B3]">
                        {product.preparationTime && (
                          <span>⏱ {product.preparationTime}</span>
                        )}
                        {product.calories && (
                          <span>· {product.calories}</span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#F2F4F7] text-[#344054] font-medium text-xs">
                        {product.category || 'General'}
                      </span>
                    </td>

                    {/* Price with quick inline edit */}
                    <td className="py-3.5 px-4">
                      {isEditingThisPrice ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-[#667085]">$</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={e => setTempPrice(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSavePrice(product.id);
                              if (e.key === 'Escape') setEditingPriceId(null);
                            }}
                            autoFocus
                            className="w-24 px-2 py-1 text-xs font-bold border border-teal-500 rounded-lg text-[#111827] focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                          <button
                            onClick={() => handleSavePrice(product.id)}
                            className="p-1 rounded bg-teal-600 text-white hover:bg-teal-700"
                            title="Guardar precio"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                            title="Cancelar"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => handleStartPriceEdit(product)}
                          className="group flex items-center gap-1.5 cursor-pointer"
                          title="Clic para editar precio rápidamente"
                        >
                          <div>
                            <span className="font-bold text-[#111827] text-sm">
                              ${product.price.toLocaleString('es-CO')}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="block text-[10px] text-[#98A2B3] line-through">
                                ${product.originalPrice.toLocaleString('es-CO')}
                              </span>
                            )}
                          </div>
                          <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>

                    {/* Availability switch */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleAvailability(product.id, product.isAvailable)}
                        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                          product.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{product.isAvailable ? 'Disponible' : 'Agotado'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 rounded-lg text-[#667085] hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          title="Editar producto completo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Deseas eliminar permanentemente "${product.name}"?`)) {
                              onDeleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#667085] hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
