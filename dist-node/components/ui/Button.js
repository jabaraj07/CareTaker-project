import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg border-0 transition-all',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300 shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 border border-emerald-600 shadow-sm',
};
const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm font-medium rounded-xl gap-2',
    lg: 'px-6 py-3 text-base font-semibold rounded-xl gap-2.5',
};
export const Button = forwardRef(({ variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, fullWidth = false, children, className, disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;
    return (_jsx("button", { ref: ref, disabled: isDisabled, className: cn('inline-flex items-center justify-center transition-all duration-200 select-none', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2', variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none', className), ...props, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Spinner, { size: size }), _jsx("span", { children: "Loading..." })] })) : (_jsxs(_Fragment, { children: [leftIcon && _jsx("span", { className: "flex-shrink-0", children: leftIcon }), children, rightIcon && _jsx("span", { className: "flex-shrink-0", children: rightIcon })] })) }));
});
Button.displayName = 'Button';
function Spinner({ size }) {
    const sizeMap = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
    return (_jsxs("svg", { className: cn('animate-spin', sizeMap[size]), xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }));
}
