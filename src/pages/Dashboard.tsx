import { useAuth } from '../hooks/useAuth';
import { AppLayout } from '../components/layout/AppLayout';
import { PatientDashboard } from '../components/dashboard/PatientDashboard';
import { useUIStore } from '../store';
import { Modal } from '../components/ui/Modal';
import { AddMedicationForm } from '../components/medications/AddMedicationForm';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { modal, closeModal } = useUIStore();

  if (!user) return null;

  return (
    <AppLayout>
      <PatientDashboard userId={user.id} profile={profile} />

      <Modal
        isOpen={modal.isOpen && (modal.type === 'add-medication' || modal.type === 'edit-medication')}
        onClose={closeModal}
        title={modal.type === 'edit-medication' ? 'Edit medication' : 'Add medication'}
        description={
          modal.type === 'edit-medication'
            ? 'Update the details for this medication'
            : 'Add a new medication to track daily'
        }
      >
        <AddMedicationForm
          userId={user.id}
          editingMedication={modal.type === 'edit-medication' ? modal.data : null}
        />
      </Modal>
    </AppLayout>
  );
}