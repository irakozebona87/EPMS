import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

const toastStyles = {
  success: 'border-emerald-100 bg-emerald-50 text-emerald-800',
  error: 'border-rose-100 bg-rose-50 text-rose-800',
  info: 'border-indigo-100 bg-indigo-50 text-indigo-800',
}

const iconStyles = {
  success: 'bg-emerald-100 text-emerald-600',
  error: 'bg-rose-100 text-rose-600',
  info: 'bg-indigo-100 text-indigo-600',
}

function ToastIcon({ type }) {
  if (type === 'error') {
    return (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.01M4.93 19.07a10 10 0 1114.14 0 10 10 0 01-14.14 0z" />
      </svg>
    )
  }

  return (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    const id = crypto.randomUUID()
    const toastType = toastStyles[type] ? type : 'info'

    setToasts((current) => [...current, { id, message, type: toastType }])
    window.setTimeout(() => removeToast(id), 3500)
  }, [removeToast])

  const value = useMemo(() => ({
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info'),
  }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 pointer-events-none sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-md ${toastStyles[toast.type]}`}
            role="status"
          >
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconStyles[toast.type]}`}>
              <ToastIcon type={toast.type} />
            </span>
            <p className="min-w-0 flex-1 text-sm font-bold leading-5">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1 text-current opacity-60 transition hover:bg-white/60 hover:opacity-100"
              aria-label="Close notification"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return context
}
