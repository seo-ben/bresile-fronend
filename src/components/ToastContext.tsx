import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', durationMs = 4500) => {
      if (!message) return;
      const id = Date.now() + Math.floor(Math.random() * 10000);
      setToasts((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, durationMs);
    },
    []
  );

  const success = useCallback(
    (message: string, durationMs?: number) => showToast(message, 'success', durationMs),
    [showToast]
  );

  const error = useCallback(
    (message: string, durationMs?: number) => showToast(message, 'error', durationMs),
    [showToast]
  );

  const info = useCallback(
    (message: string, durationMs?: number) => showToast(message, 'info', durationMs),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* Global floating toast container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxWidth: '400px',
          width: 'calc(100vw - 2.5rem)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          const accentColor = isSuccess ? '#059669' : isError ? '#dc2626' : '#2563eb';
          const bgColor = isSuccess ? '#ecfdf5' : isError ? '#fef2f2' : '#eff6ff';
          const borderColor = isSuccess ? '#a7f3d0' : isError ? '#fecaca' : '#bfdbfe';
          const textColor = isSuccess ? '#065f46' : isError ? '#991b1b' : '#1e40af';

          return (
            <div
              key={toast.id}
              role="status"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.7rem',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                color: textColor,
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.14)',
                fontSize: '0.875rem',
                fontWeight: 600,
                lineHeight: 1.4,
                animation: 'toastSlideIn 0.22s ease-out',
              }}
            >
              <span style={{ flexShrink: 0, marginTop: '1px', color: accentColor }}>
                {isSuccess ? (
                  <CheckCircle2 size={18} />
                ) : isError ? (
                  <AlertCircle size={18} />
                ) : (
                  <Info size={18} />
                )}
              </span>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Fermer"
                style={{
                  flexShrink: 0,
                  background: 'transparent',
                  border: 'none',
                  color: textColor,
                  opacity: 0.7,
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
