import React, { useState } from 'react';
import { X, MapPin, Plus, Check, Navigation, Building2, Home } from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { Address } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  const { addresses, selectedAddress, setSelectedAddress, addAddress, showToast } = useApp();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('Casa');
  const [newArea, setNewArea] = useState('');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    showToast('Obteniendo ubicación GPS...', 'Simulando geolocalización de alta precisión.', 'info');
    setTimeout(() => {
      const detectedAddress: Omit<Address, 'id'> = {
        title: 'Ubicación actual',
        area: 'Cañaveral, Sector Campestre',
        fullAddress: 'Carrera 24 # 154-20, Torre 1',
        notes: 'Ubicación detectada por GPS',
        isDefault: false
      };
      addAddress(detectedAddress);
      onClose();
    }, 800);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.trim() || !newFullAddress.trim()) {
      showToast('Campos requeridos', 'Por favor ingresa la zona y dirección exacta.', 'warning');
      return;
    }

    addAddress({
      title: newTitle,
      area: newArea,
      fullAddress: newFullAddress,
      notes: newNotes,
      isDefault: false
    });

    setIsAddingNew(false);
    setNewArea('');
    setNewFullAddress('');
    setNewNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">¿Dónde entregamos tu pedido?</h3>
              <p className="text-xs text-slate-500">Selecciona tu dirección de entrega</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-4">
            {/* Use Current GPS Location */}
            <button
              onClick={handleUseCurrentLocation}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-100 transition-all active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-sm">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-bold">Usar mi ubicación actual</p>
                <p className="text-[11px] text-teal-700">Detectar vía GPS automático</p>
              </div>
            </button>

            {/* Address List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Direcciones guardadas
              </span>
              {addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm ring-1 ring-teal-500'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                      isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {addr.title.toLowerCase().includes('casa') ? (
                        <Home className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F172A]">{addr.title}</span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Seleccionada
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{addr.area}</p>
                      <p className="text-[11px] text-slate-500 truncate">{addr.fullAddress}</p>
                      {addr.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-0.5">Nota: {addr.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Address Form / Toggle */}
            {!isAddingNew ? (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Agregar nueva dirección</span>
              </button>
            ) : (
              <form onSubmit={handleSaveNew} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-[#0F172A] block">Nueva dirección</span>
                
                <div className="flex gap-2">
                  {['Casa', 'Trabajo', 'Otro'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewTitle(tag)}
                      className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                        newTitle === tag
                          ? 'bg-teal-500 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Zona o Barrio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cañaveral, Floridablanca"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Dirección exacta</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Calle 12 # 4-55, Apto 301"
                    value={newFullAddress}
                    onChange={(e) => setNewFullAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Instrucciones de entrega</label>
                  <input
                    type="text"
                    placeholder="Ej. Timbre 301 / Dejar en portería"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-xl shadow-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
