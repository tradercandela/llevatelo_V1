import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { Product, Store, CartItemOption } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  store: Store | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  store,
  onClose
}) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setInstructions('');
      // Set defaults for required single-select options
      const initialOptions: Record<string, string[]> = {};
      product.optionGroups?.forEach((group) => {
        if (group.required && group.options.length > 0) {
          initialOptions[group.id] = [group.options[0].id];
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  if (!product || !store) return null;

  // Calculate extra cost from options
  let extraCost = 0;
  product.optionGroups?.forEach((group) => {
    const selectedIds = selectedOptions[group.id] || [];
    selectedIds.forEach((optId) => {
      const opt = group.options.find((o) => o.id === optId);
      if (opt) extraCost += opt.price;
    });
  });

  const unitTotal = product.price + extraCost;
  const totalPrice = unitTotal * quantity;

  const handleToggleOption = (groupId: string, optionId: string, isSingleSelect: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      if (isSingleSelect) {
        return { ...prev, [groupId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  const handleAddToCart = () => {
    // Transform selected options to CartItemOption structure
    const flattenedOptions: CartItemOption[] = [];
    product.optionGroups?.forEach((group) => {
      const selectedIds = selectedOptions[group.id] || [];
      selectedIds.forEach((optId) => {
        const opt = group.options.find((o) => o.id === optId);
        if (opt) {
          flattenedOptions.push({
            groupId: group.id,
            groupName: group.name,
            optionId: opt.id,
            optionName: opt.name,
            price: opt.price
          });
        }
      });
    });

    addToCart(product, store, quantity, flattenedOptions, instructions);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Cover Header */}
          <div className="relative w-full h-56 bg-slate-100 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            {product.popular && (
              <div className="absolute top-4 left-4 bg-teal-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Popular
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-5">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-extrabold text-[#0F172A] leading-tight">
                  {product.name}
                </h3>
                <span className="text-lg font-black text-teal-600 ml-3">
                  ${product.price.toLocaleString('es-CO')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {product.description}
              </p>
              {product.preparationTime && (
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-600 bg-slate-100 w-fit px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Listo en {product.preparationTime} aprox.</span>
                </div>
              )}
            </div>

            {/* Option Groups */}
            {product.optionGroups?.map((group) => {
              const isSingle = group.required && group.maxSelect === undefined;
              const currentGroupSelections = selectedOptions[group.id] || [];

              return (
                <div key={group.id} className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#0F172A]">{group.name}</span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {group.required ? 'Obligatorio' : 'Opcional'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((opt) => {
                      const isSelected = currentGroupSelections.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleOption(group.id, opt.id, isSingle)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-teal-500 bg-teal-50/60 text-teal-950 ring-1 ring-teal-500'
                              : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                              isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span>{opt.name}</span>
                          </div>
                          {opt.price > 0 && (
                            <span className="text-teal-600 font-bold">
                              +${opt.price.toLocaleString('es-CO')}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special Instructions */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5">
                Instrucciones especiales para la cocina
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ej. Sin azúcar extra, salsa aparte, empaque ecológico..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Quantity & Add to Cart */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full px-2 py-1 shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#0F172A]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-teal-500 hover:bg-teal-600 active:scale-98 text-white rounded-full font-bold text-sm flex items-center justify-between px-5 shadow-lg shadow-teal-500/25 transition-all"
            >
              <span>Agregar al pedido</span>
              <span>${totalPrice.toLocaleString('es-CO')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
