import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Heart, 
  Sparkles, 
  Shield, 
  LogOut, 
  Globe, 
  Coins, 
  ChevronRight, 
  ShieldCheck, 
  Lock,
  Smartphone,
  HelpCircle,
  Share2,
  Sliders
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';

export const ProfileView: React.FC = () => {
  const { 
    user, 
    addresses, 
    favorites, 
    stores, 
    setCurrentView, 
    setSelectedStoreId, 
    showToast,
    isAdmin,
    setUserRole 
  } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'EUR'>('COP');

  const favoriteStores = stores.filter(s => favorites.includes(s.id));

  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    showToast(
      `Conectado con ${provider}`,
      `Autenticación federada simulada correctamente con ${provider} ID.`,
      'success'
    );
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-extrabold text-[#0F172A]">Mi Perfil</h1>
        {isAdmin && (
          <button
            onClick={() => setCurrentView('admin')}
            className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Panel Admin</span>
          </button>
        )}
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-4">
        {/* User Card */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0F172A] truncate">{user.name}</h2>
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> PRIME
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>
          </div>
        </section>

        {/* Prime Membership Card - Inverted hierarchy focusing on concrete quantified benefit */}
        <section className="bg-gradient-to-r from-slate-900 to-[#0F172A] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-start gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-teal-300/80 uppercase tracking-wider block">
                MANDÚ Prime Activo • Beneficio Exclusivo
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                Envíos gratis ilimitados{' '}
                <span className="text-teal-300 font-black">en pedidos &gt; $20.000</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 pt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>Incluye atención y soporte prioritario VIP 24/7</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Favorite Stores */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            Mis Comercios Favoritos ({favoriteStores.length})
          </h3>

          <div className="space-y-2">
            {favoriteStores.map(store => (
              <div
                key={store.id}
                onClick={() => {
                  setSelectedStoreId(store.id);
                  setCurrentView('store-detail');
                }}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={store.logo} alt={store.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{store.name}</h4>
                    <p className="text-[11px] text-slate-500">{store.cuisine} • ★ {store.rating}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </section>

        {/* Settings & Links */}
        <section className="bg-white rounded-3xl p-2 border border-slate-100 shadow-sm divide-y divide-slate-100 text-xs font-bold text-slate-700">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[#0F172A]">Cuentas Vinculadas (Google / Apple)</span>
                <span className="text-[10px] font-normal text-slate-500">Configurar acceso OAuth seguro</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </section>

        {/* Configuración Avanzada (Opciones secundarias y sandbox de roles) */}
        <section className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
          <button
            onClick={() => setShowAdvancedSettings(prev => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-[#0F172A] py-1"
          >
            <div className="flex items-center gap-2.5 text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[#0F172A]">Configuración avanzada</span>
                <span className="text-[10px] font-normal text-slate-400">Preferencias regionales y control de acceso</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
              {showAdvancedSettings ? 'Ocultar' : 'Configurar'}
            </span>
          </button>

          {showAdvancedSettings && (
            <div className="pt-3 border-t border-slate-100 space-y-3.5">
              {/* Currency selector moved here */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-[#0F172A]">Moneda de visualización</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Mercado activo: Colombia (COP)</span>
                </div>
                <div className="flex gap-1">
                  {(['COP', 'USD', 'EUR'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        currency === c ? 'bg-teal-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Toggle for testing role separation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-[#0F172A]">Rol de la Cuenta</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {isAdmin ? 'Privilegios de Administrador / Comercio' : 'Modo estándar de Consumidor (sin acceso admin)'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setUserRole('customer')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      user.role === 'customer' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Consumidor
                  </button>
                  <button
                    onClick={() => setUserRole('admin')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      user.role === 'admin' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Social Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Autenticación Segura</h3>
              <p className="text-xs text-slate-500 mt-1">Conecta tu cuenta para sincronizar tus pedidos y favoritos en todos tus dispositivos.</p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span className="text-base font-bold text-red-500">G</span>
                <span>Continuar con Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-full py-3 px-4 bg-black hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span className="text-base"></span>
                <span>Continuar con Apple ID</span>
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
