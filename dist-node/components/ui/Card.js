import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn, getInitials } from '../../lib/utils';
export function Card({ children, className, padding = 'md', hover = false, ...props }) {
    const paddingMap = {
        none: '',
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
    };
    return (_jsx("div", { className: cn('bg-white rounded-2xl border border-slate-100 shadow-sm', paddingMap[padding], hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer', className), ...props, children: children }));
}
Card.Header = function CardHeader({ children, className, ...props }) {
    return (_jsx("div", { className: cn('flex items-center justify-between mb-4', className), ...props, children: children }));
};
Card.Title = function CardTitle({ children, className, ...props }) {
    return (_jsx("h3", { className: cn('text-base font-semibold text-slate-900 font-display', className), ...props, children: children }));
};
const badgeVariantMap = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
};
const dotVariantMap = {
    default: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    amber: 'bg-amber-500',
};
export function Badge({ variant = 'default', dot = false, children, className, ...props }) {
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', badgeVariantMap[variant], className), ...props, children: [dot && (_jsx("span", { className: cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotVariantMap[variant]) })), children] }));
}
export function Avatar({ name, size = 'md', className }) {
    const sizeMap = {
        sm: 'w-7 h-7 text-xs',
        md: 'w-9 h-9 text-sm',
        lg: 'w-12 h-12 text-base',
    };
    return (_jsx("div", { className: cn('rounded-full bg-gradient-to-br from-navy-600 to-amber-500 flex items-center justify-center font-semibold text-white flex-shrink-0', sizeMap[size], className), children: getInitials(name) }));
}
export function Divider({ className }) {
    return _jsx("hr", { className: cn('border-slate-100', className) });
}
export function EmptyState({ icon, title, description, action }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4", children: icon }), _jsx("h3", { className: "text-sm font-semibold text-slate-700 mb-1", children: title }), description && (_jsx("p", { className: "text-xs text-slate-500 max-w-xs mb-4", children: description })), action && _jsx("div", { children: action })] }));
}
export function ProgressBar({ value, className, color = 'emerald' }) {
    const colorMap = {
        amber: 'bg-amber-400',
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
    };
    return (_jsx("div", { className: cn('h-2 w-full rounded-full bg-slate-100 overflow-hidden', className), children: _jsx("div", { className: cn('h-full rounded-full transition-all duration-700 ease-out', colorMap[color]), style: { width: `${Math.min(100, Math.max(0, value))}%` } }) }));
}
export function Skeleton({ className }) {
    return (_jsx("div", { className: cn('animate-pulse rounded-lg bg-slate-100', className) }));
}
export function MedicationCardSkeleton() {
    return (_jsx(Card, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { className: "w-10 h-10 rounded-xl" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-32" }), _jsx(Skeleton, { className: "h-3 w-20" })] })] }), _jsx(Skeleton, { className: "h-8 w-24 rounded-xl" })] }) }));
}
