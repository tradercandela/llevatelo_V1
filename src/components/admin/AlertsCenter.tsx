import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Image as ImageIcon, DollarSign, Clock, Store as StoreIcon, ArrowRight } from 'lucide-react';
import { Store, Product } from '../../types';

interface AlertsCenterProps {
  stores: Store[];
  products: Product[];
  onSelectStore: (storeId: string) => void;
  onFilterOutOfStock: () => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  stores,
  products,
  onSelectStore,
  onFilterOutOfStock
}) => {
  // Compute health metrics
  const outOfStockProducts = products.filter(p => !p.isAvailable);
  const productsWithoutImage = products.filter(p => !p.image || p.image.trim() === '');
  const productsWithoutPrice = products.filter(p => !p.price || p.price <= 0);
  const pausedOrClosedStores = stores.filter(s => !s.isOpen || s.statusMode === 'paused' || s.statusMode === 'unavailable');
  const storesWithoutPhone = stores.filter(s => !s.phone || s.phone.trim() === '');

  const totalAlerts = 
    outOfStockProducts.length + 
    productsWithoutImage.length + 
    productsWithoutPrice.length + 
    (storesWithoutPhone.length > 0 ? 1 : 0);

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#111827]">Centro de Diagnóstico y Alertas</h3>
            <p className="text-xs text-[#667085]">Atención requerida para optimizar la conversión del marketplace</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          totalAlerts > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {totalAlerts > 0 ? `${totalAlerts} Alertas activas` : 'Todo en orden (0 alertas)'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Out of stock alert */}
        <div 
          onClick={onFilterOutOfStock}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            outOfStockProducts.length > 0 
              ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300' 
              : 'bg-[#F9FAFB] border-[#E4E7EC]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#111827]">Productos Agotados</span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
              outOfStockProducts.length > 0 ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
            }`}>
              {outOfStockProducts.length}
            </span>
          </div>
          <p className="text-[11px] text-[#667085] line-clamp-1">
            {outOfStockProducts.length > 0 ? 'Pausados para clientes' : 'Catálogo 100% disponible'}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-700 mt-2">
            <span>Revisar inventario</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Missing image alert */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          productsWithoutImage.length > 0 
            ? 'bg-red-50/60 border-red-200' 
            : 'bg-[#F9FAFB] border-[#E4E7EC]'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#111827]">Sin Fotografía</span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
              productsWithoutImage.length > 0 ? 'bg-red-200 text-red-900' : 'bg-slate-200 text-slate-700'
            }`}>
              {productsWithoutImage.length}
            </span>
          </div>
          <p className="text-[11px] text-[#667085] line-clamp-1">
            {productsWithoutImage.length > 0 ? 'Afecta la conversión de venta' : 'Todas tienen imagen'}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 mt-2">
            <span>{productsWithoutImage.length > 0 ? 'Agregar enlaces de imagen' : 'Verificado'}</span>
          </div>
        </div>

        {/* Stores closed / paused */}
        <div className="p-3.5 rounded-xl border bg-[#F9FAFB] border-[#E4E7EC]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#111827]">Comercios Cerrados/Pausados</span>
            <span className="font-bold px-1.5 py-0.5 rounded text-[11px] bg-slate-200 text-slate-700">
              {pausedOrClosedStores.length} de {stores.length}
            </span>
          </div>
          <p className="text-[11px] text-[#667085] line-clamp-1">
            {pausedOrClosedStores.length > 0 ? 'Pueden reanudarse con 1 clic' : 'Todos en despacho activo'}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-teal-700 mt-2">
            <span>Ver listado de negocios</span>
          </div>
        </div>

        {/* Quality status */}
        <div className="p-3.5 rounded-xl border bg-emerald-50/40 border-emerald-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-emerald-950">Nivel de Completitud</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[11px] text-emerald-800">
            {products.length} productos registrados en {stores.length} comercios
          </p>
          <div className="w-full bg-emerald-200/80 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
