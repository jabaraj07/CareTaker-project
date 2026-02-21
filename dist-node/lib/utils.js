import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
// ─── Class Names Utility ──────────────────────────────────────────────────────
export function cn(...inputs) {
    return clsx(inputs);
}
// ─── Date Utilities ───────────────────────────────────────────────────────────
export function getTodayDateString() {
    return format(new Date(), 'yyyy-MM-dd');
}
export function formatDisplayDate(dateString) {
    return format(parseISO(dateString), 'MMMM d, yyyy');
}
export function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return format(date, 'h:mm a');
}
export function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12)
        return 'Good morning';
    if (hour < 17)
        return 'Good afternoon';
    return 'Good evening';
}
// ─── Medication Utilities ─────────────────────────────────────────────────────
export function getMedicationStatus(medicationId, logs) {
    const log = logs.find((l) => l.medication_id === medicationId);
    return log?.status ?? null;
}
export function computeMedicationsWithStatus(medications, logs) {
    return medications.map((med) => {
        const log = logs.find((l) => l.medication_id === med.id);
        return {
            ...med,
            todayStatus: log?.status ?? null,
            logId: log?.id,
        };
    });
}
export function computeDailyProgress(medications) {
    const total = medications.length;
    const taken = medications.filter((m) => m.todayStatus === 'taken').length;
    const missed = medications.filter((m) => m.todayStatus === 'missed').length;
    const pending = total - taken - missed;
    const percentage = total === 0 ? 0 : Math.round((taken / total) * 100);
    return { total, taken, missed, pending, percentage };
}
export function getFrequencyLabel(frequency) {
    const labels = {
        daily: 'Once daily',
        twice_daily: 'Twice daily',
        three_times_daily: 'Three times daily',
        weekly: 'Weekly',
    };
    return labels[frequency] ?? frequency;
}
export function getStatusColor(status) {
    switch (status) {
        case 'taken':
            return 'text-emerald-600';
        case 'missed':
            return 'text-red-500';
        case 'pending':
            return 'text-amber-500';
        default:
            return 'text-slate-400';
    }
}
export function getStatusBg(status) {
    switch (status) {
        case 'taken':
            return 'bg-emerald-50 border-emerald-200';
        case 'missed':
            return 'bg-red-50 border-red-200';
        case 'pending':
            return 'bg-amber-50 border-amber-200';
        default:
            return 'bg-slate-50 border-slate-200';
    }
}
// ─── String Utilities ─────────────────────────────────────────────────────────
export function sanitizeText(text) {
    return text.trim().replace(/[<>]/g, '');
}
export function getInitials(name) {
    if (!name)
        return '?';
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}
// ─── ID Generator ─────────────────────────────────────────────────────────────
export function generateId() {
    return crypto.randomUUID();
}
