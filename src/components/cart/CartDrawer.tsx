import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  ShoppingBag, 
  Store as StoreIcon, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { COUPONS } from '../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    updateCartItemQty, 
    removeCartItem, 
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDeliveryFee,
    cartServiceFee,
    cartDiscount,
    cartTotal,
    setCurrentView
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Tu Carrito</h2>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-20 h-20 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Explora nuestros comercios destacados y añade tus platos o servicios favoritos.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('home');
                  }}
                  className="mt-2 px-6 py-2.5 bg-teal-500 text-white font-bold text-xs rounded-full shadow-md hover:bg-teal-600 active:scale-95 transition-all"
                >
                  Explorar comercios
                </button>
              </div>
            ) : (
              <>
                {/* Store origin badge */}
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <StoreIcon className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-[#0F172A] truncate">
                    Pedido de: {cart[0]?.store?.name}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#0F172A] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs font-black text-teal-600 mt-0.5">
                          ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                        </p>
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {item.selectedOptions.map(o => o.optionName).join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center bg-slate-100 rounded-full px-1.5 py-0.5">
                        <button
                          onClick={() => updateCartItemQty(item.id, -1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-700 hover:bg-white active:scale-90"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3 h-3 text-red-500" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#0F172A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQty(item.id, 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-700 hover:bg-white active:scale-90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon applicator */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-teal-600" />
                      Cupón de descuento
                    </span>
                    {appliedCoupon && (
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] font-bold text-red-500 hover:underline"
                      >
                        Quitar
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-teal-900 block">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-teal-700">{appliedCoupon.description}</span>
                      </div>
                      <span className="font-bold text-teal-700">
                        -${cartDiscount.toLocaleString('es-CO')}
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej. ENVIOGRATIS"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold active:scale-95 transition-all"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">{couponError}</p>
                  )}

                  {/* Sample coupon hints */}
                  <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                    {COUPONS.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => applyCoupon(c.code)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 font-medium text-slate-600 transition-colors whitespace-nowrap"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal productos</span>
                    <span className="font-semibold">${cartSubtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Costo de envío</span>
                    <span className="font-semibold">
                      {cartDeliveryFee === 0 ? (
                        <span className="text-teal-600 font-bold">GRATIS</span>
                      ) : (
                        `$${cartDeliveryFee.toLocaleString('es-CO')}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tarifa de servicio y plataforma</span>
                    <span className="font-semibold">${cartServiceFee.toLocaleString('es-CO')}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-teal-700 font-bold">
                      <span>Descuento aplicado</span>
                      <span>-${cartDiscount.toLocaleString('es-CO')}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-[#0F172A]">
                    <span>Total a pagar</span>
                    <span className="text-base text-teal-600">
                      ${cartTotal.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white shadow-lg">
              <button
                onClick={handleProceedToCheckout}
                className="w-full h-13 bg-teal-500 hover:bg-teal-600 active:scale-98 text-white rounded-2xl font-bold text-sm flex items-center justify-between px-5 shadow-lg shadow-teal-500/25 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>Proceder al Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="font-black text-base">${cartTotal.toLocaleString('es-CO')}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
