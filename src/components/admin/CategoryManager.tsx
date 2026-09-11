import React, { useState } from 'react';
import { 
  FolderPlus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Layers, 
  Package,
  Plus
} from 'lucide-react';
import { Store, Product } from '../../types';

interface CategoryManagerProps {
  store: Store;
  products: Product[];
  onUpdateCategories: (newCategories: string[]) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  store,
  products,
  onUpdateCategories,
  onRenameCategory
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const currentCategories = store.categories || [];

  // Count products per category
  const productCountMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      const cat = p.category || 'Sin Categoría';
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [products]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (currentCategories.includes(clean)) {
      alert('Esta categoría ya existe.');
      return;
    }
    const updated = [...currentCategories, clean];
    onUpdateCategories(updated);
    setNewCategoryName('');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...currentCategories];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onUpdateCategories(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === currentCategories.length - 1) return;
    const updated = [...currentCategories];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onUpdateCategories(updated);
  };

  const handleDeleteCategory = (catName: string) => {
    const count = productCountMap[catName] || 0;
    if (count > 0) {
      if (!window.confirm(`Esta categoría contiene ${count} producto(s). Si la eliminas, esos productos quedarán huérfanos. ¿Deseas continuar?`)) {
        return;
      }
    }
    const updated = currentCategories.filter(c => c !== catName);
    onUpdateCategories(updated);
  };

  const handleStartRename = (index: number, cat: string) => {
    setEditingIndex(index);
    setEditingName(cat);
  };

  const handleSaveRename = (oldName: string) => {
    const clean = editingName.trim();
    if (!clean || clean === oldName) {
      setEditingIndex(null);
      return;
    }
    onRenameCategory(oldName, clean);
    setEditingIndex(null);
  };

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span>Estructura y Organización de Categorías</span>
        </h3>
        <p className="text-xs text-[#667085]">
          El orden aquí definido es exactamente el que verán los clientes en el menú de la tienda
        </p>
      </div>

      {/* Add new category form */}
      <form onSubmit={handleAddCategory} className="flex gap-2.5">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="Nombre de nueva categoría (ej. Pizzas Especiales, Postres, Bebidas...)"
          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Categoría</span>
        </button>
      </form>

      {/* Categories List */}
      <div className="border border-[#E4E7EC] rounded-xl divide-y divide-[#E4E7EC] overflow-hidden">
        {currentCategories.length === 0 ? (
          <div className="p-8 text-center text-[#667085] text-xs">
            No hay categorías registradas en este comercio. Agrega una arriba.
          </div>
        ) : (
          currentCategories.map((cat, index) => {
            const count = productCountMap[cat] || 0;
            const isEditing = editingIndex === index;

            return (
              <div 
                key={cat}
                className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 text-center text-xs font-bold text-[#98A2B3]">
                    {index + 1}
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        className="px-2.5 py-1 text-xs font-bold border border-teal-500 rounded-lg text-[#111827] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(cat)}
                        className="p-1 rounded bg-teal-600 text-white hover:bg-teal-700"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#111827]">{cat}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F2F4F7] text-[#475467]">
                        {count} {count === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-[#667085] hover:bg-[#F2F4F7] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Subir posición"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === currentCategories.length - 1}
                    className="p-1.5 rounded-lg text-[#667085] hover:bg-[#F2F4F7] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Bajar posición"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartRename(index, cat)}
                    className="p-1.5 rounded-lg text-[#667085] hover:bg-[#F2F4F7] hover:text-teal-700"
                    title="Renombrar categoría"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1.5 rounded-lg text-[#667085] hover:bg-red-50 hover:text-red-700"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
