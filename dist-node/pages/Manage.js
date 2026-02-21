import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../hooks/useAuth';
import { AppLayout } from '../components/layout/AppLayout';
import { CaretakerDashboard } from '../components/dashboard/CaretakerDashboard';
import { useUIStore } from '../store';
import { Modal } from '../components/ui/Modal';
import { AddMedicationForm } from '../components/medications/AddMedicationForm';
export default function ManagePage() {
    const { user, profile } = useAuth();
    const { modal, closeModal } = useUIStore();
    if (!user)
        return null;
    return (_jsxs(AppLayout, { children: [_jsx(CaretakerDashboard, { userId: user.id, profile: profile }), _jsx(Modal, { isOpen: modal.isOpen && (modal.type === 'add-medication' || modal.type === 'edit-medication'), onClose: closeModal, title: modal.type === 'edit-medication' ? 'Edit medication' : 'Add medication', description: modal.type === 'edit-medication'
                    ? 'Update the details for this medication'
                    : "Add a new medication to the patient's list", children: _jsx(AddMedicationForm, { userId: user.id, editingMedication: modal.type === 'edit-medication' ? modal.data : null }) })] }));
}
