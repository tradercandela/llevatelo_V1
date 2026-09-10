import React, { useState } from 'react';
import { 
  ReceiptText, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  MapPin, 
  ChevronRight, 
  Star,
  FileText,
  Truck
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { Order } from '../../types';

export const OrdersHistoryView: React.FC = () => {
  const { orders, setActiveTrackingOrderId, setCurrentView, repeatOrder, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setCurrentView('order-tracking');
  };

  const handleDownloadInvoice = (order: Order) => {
    showToast('Factura Electrónica generada', `Comprobante DIAN descargado para orden #${order.orderNumber}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-extrabold text-[#0F172A]">Mis Pedidos</h1>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
          {orders.length} total
        </span>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-4">
        {/* Tabs: En Curso vs Historial */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En Curso ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'past'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historial ({pastOrders.length})
          </button>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ReceiptText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">
              {activeTab === 'active' ? 'No tienes pedidos en curso' : 'No tienes pedidos anteriores'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Cuando realices un pedido podrás ver su estado y rastrearlo en tiempo real aquí.
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-2 px-5 py-2.5 bg-teal-500 text-white rounded-full text-xs font-bold hover:bg-teal-600 shadow-md transition-all"
            >
              Explorar Comercios
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const isDelivered = order.status === 'delivered';
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-all"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#0F172A]">
                          Orden #{order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700'
                            : isCancelled
                            ? 'bg-red-50 text-red-700'
                            : 'bg-teal-50 text-teal-700'
                        }`}>
                          {isDelivered ? 'Entregado' : isCancelled ? 'Cancelado' : 'En camino'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{order.createdAt}</span>
                    </div>

                    <span className="text-sm font-black text-teal-600">
                      ${order.total.toLocaleString('es-CO')}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-600 space-y-1">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-semibold text-slate-800">
                          ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span className="truncate">{order.deliveryAddress.fullAddress} ({order.deliveryAddress.area})</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {!isDelivered && !isCancelled ? (
                      <button
                        onClick={() => handleTrackOrder(order.id)}
                        className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Ver Rastreo en Vivo</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => repeatOrder(order)}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Repetir Pedido</span>
                        </button>

                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Descargar Factura"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Factura</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
