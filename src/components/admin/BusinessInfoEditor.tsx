import React, { useState, useEffect } from 'react';
import { 
  Store as StoreIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Image as ImageIcon, 
  Check, 
  Save, 
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Store, StoreScheduleDay, CategoryType } from '../../types';
import { DEFAULT_WEEK_SCHEDULE } from './adminHelpers';

interface BusinessInfoEditorProps {
  store: Store;
  onSaveStore: (updatedData: Partial<Store>) => void;
}

const MARKETPLACE_CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'restaurantes', label: 'Restaurantes & Gastronomía' },
  { id: 'antojos_cafe', label: 'Antojos, Café & Panadería' },
  { id: 'supermercado_farmacia', label: 'Supermercado & Farmacia' },
  { id: 'mensajeria', label: 'Mensajería & Paquetes' },
  { id: 'plomeros_electricistas', label: 'Plomeros & Electricistas' },
  { id: 'mantenimiento', label: 'Mantenimiento & Hogar' }
];

export const BusinessInfoEditor: React.FC<BusinessInfoEditorProps> = ({
  store,
  onSaveStore
}) => {
  const [name, setName] = useState(store.name);
  const [tagline, setTagline] = useState(store.tagline || '');
  const [description, setDescription] = useState(store.description || '');
  const [cuisine, setCuisine] = useState(store.cuisine || '');
  const [category, setCategory] = useState<CategoryType>(store.category);
  const [address, setAddress] = useState(store.address || '');
  const [city, setCity] = useState(store.city || 'Bucaramanga / Cañaveral');
  const [neighborhood, setNeighborhood] = useState(store.neighborhood || 'Cañaveral');
  const [phone, setPhone] = useState(store.phone || '');
  const [whatsapp, setWhatsapp] = useState(store.whatsapp || '');
  const [email, setEmail] = useState(store.email || '');
  const [deliveryTime, setDeliveryTime] = useState(store.deliveryTime || '20-30 min');
  const [deliveryFee, setDeliveryFee] = useState<number>(store.deliveryFee || 0);
  const [minOrder, setMinOrder] = useState<number>(store.minOrder || 0);
  const [logo, setLogo] = useState(store.logo || '');
  const [coverImage, setCoverImage] = useState(store.coverImage || '');
  const [schedules, setSchedules] = useState<StoreScheduleDay[]>(
    store.schedules && store.schedules.length > 0 ? store.schedules : DEFAULT_WEEK_SCHEDULE
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setName(store.name);
    setTagline(store.tagline || '');
    setDescription(store.description || '');
    setCuisine(store.cuisine || '');
    setCategory(store.category);
    setAddress(store.address || '');
    setCity(store.city || 'Bucaramanga / Cañaveral');
    setNeighborhood(store.neighborhood || 'Cañaveral');
    setPhone(store.phone || '');
    setWhatsapp(store.whatsapp || '');
    setEmail(store.email || '');
    setDeliveryTime(store.deliveryTime || '20-30 min');
    setDeliveryFee(store.deliveryFee || 0);
    setMinOrder(store.minOrder || 0);
    setLogo(store.logo || '');
    setCoverImage(store.coverImage || '');
    setSchedules(store.schedules && store.schedules.length > 0 ? store.schedules : DEFAULT_WEEK_SCHEDULE);
  }, [store]);

  const handleUpdateScheduleDay = (dayKey: string, field: keyof StoreScheduleDay, val: any) => {
    setSchedules(schedules.map(s => s.day === dayKey ? { ...s, [field]: val } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStore({
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      cuisine: cuisine.trim(),
      category,
      address: address.trim(),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      deliveryTime: deliveryTime.trim(),
      deliveryFee: Number(deliveryFee) || 0,
      minOrder: Number(minOrder) || 0,
      logo: logo.trim(),
      coverImage: coverImage.trim(),
      schedules,
      updatedAt: new Date().toISOString()
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Los datos del comercio se actualizaron y sincronizaron con éxito en la plataforma.</span>
          </div>
          <span className="text-[11px] text-emerald-700">Cambios visibles en vivo</span>
        </div>
      )}

      {/* 1. Identity & Commercial presentation */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-teal-600" />
            <span>Perfil e Identidad Comercial</span>
          </h3>
          <p className="text-xs text-[#667085]">Información básica visible para los clientes en Llévatelo</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Nombre Oficial del Comercio *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Especialidad / Tipo de Cocina
            </label>
            <input
              type="text"
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
              placeholder="Ej. Hamburguesas Artesanales & Parrilla"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Categoría Principal de Marketplace
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CategoryType)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            >
              {MARKETPLACE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Slogan / Frase Corta
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Ej. Sabor auténtico y pan recién horneado"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111827] mb-1.5">
            Descripción Detallada del Negocio
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Cuenta la historia del comercio, ingredientes estrella o política de calidad..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* 2. Contact & Location */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Contacto y Ubicación Física</span>
          </h3>
          <p className="text-xs text-[#667085]">Datos de contacto directo y despacho de pedidos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Teléfono de Contacto
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+57 318 000 0000"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              WhatsApp para Pedidos
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="+57 318 000 0000"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contacto@comercio.com"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Dirección del Establecimiento
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Ej. Cra 33 # 48-12, Local 2"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Barrio / Sector
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={e => setNeighborhood(e.target.value)}
              placeholder="Ej. Cañaveral"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>
      </div>

      {/* 3. Delivery logistics parameters */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-600" />
            <span>Condiciones de Entrega y Pedidos</span>
          </h3>
          <p className="text-xs text-[#667085]">Costos, tiempos y montos mínimos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Costo de Envío Base ($ COP)
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={deliveryFee}
              onChange={e => setDeliveryFee(Number(e.target.value))}
              placeholder="0"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600 font-bold"
            />
            <p className="text-[10px] text-[#667085] mt-1">Ingresa 0 para Envío Gratis</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Pedido Mínimo ($ COP)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={minOrder}
              onChange={e => setMinOrder(Number(e.target.value))}
              placeholder="15000"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600 font-bold"
            />
            <p className="text-[10px] text-[#667085] mt-1">Monto mínimo para habilitar el carrito</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Tiempo de Entrega Estimado
            </label>
            <input
              type="text"
              value={deliveryTime}
              onChange={e => setDeliveryTime(e.target.value)}
              placeholder="15-25 min"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
            <p className="text-[10px] text-[#667085] mt-1">Promedio visible para clientes</p>
          </div>
        </div>
      </div>

      {/* 4. Multimedia: Logo & Cover Banner Preview */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-teal-600" />
            <span>Imágenes y Portadas del Negocio (URLs con Previsualización)</span>
          </h3>
          <p className="text-xs text-[#667085]">
            Conserva el sistema rápido de URLs con renderizado instantáneo
          </p>
        </div>

        {/* Live Banner & Logo Mockup */}
        <div className="relative rounded-2xl overflow-hidden border border-[#E4E7EC] bg-slate-900 h-40 sm:h-48 shadow-xs">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Portada del negocio"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              Sin imagen de portada
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white overflow-hidden shadow-lg flex-shrink-0">
                {logo ? (
                  <img src={logo} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Logo</div>
                )}
              </div>
              <div className="text-white">
                <h4 className="text-base font-bold drop-shadow-sm">{name || 'Nombre del Comercio'}</h4>
                <p className="text-xs text-slate-200 drop-shadow-sm">{cuisine || 'Especialidad'} · {deliveryTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              URL del Logo del Comercio
            </label>
            <input
              type="url"
              value={logo}
              onChange={e => setLogo(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              URL de la Portada / Banner Superior
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D0D5DD] bg-white text-[#111827] focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>
      </div>

      {/* 5. Opening Hours by Day */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Horarios de Atención Semanal</span>
          </h3>
          <p className="text-xs text-[#667085]">
            Configura los días y franjas de atención en que el comercio recibe pedidos
          </p>
        </div>

        <div className="border border-[#E4E7EC] rounded-xl divide-y divide-[#E4E7EC] overflow-hidden">
          {schedules.map(sch => (
            <div key={sch.day} className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="w-28 font-bold text-[#111827]">
                {sch.label}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sch.isOpen}
                    onChange={e => handleUpdateScheduleDay(sch.day, 'isOpen', e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-[#D0D5DD]"
                  />
                  <span className={`font-semibold text-xs ${sch.isOpen ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {sch.isOpen ? 'Abierto' : 'Cerrado todo el día'}
                  </span>
                </label>
              </div>

              {sch.isOpen && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#667085]">Abre:</span>
                    <input
                      type="time"
                      value={sch.openTime}
                      onChange={e => handleUpdateScheduleDay(sch.day, 'openTime', e.target.value)}
                      className="px-2 py-1 text-xs border border-[#D0D5DD] rounded-lg bg-white text-[#111827] focus:outline-none"
                    />
                  </div>
                  <span className="text-[#98A2B3]">-</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#667085]">Cierra:</span>
                    <input
                      type="time"
                      value={sch.closeTime}
                      onChange={e => handleUpdateScheduleDay(sch.day, 'closeTime', e.target.value)}
                      className="px-2 py-1 text-xs border border-[#D0D5DD] rounded-lg bg-white text-[#111827] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-[#E4E7EC] shadow-md z-10">
        <button
          type="submit"
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios del Comercio</span>
        </button>
      </div>
    </form>
  );
};
