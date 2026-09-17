import React, { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  ChevronDown, 
  ShoppingCart, 
  Search, 
  SlidersHorizontal,
  Bell,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenAddressModal: () => void;
  showSearchBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAddressModal, 
  showSearchBar = true 
}) => {
  const { 
    selectedAddress, 
    cartItemCount, 
    setIsCartDrawerOpen, 
    searchQuery, 
    setSearchQuery, 
    setCurrentView,
    isMobileFrameMode,
    setIsMobileFrameMode,
    notifications,
    markNotificationsAsRead
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 sm:px-4 pt-safe pb-3 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all w-full">
      {/* Top Row: Brand Logo, Location Selector, Frame Toggle, Cart */}
      <div className="flex items-center justify-between h-14 max-w-7xl mx-auto gap-2 w-full min-w-0">
        {/* Brand Logo */}
        <button 
          id="header-brand-logo-btn"
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold text-[#0F172A] tracking-tight leading-none">MANDÚ</span>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            </div>
          </div>
        </button>

        {/* Center/Right Items Container */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 justify-end">
          {/* Address Dropdown */}
          <button 
            id="header-address-select-btn"
            onClick={onOpenAddressModal}
            className="flex flex-col items-end text-right px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-50 active:scale-95 transition-all min-w-0 max-w-[120px] xs:max-w-[145px] sm:max-w-[200px]"
          >
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
              Entregar en
            </span>
            <div className="flex items-center gap-1 max-w-full">
              <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                {selectedAddress.area || selectedAddress.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            </div>
          </button>

          {/* Frame Toggle (Desktop / Mobile Preview) */}
          <button
            id="header-frame-toggle-btn"
            onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
            title={isMobileFrameMode ? 'Cambiar a modo fluido completo' : 'Cambiar a vista marco móvil PWA'}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex-shrink-0"
          >
            {isMobileFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-teal-600" />
                <span>Vista Web</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                <span>Vista Móvil</span>
              </>
            )}
          </button>

          {/* Action icons group: strictly flex-shrink-0 so they never get squished or pushed out */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Notifications Button */}
            <div className="relative flex-shrink-0">
              <button
                id="header-notifications-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (unreadNotifs > 0) markNotificationsAsRead();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors relative active:scale-95 flex-shrink-0"
                aria-label="Notificaciones"
              >
                <Bell className="w-4 h-4 text-[#0F172A]" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-sm font-bold text-[#0F172A]">Notificaciones</span>
                      <span className="text-[10px] text-teal-600 font-semibold">En tiempo real</span>
                    </div>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2 rounded-xl bg-slate-50 text-xs">
                          <p className="font-bold text-[#0F172A]">{n.title}</p>
                          <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Icon Button with Count */}
            <button 
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 text-[#0F172A]" />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-teal-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Input (Search & Filter) */}
      {showSearchBar && (
        <div className="mt-2.5 max-w-7xl mx-auto relative flex items-center gap-2 w-full min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 0) setCurrentView('search');
              }}
              onFocus={() => {
                if (searchQuery.length > 0) setCurrentView('search');
              }}
              placeholder="¿Qué te apetece hoy? Donas, pizza, plomería..."
              className="w-full h-11 pl-10 sm:pl-11 pr-4 rounded-full bg-slate-50 border-0 ring-1 ring-inset ring-slate-200 text-sm text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-all shadow-sm"
            />
          </div>
          <button
            id="header-filter-btn"
            onClick={() => setCurrentView('search')}
            className="h-11 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center transition-colors active:scale-95 flex-shrink-0"
            title="Filtros avanzados"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}
    </header>
  );
};
