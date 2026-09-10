import React from 'react';
import { Home, Search, ReceiptText, User, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp, AppView } from '../../store/useAppStore';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, orders } = useApp();

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const navItems: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'orders', label: 'Pedidos', icon: ReceiptText },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] pb-safe transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'orders' && currentView === 'order-tracking');

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all active:scale-95 ${
                isActive
                  ? 'bg-teal-500 text-white font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-[#0F172A]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className={`text-[11px] mt-1 ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>

              {/* Active Orders notification indicator */}
              {item.id === 'orders' && activeOrdersCount > 0 && !isActive && (
                <span className="absolute top-1 right-3 w-2 h-2 bg-teal-500 rounded-full animate-ping"></span>
              )}
            </button>
          );
        })}

        {/* Quick button to view Operations & Admin panel */}
        <button
          onClick={() => setCurrentView('admin')}
          title="Consola de Control y Operaciones"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all active:scale-95 ${
            currentView === 'admin'
              ? 'bg-slate-900 text-teal-400 font-bold shadow-md'
              : 'text-slate-400 hover:text-teal-600'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold">Admin</span>
        </button>
      </div>
    </nav>
  );
};
