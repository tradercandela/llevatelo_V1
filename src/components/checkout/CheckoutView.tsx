import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  DollarSign,
  Smartphone,
  Check,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { PaymentMethodType } from '../../types';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDeliveryFee, 
    cartServiceFee, 
    cartDiscount, 
    cartTotal,
    selectedAddress,
    placeOrder,
    setCurrentView,
    showToast,
    user
  } = useApp();

  const isCashEligible = Boolean(user.whatsappVerified && user.emailVerified);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('nequi');
  const [tipAmount, setTipAmount] = useState<number>(2000);
  const [isScheduled, setIsScheduled] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const grandTotal = cartTotal + tipAmount;

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      showToast('Carrito vacío', 'Agrega productos antes de pagar.', 'warning');
      setCurrentView('home');
      return;
    }

    if (paymentMethod === 'cash' && !isCashEligible) {
      showToast(
        'Efectivo contraentrega no disponible',
        'Debes verificar tu WhatsApp y tu correo electrónico para usar este método.',
        'warning'
      );
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setIsProcessing(false);
      try {
        placeOrder(paymentMethod, tipAmount, selectedAddress);
      } catch (e: any) {
        showToast('Error al procesar pedido', e.message || 'Intente nuevamente.', 'warning');
      }
    }, 1200);
  };

  const paymentOptions: { 
    id: PaymentMethodType; 
    name: string; 
    icon: string; 
    subtitle: string;
    badge?: string;
  }[] = [
    { 
      id: 'nequi', 
      name: 'Nequi', 
      icon: '🟣', 
      subtitle: 'Pago digital instantáneo sin costo (Notificación Push)',
      badge: 'Popular en Colombia'
    },
    { 
      id: 'card', 
      name: 'Tarjeta Débito / Crédito', 
      icon: '💳', 
      subtitle: 'Pasarela integrada segura (Visa, Mastercard, Débito PSE)',
      badge: 'Wompi Gateway'
    },
    { 
      id: 'cash', 
      name: 'Efectivo contraentrega', 
      icon: '💵', 
      subtitle: 'Paga en efectivo al recibir tu pedido en la puerta',
      badge: 'Requiere validación'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setCurrentView('home')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95 text-[#0F172A]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-[#0F172A]">Confirmación y Checkout</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-5">
        {/* Step 1: Delivery Address */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Dirección de Entrega
            </span>
            <span className="text-xs font-bold text-teal-600">Verificada</span>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#0F172A]">{selectedAddress.title} • {selectedAddress.area}</p>
              <p className="text-xs text-slate-600 mt-0.5">{selectedAddress.fullAddress}</p>
              {selectedAddress.notes && (
                <p className="text-[11px] text-slate-400 italic mt-0.5">Nota: {selectedAddress.notes}</p>
              )}
            </div>
          </div>
        </section>

        {/* Step 2: Estimated Time */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            2. Tiempo de Entrega
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsScheduled(false)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                !isScheduled
                  ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                  : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Entrega Inmediata</span>
                {!isScheduled && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </div>
              <p className="text-[11px] text-teal-700 font-semibold mt-1">15 - 25 minutos</p>
            </button>

            <button
              type="button"
              onClick={() => setIsScheduled(true)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isScheduled
                  ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                  : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Programar</span>
                {isScheduled && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Elegir horario hoy</p>
            </button>
          </div>
        </section>

        {/* Step 3: Payment Method */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Método de Pago
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Pasarela Segura SSL</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {paymentOptions.map((opt) => {
              const isSelected = paymentMethod === opt.id;
              const isCash = opt.id === 'cash';
              const isDisabled = isCash && !isCashEligible;

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (isDisabled) {
                      showToast(
                        'Efectivo contraentrega no disponible',
                        'Para habilitar pagos en efectivo, valida tu WhatsApp y correo en tu perfil.',
                        'info'
                      );
                      return;
                    }
                    setPaymentMethod(opt.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDisabled
                      ? 'border-slate-200 bg-slate-50/70 opacity-80 cursor-not-allowed'
                      : isSelected
                      ? 'border-teal-500 bg-teal-50/50 shadow-sm ring-1 ring-teal-500 cursor-pointer'
                      : 'border-slate-100 bg-white hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold ${
                        isDisabled ? 'bg-slate-200 text-slate-400' : 'bg-slate-100'
                      }`}>
                        {opt.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-bold ${isDisabled ? 'text-slate-500' : 'text-[#0F172A]'}`}>
                            {opt.name}
                          </p>
                          {opt.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              isDisabled 
                                ? 'bg-slate-200 text-slate-500' 
                                : isSelected 
                                ? 'bg-teal-200/60 text-teal-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{opt.subtitle}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isDisabled 
                        ? 'border-slate-300 bg-slate-100 text-slate-400'
                        : isSelected 
                        ? 'bg-teal-500 border-teal-500 text-white' 
                        : 'border-slate-300'
                    }`}>
                      {isDisabled ? (
                        <Lock className="w-3 h-3 text-slate-400" />
                      ) : isSelected ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : null}
                    </div>
                  </div>

                  {/* Clarification banner if cash is disabled */}
                  {isDisabled && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-start justify-between gap-2 text-[11px]">
                      <div className="flex items-start gap-1.5 text-amber-700 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                          Disponible solo con WhatsApp y correo verificados (prevención de fraude).
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('profile');
                        }}
                        className="text-[10px] font-bold text-teal-700 bg-teal-100/70 hover:bg-teal-200 px-2 py-1 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                      >
                        <span>Verificar ahora</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Courier Tip */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Propina para el Repartidor
            </span>
            <span className="text-[10px] text-slate-400">100% para el repartidor</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0, 2000, 4000, 6000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setTipAmount(amount)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  tipAmount === amount
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {amount === 0 ? 'Sin propina' : `$${amount.toLocaleString('es-CO')}`}
              </button>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-2 text-xs">
          <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2">Resumen Final</h4>
          
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ({cart.length} artículos)</span>
            <span className="font-semibold">${cartSubtotal.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Envío</span>
            <span className="font-semibold">
              {cartDeliveryFee === 0 ? 'GRATIS' : `$${cartDeliveryFee.toLocaleString('es-CO')}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Tarifa de servicio</span>
            <span className="font-semibold">${cartServiceFee.toLocaleString('es-CO')}</span>
          </div>
          {tipAmount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Propina</span>
              <span className="font-semibold">${tipAmount.toLocaleString('es-CO')}</span>
            </div>
          )}
          {cartDiscount > 0 && (
            <div className="flex justify-between text-teal-700 font-bold">
              <span>Descuento aplicado</span>
              <span>-${cartDiscount.toLocaleString('es-CO')}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-[#0F172A]">
            <span>Total a cargar</span>
            <span className="text-xl text-teal-600">
              ${grandTotal.toLocaleString('es-CO')}
            </span>
          </div>
        </section>

        {/* Pay Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full h-14 bg-teal-500 hover:bg-teal-600 active:scale-98 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-teal-500/25 transition-all disabled:opacity-75 cursor-pointer"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Procesando pago seguro...</span>
            </div>
          ) : (
            <>
              <span>Confirmar y Pagar • ${grandTotal.toLocaleString('es-CO')}</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
};
