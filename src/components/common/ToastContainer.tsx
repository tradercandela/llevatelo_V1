import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => {
          let Icon = CheckCircle2;
          let colorClass = 'bg-teal-900/90 text-white border-teal-500/30';
          let iconColor = 'text-teal-400';

          if (t.type === 'warning') {
            Icon = AlertCircle;
            colorClass = 'bg-amber-900/90 text-white border-amber-500/30';
            iconColor = 'text-amber-400';
          } else if (t.type === 'info') {
            Icon = Info;
            colorClass = 'bg-slate-900/90 text-white border-slate-700';
            iconColor = 'text-blue-400';
          }

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 ${colorClass}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold leading-tight">{t.title}</p>
                {t.message && (
                  <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
