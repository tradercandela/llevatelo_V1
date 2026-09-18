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
  Sliders,
  CheckCircle,
  AlertCircle,
  Send,
  Mail,
  MessageSquare,
  RotateCcw
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
    setUserRole,
    verifyWhatsApp,
    verifyEmail,
    resetVerificationForTesting
  } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'EUR'>('COP');

  // Verification modal state
  const [verificationModalType, setVerificationModalType] = useState<'whatsapp' | 'email' | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const favoriteStores = stores.filter(s => favorites.includes(s.id));

  const handleOpenVerification = (type: 'whatsapp' | 'email') => {
    setVerificationModalType(type);
    setOtpCode('');
    setCodeSent(true);
    showToast(
      type === 'whatsapp' ? 'Código WhatsApp enviado' : 'Código de confirmación enviado',
      type === 'whatsapp' 
        ? `Se envió un PIN OTP de 6 dígitos a ${user.phone}`
        : `Se envió un enlace y código de verificación a ${user.email}`,
      'info'
    );
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationModalType) return;

    if (verificationModalType === 'whatsapp') {
      const res = verifyWhatsApp(otpCode || '123456');
      if (res.success) {
        setVerificationModalType(null);
      }
    } else {
      const res = verifyEmail(otpCode || '123456');
      if (res.success) {
        setVerificationModalType(null);
      }
    }
  };

  const handleResendCode = () => {
    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
      setCodeSent(true);
      showToast('Código reenviado', 'Hemos emitido un nuevo código de validación.', 'info');
    }, 800);
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    showToast(
      `Conectado con ${provider}`,
      `Autenticación federada simulada correctamente con ${provider} ID.`,
      'success'
    );
    setShowAuthModal(false);
  };

  const isBothVerified = user.whatsappVerified && user.emailVerified;

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

        {/* Security & Antifraud Verification Section */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isBothVerified ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#0F172A]">Estado de Seguridad Antifraude</h3>
                <p className="text-[10px] text-slate-500">
                  {isBothVerified 
                    ? 'Cuenta 100% verificada • Habilitada para pagos en efectivo' 
                    : 'Verifica ambos canales para habilitar pagos en efectivo'}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isBothVerified 
                ? 'bg-teal-100 text-teal-800 border border-teal-200' 
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {isBothVerified ? 'Verificada' : 'Incompleta'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* WhatsApp Verification Card */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              user.whatsappVerified
                ? 'border-teal-200 bg-teal-50/40'
                : 'border-amber-200/80 bg-amber-50/30'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    user.whatsappVerified ? 'bg-teal-500 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">WhatsApp</span>
                    <span className="text-[10px] text-slate-500 truncate block max-w-[130px]">{user.phone}</span>
                  </div>
                </div>

                {user.whatsappVerified ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3" /> Verificado
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenVerification('whatsapp')}
                    className="text-[10px] font-bold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Verificar OTP
                  </button>
                )}
              </div>
              {user.whatsappVerified && user.whatsappVerifiedAt && (
                <p className="text-[9px] text-teal-700/80 mt-2 font-medium">
                  Validado: {new Date(user.whatsappVerifiedAt).toLocaleDateString('es-CO')}
                </p>
              )}
            </div>

            {/* Email Verification Card */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              user.emailVerified
                ? 'border-teal-200 bg-teal-50/40'
                : 'border-amber-200/80 bg-amber-50/30'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    user.emailVerified ? 'bg-teal-500 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">Correo</span>
                    <span className="text-[10px] text-slate-500 truncate block max-w-[130px]">{user.email}</span>
                  </div>
                </div>

                {user.emailVerified ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3" /> Verificado
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenVerification('email')}
                    className="text-[10px] font-bold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Validar Email
                  </button>
                )}
              </div>
              {user.emailVerified && user.emailVerifiedAt && (
                <p className="text-[9px] text-teal-700/80 mt-2 font-medium">
                  Validado: {new Date(user.emailVerifiedAt).toLocaleDateString('es-CO')}
                </p>
              )}
            </div>
          </div>

          {/* Helper notice explaining cash on delivery unlock */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-600">
            <AlertCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0F172A]">Regla antifraude de Mandú:</span> La opción de pago en <strong>Efectivo contraentrega</strong> en checkout se desbloquea automáticamente una vez completadas ambas validaciones.
            </div>
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
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
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

        {/* Configuración Avanzada (Opciones secundarias, sandbox y prueba de verificaciones) */}
        <section className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
          <button
            onClick={() => setShowAdvancedSettings(prev => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-[#0F172A] py-1 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[#0F172A]">Configuración avanzada</span>
                <span className="text-[10px] font-normal text-slate-400">Preferencias regionales y control antifraude</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
              {showAdvancedSettings ? 'Ocultar' : 'Configurar'}
            </span>
          </button>

          {showAdvancedSettings && (
            <div className="pt-3 border-t border-slate-100 space-y-3.5">
              {/* Reset Verification Sandbox Helper */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-[#0F172A]">Resetear Verificaciones (QA Sandbox)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Permite alternar entre estado verificado y no verificado</span>
                </div>
                <button
                  onClick={resetVerificationForTesting}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Reiniciar
                </button>
              </div>

              {/* Currency selector */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      user.role === 'customer' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Consumidor
                  </button>
                  <button
                    onClick={() => setUserRole('admin')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

      {/* Verification OTP Modal (WhatsApp / Email) */}
      {verificationModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
                verificationModalType === 'whatsapp' ? 'bg-green-50 text-green-600' : 'bg-teal-50 text-teal-600'
              }`}>
                {verificationModalType === 'whatsapp' ? (
                  <MessageSquare className="w-6 h-6" />
                ) : (
                  <Mail className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {verificationModalType === 'whatsapp' ? 'Verificar WhatsApp' : 'Verificar Correo'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {verificationModalType === 'whatsapp'
                  ? `Ingresa el código OTP enviado por WhatsApp a ${user.phone}`
                  : `Ingresa el código de 6 dígitos enviado a ${user.email}`}
              </p>
            </div>

            <form onSubmit={handleSubmitVerification} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 text-center">
                  Código de Verificación (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full py-3 px-4 text-center text-xl tracking-[0.4em] font-extrabold border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-2xl outline-none"
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  (Para pruebas: cualquier código de 6 dígitos es válido)
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">¿No recibiste el código?</span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSendingCode}
                  className="font-bold text-teal-600 hover:text-teal-700 cursor-pointer disabled:opacity-50"
                >
                  {isSendingCode ? 'Reenviando...' : 'Reenviar código'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 active:scale-98 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md shadow-teal-500/20 cursor-pointer"
              >
                Confirmar y Validar
              </button>

              <button
                type="button"
                onClick={() => setVerificationModalType(null)}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

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
                className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span className="text-base font-bold text-red-500">G</span>
                <span>Continuar con Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-full py-3 px-4 bg-black hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span className="text-base"></span>
                <span>Continuar con Apple ID</span>
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
