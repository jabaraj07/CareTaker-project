import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicationSchema } from '../../lib/schemas';
import { useMedications } from '../../hooks/useMedications';
import { useUIStore } from '../../store';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
const FREQUENCY_OPTIONS = [
    { value: 'daily', label: 'Once daily' },
    { value: 'twice_daily', label: 'Twice daily' },
    { value: 'three_times_daily', label: 'Three times daily' },
    { value: 'weekly', label: 'Weekly' },
];
export function AddMedicationForm({ userId, editingMedication }) {
    const { addMedication, updateMedication } = useMedications(userId);
    const { closeModal } = useUIStore();
    const isEditing = !!editingMedication;
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm({
        resolver: zodResolver(medicationSchema),
        defaultValues: editingMedication
            ? {
                name: editingMedication.name,
                dosage: editingMedication.dosage,
                frequency: editingMedication.frequency,
                reminder_time: editingMedication.reminder_time ?? undefined,
            }
            : {
                frequency: 'daily',
            },
    });
    const onSubmit = async (data) => {
        console.log('Submitting medication:', data);
        const cleanedData = {
            ...data,
            reminder_time: data.reminder_time || null,
        };
        try {
            if (isEditing && editingMedication) {
                await updateMedication.mutateAsync({ id: editingMedication.id, ...cleanedData });
            }
            else {
                await addMedication.mutateAsync(cleanedData);
                reset();
            }
            closeModal();
        }
        catch {
            // Error is handled by the mutation's onError callback (toast)
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [_jsx(Input, { label: "Medication name", type: "text", placeholder: "e.g., Metformin, Aspirin", error: errors.name?.message, required: true, autoFocus: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" }) }), ...register('name') }), _jsx(Input, { label: "Dosage", type: "text", placeholder: "e.g., 500mg, 10ml, 1 tablet", error: errors.dosage?.message, hint: "Include units (mg, ml, tablets, etc.)", required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }), ...register('dosage') }), _jsx(Select, { label: "Frequency", options: FREQUENCY_OPTIONS, error: errors.frequency?.message, required: true, ...register('frequency') }), _jsx(Input, { label: "Reminder time (optional)", type: "time", hint: "Set a time to remind the patient to take this medication", error: errors.reminder_time?.message, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), ...register('reminder_time') }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx(Button, { type: "button", variant: "ghost", fullWidth: true, onClick: closeModal, disabled: isSubmitting, children: "Cancel" }), _jsx(Button, { type: "submit", fullWidth: true, isLoading: isSubmitting, variant: "primary", children: isEditing ? 'Save changes' : 'Add medication' })] })] }));
}
