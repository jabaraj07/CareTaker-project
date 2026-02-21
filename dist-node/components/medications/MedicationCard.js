import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, memo } from 'react';
import { cn, formatTime, getFrequencyLabel } from '../../lib/utils';
import { Badge } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/Modal';
import { useMedications } from '../../hooks/useMedications';
import { useUIStore } from '../../store';
const statusConfig = {
    taken: {
        badge: 'success',
        label: 'Taken today',
        icon: (_jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }) })),
    },
    missed: {
        badge: 'danger',
        label: 'Missed',
        icon: (_jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) })),
    },
    pending: {
        badge: 'warning',
        label: 'Pending',
        icon: (_jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) })),
    },
};
function PillIcon({ taken }) {
    return (_jsx("div", { className: cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300', taken
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-slate-100 text-slate-400'), children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" }) }) }));
}
export const MedicationCard = memo(function MedicationCard({ medication, userId, showActions = false, onMarkTaken, isMarkingTaken = false, }) {
    const { deleteMedication } = useMedications(userId);
    const { openModal } = useUIStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const status = medication.todayStatus;
    const isTaken = status === 'taken';
    const config = status ? statusConfig[status] : null;
    const handleDelete = async () => {
        await deleteMedication.mutateAsync(medication.id);
        setShowDeleteConfirm(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: cn('bg-white rounded-2xl border p-4 transition-all duration-300', isTaken
                    ? 'border-emerald-100 bg-emerald-50/30'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'), children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(PillIcon, { taken: isTaken }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: cn('text-sm font-semibold truncate font-display transition-colors', isTaken ? 'text-emerald-800' : 'text-slate-900'), children: medication.name }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: medication.dosage })] }), config && (_jsx(Badge, { variant: config.badge, dot: true, className: "flex-shrink-0", children: config.label }))] }), _jsxs("div", { className: "flex items-center gap-3 mt-2", children: [_jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-slate-500", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), getFrequencyLabel(medication.frequency)] }), medication.reminder_time && (_jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-slate-500", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), formatTime(medication.reminder_time)] }))] }), _jsxs("div", { className: "flex items-center gap-2 mt-3", children: [onMarkTaken && (_jsx(Button, { variant: isTaken ? 'ghost' : 'success', size: "sm", onClick: () => !isTaken && onMarkTaken(medication.id), isLoading: isMarkingTaken, disabled: isTaken, leftIcon: isTaken ? (_jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }) })) : undefined, children: isTaken ? 'Taken' : 'Mark as taken' })), showActions && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => openModal('edit-medication', medication), className: "p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors", "aria-label": `Edit ${medication.name}`, children: _jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), _jsx("button", { onClick: () => setShowDeleteConfirm(true), className: "p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors", "aria-label": `Delete ${medication.name}`, children: _jsx("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] }))] })] })] }) }), _jsx(ConfirmModal, { isOpen: showDeleteConfirm, onClose: () => setShowDeleteConfirm(false), onConfirm: handleDelete, title: "Remove medication", message: `Are you sure you want to remove "${medication.name}" from the medication list? This action cannot be undone.`, confirmLabel: "Remove", isLoading: deleteMedication.isPending })] }));
});
