import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useMedications } from '../../hooks/useMedications';
import { useMedicationLogs } from '../../hooks/useMedicationLogs';
import { computeMedicationsWithStatus } from '../../lib/utils';
import { MedicationCard } from './MedicationCard';
import { MedicationCardSkeleton, EmptyState } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store';
export function MedicationList({ userId, mode }) {
    const { medications, isLoading: medsLoading } = useMedications(userId);
    const { logs, isLoading: logsLoading, markAsTaken } = useMedicationLogs(userId);
    const { openModal } = useUIStore();
    const isLoading = medsLoading || logsLoading;
    const medicationsWithStatus = useMemo(() => computeMedicationsWithStatus(medications, logs), [medications, logs]);
    const handleMarkTaken = (medicationId) => {
        console.log("MedicationList.js js-file method called : "+medicationId);
        
        markAsTaken.mutate(medicationId);
    };
    if (isLoading) {
        return (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx(MedicationCardSkeleton, {}, i))) }));
    }
    if (medicationsWithStatus.length === 0) {
        return (_jsx(EmptyState, { icon: _jsx("svg", { className: "w-7 h-7", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" }) }), title: "No medications yet", description: mode === 'caretaker'
                ? "Add the patient's medications using the button above."
                : 'Your caretaker will add medications for you to track.', action: mode === 'caretaker' ? (_jsx(Button, { size: "sm", onClick: () => openModal('add-medication'), children: "Add first medication" })) : undefined }));
    }
    const sorted = [...medicationsWithStatus].sort((a, b) => {
        const order = { null: 0, pending: 1, missed: 2, taken: 3 };
        const aOrder = order[a.todayStatus] ?? 0;
        const bOrder = order[b.todayStatus] ?? 0;
        return aOrder - bOrder;
    });
    return (_jsx("div", { className: "space-y-3", children: sorted.map((medication) => (_jsx(MedicationCard, { medication: medication, userId: userId, showActions: mode === 'caretaker', onMarkTaken: mode === 'patient' ? handleMarkTaken : undefined, isMarkingTaken: markAsTaken.isPending && markAsTaken.variables === medication.id }, medication.id))) }));
}
