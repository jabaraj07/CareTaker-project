import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
export function Modal({ isOpen, onClose, title, description, children, size = 'md', footer, }) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const sizeMap = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in", onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", className: cn('relative z-10 w-full bg-white rounded-2xl shadow-2xl', 'border border-slate-100 animate-slide-up', sizeMap[size]), children: [_jsxs("div", { className: "flex items-start justify-between p-6 pb-4", children: [_jsxs("div", { children: [_jsx("h2", { id: "modal-title", className: "text-lg font-semibold text-slate-900 font-display", children: title }), description && (_jsx("p", { className: "text-sm text-slate-500 mt-1", children: description }))] }), _jsx("button", { onClick: onClose, className: "ml-4 flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors", "aria-label": "Close modal", children: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "px-6 pb-4", children: children }), footer && (_jsx("div", { className: "px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 rounded-b-2xl", children: footer }))] })] }));
}
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', isLoading = false, }) {
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: title, size: "sm", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: onClose, disabled: isLoading, children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: onConfirm, isLoading: isLoading, children: confirmLabel })] }), children: _jsx("p", { className: "text-sm text-slate-600", children: message }) }));
}
