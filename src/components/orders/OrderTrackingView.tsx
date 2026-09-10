import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Store, 
  Send,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    activeTrackingOrderId, 
    setCurrentView, 
    advanceOrderStatus, 
    cancelOrder,
    showToast 
  } = useApp();

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'courier'; text: string; time: string }>>([
    { sender: 'courier', text: '¡Hola! Ya recogí tu pedido de Donas & Café Cañaveral y voy en camino.', time: '17:36' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const order = orders.find(o => o.id === activeTrackingOrderId) || orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">No hay orden activa para rastrear.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-xl text-xs font-bold"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  const steps = [
    { id: 'confirmed', label: 'Pedido Confirmado', time: order.timeline.confirmedAt },
    { id: 'preparing', label: 'En Preparación', time: order.timeline.preparingAt || 'En curso' },
    { id: 'on_the_way', label: 'En Camino (Repartidor)', time: order.timeline.pickedUpAt || 'Próximo' },
    { id: 'delivered', label: 'Entregado', time: order.timeline.deliveredAt || '--:--' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Simulate auto courier reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'courier',
          text: '¡Entendido! Llego en unos minutos a la dirección indicada.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setCurrentView('orders')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95 text-[#0F172A]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-sm font-extrabold text-[#0F172A]">Seguimiento en Vivo</h1>
          <p className="text-[10px] text-teal-600 font-bold tracking-wider uppercase">
            Orden #{order.orderNumber}
          </p>
        </div>

        {/* Demo Simulator button */}
        <button
          onClick={() => advanceOrderStatus(order.id)}
          title="Simular avance de estado"
          className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-[11px] font-bold flex items-center gap-1 border border-teal-200 active:scale-95"
        >
          <Play className="w-3 h-3 fill-teal-700" />
          <span className="hidden sm:inline">Avanzar</span>
        </button>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-4">
        {/* Animated Map Simulation Canvas */}
        <div className="relative w-full h-56 bg-slate-800 rounded-3xl overflow-hidden shadow-md border border-slate-200">
          {/* Simulated Map Background with Grid and Streets */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Simulated Roads SVG */}
          <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 40 180 Q 120 100 240 120 T 420 50"
              fill="none"
              stroke="#334155"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 40 180 Q 120 100 240 120 T 420 50"
              fill="none"
              stroke="#14B8A6"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Store Pin (Origin) */}
          <div className="absolute left-8 bottom-8 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded mt-1 backdrop-blur-sm">
              Local
            </span>
          </div>

          {/* Destination Pin (User Address) */}
          <div className="absolute right-10 top-6 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-white bg-teal-900/80 px-1.5 py-0.5 rounded mt-1 backdrop-blur-sm">
              Tu Casa
            </span>
          </div>

          {/* Moving Delivery Courier Marker */}
          <motion.div
            animate={{
              x: order.status === 'delivered' ? 320 : order.status === 'on_the_way' ? 180 : 60,
              y: order.status === 'delivered' ? 40 : order.status === 'on_the_way' ? 90 : 140,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 60 }}
            className="absolute top-0 left-0 flex flex-col items-center z-10"
          >
            <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-teal-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div className="bg-white text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md mt-1 whitespace-nowrap">
              Carlos M. (Moto)
            </div>
          </motion.div>

          {/* Map Overlay Badge with ETA */}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>ETA: {order.status === 'delivered' ? '¡Entregado!' : `${order.estimatedMinutes} mins`}</span>
          </div>
        </div>

        {/* Status Stepper */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Estado del Pedido</h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
              {order.status === 'on_the_way' ? 'Repartidor en Ruta' : order.status === 'preparing' ? 'Preparando' : order.status === 'delivered' ? 'Entregado' : 'Confirmado'}
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="flex-1 flex items-center justify-between text-xs">
                    <span className={`font-bold ${isCurrent ? 'text-[#0F172A]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{step.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Courier Details & Live Interaction */}
        {order.courier && (
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={order.courier.avatar}
                alt={order.courier.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm"
              />
              <div>
                <h4 className="text-xs font-extrabold text-[#0F172A]">{order.courier.name}</h4>
                <p className="text-[11px] text-slate-500">{order.courier.vehicle} • {order.courier.plate}</p>
                <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold">
                  <span>★ {order.courier.rating}</span>
                  <span className="text-slate-400">({order.courier.completedDeliveries} entregas)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatOpen(true)}
                className="w-9 h-9 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-700 flex items-center justify-center shadow-sm active:scale-95 transition-all"
                title="Chat con repartidor"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Llamada en curso...', `Conectando con ${order.courier?.phone}`, 'info')}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
                title="Llamar repartidor"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* Order Items Breakdown */}
        <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2 text-xs">
          <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2">Detalles de la Orden</h4>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-800">
                {item.quantity}x {item.product.name}
              </span>
              <span className="font-bold text-[#0F172A]">
                ${(item.product.price * item.quantity).toLocaleString('es-CO')}
              </span>
            </div>
          ))}

          <div className="pt-2 flex justify-between font-black text-sm text-[#0F172A]">
            <span>Total Pagado</span>
            <span className="text-teal-600">${order.total.toLocaleString('es-CO')}</span>
          </div>
        </section>
      </main>

      {/* Live Chat Modal with Courier */}
      <AnimatePresence>
        {chatOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl h-[70vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <img
                    src={order.courier?.avatar}
                    alt="Courier"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{order.courier?.name}</h4>
                    <span className="text-[10px] text-teal-600 font-semibold">Repartidor asignado</span>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-teal-500 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm'
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`text-[9px] block text-right mt-1 ${
                        msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe un mensaje al repartidor..."
                  className="flex-1 text-xs px-3 py-2.5 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
