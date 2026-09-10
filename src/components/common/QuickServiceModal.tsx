import React, { useState } from 'react';
import { X, Wrench, Zap, Key, Truck, ShieldCheck, Clock, CheckCircle, PhoneCall } from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { QuickService } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuickServiceModalProps {
  service: QuickService | null;
  onClose: () => void;
}

export const QuickServiceModal: React.FC<QuickServiceModalProps> = ({ service, onClose }) => {
  const { selectedAddress, showToast } = useApp();
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [step, setStep] = useState<'form' | 'confirmed'>('form');

  if (!service) return null;

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmed');
    showToast(
      '¡Técnico asignado!',
      `Técnico en camino para ${service.title} en aprox. ${service.responseTime}`,
      'success'
    );
  };

  const getIcon = () => {
    switch (service.category) {
      case 'plumbing':
        return Wrench;
      case 'electrical':
        return Zap;
      case 'locksmith':
        return Key;
      default:
        return Truck;
    }
  };

  const Icon = getIcon();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">{service.title}</h3>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                  {service.badge}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {step === 'form' ? (
            <form onSubmit={handleRequestService} className="p-5 overflow-y-auto space-y-4">
              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-teal-900 font-bold block">Tarifa base estimada</span>
                  <span className="text-teal-700">{service.priceEstimate}</span>
                </div>
                <div className="text-right">
                  <span className="text-teal-900 font-bold block">Tiempo de respuesta</span>
                  <span className="text-teal-700 font-semibold">{service.responseTime}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">
                  Describe el problema o requerimiento
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej. Fuga debajo del lavaplatos principal, necesito cambio de empaque urgente..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">
                  Dirección del servicio
                </label>
                <div className="p-3 rounded-xl bg-slate-100 text-xs font-semibold text-slate-800">
                  {selectedAddress.fullAddress} ({selectedAddress.area})
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">Servicio Inmediato 24/7</span>
                    <span className="text-[10px] text-slate-500">Técnico disponible ahora</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Todos nuestros técnicos cuentan con antecedentes verificados y garantía de servicio Llévatelo.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 active:scale-98 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Confirmar y Solicitar Técnico</span>
              </button>
            </form>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#0F172A]">¡Técnico en camino!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  El especialista <strong className="text-slate-800">Mauricio Suárez</strong> ha aceptado tu solicitud y llegará en aproximadamente <strong className="text-teal-600">{service.responseTime}</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-left text-xs">
                <div>
                  <p className="font-bold text-[#0F172A]">Mauricio Suárez</p>
                  <p className="text-[11px] text-slate-500">Técnico Certificado #4912</p>
                </div>
                <button
                  onClick={() => showToast('Llamando a soporte...', 'Conectando con el técnico', 'info')}
                  className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
