/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './store/useAppStore';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FloatingCartPill } from './components/common/FloatingCartPill';
import { AddressModal } from './components/common/AddressModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ProductDetailModal } from './components/common/ProductDetailModal';
import { QuickServiceModal } from './components/common/QuickServiceModal';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomeView } from './components/home/HomeView';
import { StoreDetailView } from './components/store/StoreDetailView';
import { SearchView } from './components/search/SearchView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import { OrdersHistoryView } from './components/orders/OrdersHistoryView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    selectedProductForModal, 
    setSelectedProductForModal, 
    selectedStoreId, 
    stores,
    quickServiceModal,
    setQuickServiceModal,
    isMobileFrameMode
  } = useApp();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const activeStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  const renderMainView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="min-h-screen bg-[#F8FAFC]">
            <Header onOpenAddressModal={() => setIsAddressModalOpen(true)} />
            <main className="max-w-7xl mx-auto px-4 pt-3">
              <HomeView />
            </main>
            <FloatingCartPill />
            <BottomNav />
          </div>
        );

      case 'store-detail':
        return (
          <div className="min-h-screen bg-[#F8FAFC]">
            <StoreDetailView />
            <FloatingCartPill />
            <BottomNav />
          </div>
        );

      case 'search':
        return (
          <div className="min-h-screen bg-[#F8FAFC]">
            <SearchView />
            <FloatingCartPill />
            <BottomNav />
          </div>
        );

      case 'checkout':
        return <CheckoutView />;

      case 'order-tracking':
        return (
          <div className="min-h-screen bg-[#F8FAFC]">
            <OrderTrackingView />
            <BottomNav />
          </div>
        );

      case 'orders':
        return (
          <div className="min-h-screen bg-[#F8FAFC]">
            <OrdersHistoryView />
            <BottomNav />
          </div>
        );

      case 'profile':
        return (
          <div className="min-h-screen bg-[#F8FAFC]">
            <ProfileView />
            <BottomNav />
          </div>
        );

      case 'admin':
        return <AdminDashboard />;

      default:
        return null;
    }
  };

  const appView = (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-teal-500 selection:text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {renderMainView()}
        </motion.div>
      </AnimatePresence>

      {/* Global Modals & Drawers */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      <ProductDetailModal
        product={selectedProductForModal}
        store={activeStore}
        onClose={() => setSelectedProductForModal(null)}
      />

      <QuickServiceModal
        service={quickServiceModal}
        onClose={() => setQuickServiceModal(null)}
      />

      <CartDrawer />
      <ToastContainer />
    </div>
  );

  // If in Mobile Device Frame Mode on Desktop
  if (isMobileFrameMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="mb-3 text-center">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
            Modo Simulador Móvil PWA
          </span>
          <p className="text-[11px] text-slate-400">
            Diseño fiel con proporciones de iPhone 15 Pro
          </p>
        </div>

        {/* Smartphone Shell Frame */}
        <div className="w-full max-w-[414px] h-[850px] max-h-[92vh] bg-black rounded-[50px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 relative flex flex-col overflow-hidden">
          {/* Dynamic Island Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
            <div className="w-2 h-2 rounded-full bg-teal-500/80 animate-pulse"></div>
          </div>

          {/* Inner Screen */}
          <div className="w-full h-full rounded-[40px] overflow-y-auto no-scrollbar relative bg-[#F8FAFC]">
            {appView}
          </div>
        </div>
      </div>
    );
  }

  return appView;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
