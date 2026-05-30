"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { modalAnim } from "@/lib/animations";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionUrl?: string;
  actionLabel?: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  actionUrl,
  actionLabel,
  children,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[85dvh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-[70] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <div className="flex items-center gap-2 shrink-0">
                {actionUrl && (
                  <a
                    href={actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors min-h-[44px] flex items-center"
                  >
                    {actionLabel ?? "View project"}
                  </a>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 text-gray-700 leading-relaxed space-y-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
