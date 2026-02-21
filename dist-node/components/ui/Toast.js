import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUIStore } from '../../store';
import { cn } from '../../lib/utils';
// ─── Toast Icons ──────────────────────────────────────────────────────────────
function ToastIcon({ type }) {
    if (type === 'success') {
        return (_jsx("div", { className: "w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-4 h-4 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }) }) }));
    }
    if (type === 'error') {
        return (_jsx("div", { className: "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-4 h-4 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) }) }));
    }
    if (type === 'warning') {
        return (_jsx("div", { className: "w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-4 h-4 text-amber-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }));
    }
    return (_jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0", children: _jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }));
}
// ─── Single Toast ─────────────────────────────────────────────────────────────
function ToastItem({ toast }) {
    const { removeToast } = useUIStore();
    const borderMap = {
        success: 'border-l-emerald-400',
        error: 'border-l-red-400',
        warning: 'border-l-amber-400',
        info: 'border-l-blue-400',
    };
    return (_jsxs("div", { className: cn('flex items-start gap-3 bg-white rounded-2xl shadow-lg border border-slate-100 border-l-4 p-4', 'w-80 animate-slide-in-right transition-all duration-300', borderMap[toast.type]), role: "alert", children: [_jsx(ToastIcon, { type: toast.type }), _jsxs("div", { className: "flex-1 min-w-0 pt-0.5", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: toast.title }), toast.message && (_jsx("p", { className: "text-xs text-slate-500 mt-0.5 leading-relaxed", children: toast.message }))] }), _jsx("button", { onClick: () => removeToast(toast.id), className: "flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors", "aria-label": "Dismiss", children: _jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }));
}
// ─── Toast Container ──────────────────────────────────────────────────────────
export function ToastContainer() {
    const { toasts } = useUIStore();
    return (_jsx("div", { className: "fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end", "aria-live": "polite", "aria-atomic": "false", children: toasts.map((toast) => (_jsx(ToastItem, { toast: toast }, toast.id))) }));
}
