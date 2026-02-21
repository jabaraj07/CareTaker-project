import { useMemo } from 'react';
import { useMedications } from '../../hooks/useMedications';
import { useMedicationLogs } from '../../hooks/useMedicationLogs';
import { computeMedicationsWithStatus } from '../../lib/utils';
import { MedicationCard } from './MedicationCard';
import { MedicationCardSkeleton, EmptyState } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store';


interface MedicationListProps {
  userId: string;
  mode: 'patient' | 'caretaker';
}


export function MedicationList({ userId, mode }: MedicationListProps) {
  const { medications, isLoading: medsLoading } = useMedications(userId);
  const { logs, isLoading: logsLoading, markAsTaken } = useMedicationLogs(userId);
  const { openModal } = useUIStore();

  const isLoading = medsLoading || logsLoading;

  const medicationsWithStatus = useMemo(
    () => computeMedicationsWithStatus(medications, logs),
    [medications, logs]
  );

  const handleMarkTaken = (medicationId: string) => {
    console.log("This method in MedicationList is called : "+medicationId)
    markAsTaken.mutate(medicationId);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <MedicationCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (medicationsWithStatus.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
        }
        title="No medications yet"
        description={
          mode === 'caretaker'
            ? "Add the patient's medications using the button above."
            : 'Your caretaker will add medications for you to track.'
        }
        action={
          mode === 'caretaker' ? (
            <Button size="sm" onClick={() => openModal('add-medication')}>
              Add first medication
            </Button>
          ) : undefined
        }
      />
    );
  }

  const sorted = [...medicationsWithStatus].sort((a, b) => {
    const order = { null: 0, pending: 1, missed: 2, taken: 3 };
    const aOrder = order[a.todayStatus as keyof typeof order] ?? 0;
    const bOrder = order[b.todayStatus as keyof typeof order] ?? 0;
    return aOrder - bOrder;
  });

  return (
    <div className="space-y-3">
      {sorted.map((medication) => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          userId={userId}
          showActions={mode === 'caretaker'}
          onMarkTaken={mode === 'patient' ? handleMarkTaken : undefined}
          isMarkingTaken={
            markAsTaken.isPending && markAsTaken.variables === medication.id
          }
        />
      ))}
    </div>
  );
}