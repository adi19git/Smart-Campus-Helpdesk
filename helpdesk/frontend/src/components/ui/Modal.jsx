import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]`}
          >
            {/* Drag handle — mobile only */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-600" />
            </div>
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex-shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                  {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {/* Body */}
            <div className="px-5 sm:px-6 py-5 overflow-y-auto custom-scrollbar flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
