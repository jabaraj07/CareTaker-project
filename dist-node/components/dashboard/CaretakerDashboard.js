import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useMedications } from '../../hooks/useMedications';
import { useMedicationLogs } from '../../hooks/useMedicationLogs';
import { computeMedicationsWithStatus, computeDailyProgress } from '../../lib/utils';
import { MedicationList } from '../medications/MedicationList';
import { Card, Badge, ProgressBar } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store';
function NotificationInfoCard({ profile }) {
    const hasCaretakerEmail = !!profile?.caretaker_email;
    return (_jsx(Card, { className: hasCaretakerEmail
            ? 'border-emerald-100 bg-emerald-50/40'
            : 'border-amber-100 bg-amber-50/40', children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${hasCaretakerEmail ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`, children: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: "Email notifications" }), hasCaretakerEmail ? (_jsxs("p", { className: "text-xs text-slate-500 mt-0.5 truncate", children: ["Alerts sent to:", ' ', _jsx("span", { className: "font-medium text-slate-700", children: profile.caretaker_email })] })) : (_jsx("p", { className: "text-xs text-amber-700 mt-0.5", children: "No caretaker email set. Update in Settings to enable alerts." }))] }), _jsx(Badge, { variant: hasCaretakerEmail ? 'success' : 'warning', dot: true, children: hasCaretakerEmail ? 'Active' : 'Setup needed' })] }) }));
}
export function CaretakerDashboard({ userId, profile }) {
    const { medications } = useMedications(userId);
    const { logs } = useMedicationLogs(userId);
    const { openModal } = useUIStore();
    const medicationsWithStatus = useMemo(() => computeMedicationsWithStatus(medications, logs), [medications, logs]);
    const progress = useMemo(() => computeDailyProgress(medicationsWithStatus), [medicationsWithStatus]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900 font-display", children: "Manage medications" }), _jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: "Add and track the patient's daily medications" })] }), _jsx(Button, { size: "sm", onClick: () => openModal('add-medication'), leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), children: "Add medication" })] }), _jsx(NotificationInfoCard, { profile: profile }), progress.total > 0 && (_jsxs(Card, { children: [_jsxs(Card.Header, { children: [_jsx(Card.Title, { children: "Today's overview" }), _jsx(Badge, { variant: progress.taken === progress.total ? 'success' : 'warning', dot: true, children: progress.taken === progress.total ? 'All taken' : `${progress.pending} pending` })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between text-xs text-slate-500 mb-1", children: [_jsxs("span", { children: [progress.taken, " of ", progress.total, " taken"] }), _jsxs("span", { className: "font-semibold text-slate-700", children: [progress.percentage, "%"] })] }), _jsx(ProgressBar, { value: progress.percentage, color: "emerald" }), _jsx("div", { className: "grid grid-cols-3 gap-2 pt-1", children: [
                                    {
                                        label: 'Taken',
                                        count: progress.taken,
                                        color: 'text-emerald-600',
                                        bg: 'bg-emerald-50',
                                    },
                                    {
                                        label: 'Pending',
                                        count: progress.pending,
                                        color: 'text-amber-600',
                                        bg: 'bg-amber-50',
                                    },
                                    {
                                        label: 'Missed',
                                        count: progress.missed,
                                        color: 'text-red-500',
                                        bg: 'bg-red-50',
                                    },
                                ].map(({ label, count, color, bg }) => (_jsxs("div", { className: `${bg} rounded-xl p-3 text-center`, children: [_jsx("p", { className: `text-xl font-bold font-display ${color}`, children: count }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: label })] }, label))) })] })] })), _jsxs("div", { children: [_jsx("h2", { className: "text-base font-semibold text-slate-900 font-display mb-3", children: "Medication list" }), _jsx(MedicationList, { userId: userId, mode: "caretaker" })] })] }));
}
