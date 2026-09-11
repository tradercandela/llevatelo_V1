import { Store, StoreScheduleDay, AuditLogItem } from '../../types';

export const DEFAULT_WEEK_SCHEDULE: StoreScheduleDay[] = [
  { day: 'monday', label: 'Lunes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'tuesday', label: 'Martes', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'wednesday', label: 'Miércoles', isOpen: true, openTime: '10:00', closeTime: '22:00' },
  { day: 'thursday', label: 'Jueves', isOpen: true, openTime: '10:00', closeTime: '22:30' },
  { day: 'friday', label: 'Viernes', isOpen: true, openTime: '10:00', closeTime: '23:30' },
  { day: 'saturday', label: 'Sábado', isOpen: true, openTime: '10:00', closeTime: '23:30' },
  { day: 'sunday', label: 'Domingo', isOpen: true, openTime: '11:00', closeTime: '21:30' }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    storeName: 'Donas & Café Cañaveral',
    user: 'Julián Candela (Admin)',
    action: 'Actualización de Catálogo',
    details: 'Se actualizó precio de "Dona de Arequipe" a $15.000',
    timestamp: 'Hoy, 16:42'
  },
  {
    id: 'log-2',
    storeName: 'Pizzería La 27',
    user: 'Operaciones Llévatelo',
    action: 'Cambio de Estado',
    details: 'Negocio activado y marcado como ABIERTO para despacho',
    timestamp: 'Hoy, 15:18'
  },
  {
    id: 'log-3',
    storeName: 'Donas & Café Cañaveral',
    user: 'Julián Candela (Admin)',
    action: 'Creación de Producto',
    details: 'Añadido nuevo combo "Combo Merienda Dulce"',
    timestamp: 'Ayer, 18:30'
  }
];

export const STATUS_EXPLANATIONS = {
  open: {
    title: 'ABIERTO',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    description: 'Tu negocio está abierto y visible para todos los clientes en Llévatelo. Los pedidos ingresan de inmediato.',
    alertClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
  },
  closed: {
    title: 'CERRADO',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    description: 'El negocio está cerrado fuera de horario. Los clientes verán la tienda pero no podrán realizar pedidos ahora.',
    alertClass: 'bg-slate-50 border-slate-200 text-slate-800'
  },
  paused: {
    title: 'PAUSADO TEMPORALMENTE',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    description: 'Tu negocio está pausado temporalmente (cocina saturada o pausa de turno). Los clientes verán aviso de pausa y no podrán ordenar.',
    alertClass: 'bg-amber-50/90 border-amber-200 text-amber-900'
  },
  unavailable: {
    title: 'NO DISPONIBLE',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
    description: 'El negocio está oculto en el marketplace. No es visible para clientes hasta que sea activado nuevamente.',
    alertClass: 'bg-red-50/90 border-red-200 text-red-900'
  }
};
