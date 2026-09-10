import React, { useState, useEffect } from 'react';
import { X, Truck, Phone, Star, Check, Shield } from 'lucide-react';
import { Courier } from '../../types';

interface RiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courierData: Omit<Courier, 'id'>, editId?: string) => void;
  initialCourier?: Courier | null;
}

const PRESET_AVATARS = [
  { name: 'Carlos', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Valentina', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Andrés', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Mariana', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Mateo', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { name: 'Daniela', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }
];

export const RiderModal: React.FC<RiderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCourier
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+57 3');
  const [vehicle, setVehicle] = useState('Moto Yamaha FZ 2.0');
  const [plate, setPlate] = useState('XYZ-12A');
  const [rating, setRating] = useState<number>(4.9);
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [status, setStatus] = useState<'active' | 'on_route' | 'offline'>('active');
  const [completedDeliveries, setCompletedDeliveries] = useState<number>(0);

  useEffect(() => {
    if (initialCourier) {
      setName(initialCourier.name);
      setPhone(initialCourier.phone || '+57 3');
      setVehicle(initialCourier.vehicle || 'Moto');
      setPlate(initialCourier.plate || '');
      setRating(initialCourier.rating || 4.9);
      setAvatar(initialCourier.avatar);
      setStatus(initialCourier.status || 'active');
      setCompletedDeliveries(initialCourier.completedDeliveries || 0);
    } else {
      setName('');
      setPhone('+57 31');
      setVehicle('Moto Yamaha FZ 2.0');
      setPlate('');
      setRating(5.0);
      setAvatar(PRESET_AVATARS[0].url);
      setStatus('active');
      setCompletedDeliveries(0);
    }
  }, [initialCourier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !vehicle.trim()) return;

    const courierData: Omit<Courier, 'id'> = {
      name: name.trim(),
      phone: phone.trim(),
      vehicle: vehicle.trim(),
      plate: plate.trim().toUpperCase() || 'LVT-000',
      rating: Number(rating) || 5.0,
      avatar,
      status,
      completedDeliveries: Number(completedDeliveries) || 0,
      currentLat: initialCourier?.currentLat || 7.065,
      currentLng: initialCourier?.currentLng || -73.105
    };

    onSave(courierData, initialCourier?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialCourier ? 'Editar Rider / Repartidor' : 'Alta de Nuevo Rider'}
              </h2>
              <p className="text-xs text-slate-400">
                Registra los datos del vehículo y contacto de la flota
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Juan David Pineda"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Celular / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+57 318 000 0000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Vehicle & Plate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Vehículo (Modelo / Tipo) *
              </label>
              <input
                type="text"
                required
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                placeholder="Ej. Moto Boxer CT 100, Bici Eléctrica"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Placa / Identificador
              </label>
              <input
                type="text"
                value={plate}
                onChange={e => setPlate(e.target.value)}
                placeholder="Ej. LVT-89D o BICI-04"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Initial Status & Deliveries */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Estado Operativo
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="active">Disponible (Verde)</option>
                <option value="on_route">En Ruta (Azul)</option>
                <option value="offline">Desconectado (Gris)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Calificación
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Entregas Totales
              </label>
              <input
                type="number"
                min="0"
                value={completedDeliveries}
                onChange={e => setCompletedDeliveries(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Avatar Presets & Custom */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Foto de Perfil del Rider
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(av.url)}
                  className={`relative flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    avatar === av.url ? 'border-teal-500 ring-2 ring-teal-500/40 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av.url} alt={av.name} className="w-12 h-12 object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[8px] text-white text-center">
                    {av.name}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-[11px] text-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{initialCourier ? 'Guardar Rider' : 'Registrar en Flota'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
