import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingCartPill: React.FC = () => {
  const { cart, cartItemCount, cartSubtotal, setIsCartDrawerOpen, currentView } = useApp();

  // Hide if cart is empty or we are already in checkout/order-tracking
  if (cart.length === 0 || currentView === 'checkout' || currentView === 'order-tracking' || currentView === 'admin') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto pointer-events-auto"
      >
        <div 
          onClick={() => setIsCartDrawerOpen(true)}
          className="backdrop-blur-md bg-teal-500/95 text-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center justify-between h-16 border border-white/20 active:scale-[0.98] transition-transform cursor-pointer"
        >
          {/* Left: Bag icon + item count */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Center: Total price */}
          <div className="text-lg font-black tracking-tight text-white">
            ${cartSubtotal.toLocaleString('es-CO')}
          </div>

          {/* Right: Continuar button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsCartDrawerOpen(true);
            }}
            className="bg-[#0F172A] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
          >
            <span>Continuar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
