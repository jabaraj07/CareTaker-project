import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
export const Input = forwardRef(({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;
    return (_jsxs("div", { className: "w-full space-y-1.5", children: [label && (_jsxs("label", { htmlFor: inputId, className: "block text-sm font-medium text-slate-700", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("div", { className: "relative", children: [leftIcon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none", children: leftIcon })), _jsx("input", { ref: ref, id: inputId, className: cn('w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900', 'placeholder:text-slate-400 transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50', error
                            ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                            : 'border-slate-300 hover:border-slate-400', leftIcon && 'pl-10', rightIcon && 'pr-10', className), ...props }), rightIcon && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400", children: rightIcon }))] }), error && (_jsxs("p", { className: "text-xs text-red-600 flex items-center gap-1", children: [_jsx("svg", { className: "w-3.5 h-3.5 flex-shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), error] })), hint && !error && (_jsx("p", { className: "text-xs text-slate-500", children: hint }))] }));
});
Input.displayName = 'Input';
export const Select = forwardRef(({ label, error, hint, options, className, id, ...props }, ref) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;
    return (_jsxs("div", { className: "w-full space-y-1.5", children: [label && (_jsxs("label", { htmlFor: selectId, className: "block text-sm font-medium text-slate-700", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsx("select", { ref: ref, id: selectId, className: cn('w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900', 'transition-all duration-200 appearance-none cursor-pointer', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', 'disabled:opacity-50 disabled:cursor-not-allowed', error
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-300 hover:border-slate-400', className), ...props, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), error && (_jsx("p", { className: "text-xs text-red-600", children: error })), hint && !error && (_jsx("p", { className: "text-xs text-slate-500", children: hint }))] }));
});
Select.displayName = 'Select';
