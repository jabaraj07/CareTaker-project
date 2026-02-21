import { useMemo } from 'react';
import { useMedications } from '../../hooks/useMedications';
import { useMedicationLogs } from '../../hooks/useMedicationLogs';
import { computeMedicationsWithStatus, computeDailyProgress } from '../../lib/utils';
import { MedicationList } from '../medications/MedicationList';
import { Card, Badge, ProgressBar } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store';
import type { SafeProfile  } from '../../types';


interface CaretakerDashboardProps {
  userId: string;
  profile: SafeProfile  | null;
}


function NotificationInfoCard({ profile }: { profile: SafeProfile  | null }) {
  const hasCaretakerEmail = !!profile?.caretaker_email;

  return (
    <Card
      className={
        hasCaretakerEmail
          ? 'border-emerald-100 bg-emerald-50/40'
          : 'border-amber-100 bg-amber-50/40'
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            hasCaretakerEmail ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">Email notifications</p>
          {hasCaretakerEmail ? (
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Alerts sent to:{' '}
              <span className="font-medium text-slate-700">{profile!.caretaker_email}</span>
            </p>
          ) : (
            <p className="text-xs text-amber-700 mt-0.5">
              No caretaker email set. Update in Settings to enable alerts.
            </p>
          )}
        </div>
        <Badge variant={hasCaretakerEmail ? 'success' : 'warning'} dot>
          {hasCaretakerEmail ? 'Active' : 'Setup needed'}
        </Badge>
      </div>
    </Card>
  );
}


export function CaretakerDashboard({ userId, profile }: CaretakerDashboardProps) {
  const { medications } = useMedications(userId);
  const { logs } = useMedicationLogs(userId);
  const { openModal } = useUIStore();

  const medicationsWithStatus = useMemo(
    () => computeMedicationsWithStatus(medications, logs),
    [medications, logs]
  );

  const progress = useMemo(
    () => computeDailyProgress(medicationsWithStatus),
    [medicationsWithStatus]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Manage medications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Add and track the patient's daily medications
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => openModal('add-medication')}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add medication
        </Button>
      </div>

      {/* Notification Status */}
      <NotificationInfoCard profile={profile} />

      {/* Today's Overview */}
      {progress.total > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>Today's overview</Card.Title>
            <Badge variant={progress.taken === progress.total ? 'success' : 'warning'} dot>
              {progress.taken === progress.total ? 'All taken' : `${progress.pending} pending`}
            </Badge>
          </Card.Header>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>
                {progress.taken} of {progress.total} taken
              </span>
              <span className="font-semibold text-slate-700">{progress.percentage}%</span>
            </div>
            <ProgressBar value={progress.percentage} color="emerald" />

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
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
              ].map(({ label, count, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                  <p className={`text-xl font-bold font-display ${color}`}>{count}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Medication Management */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 font-display mb-3">
          Medication list
        </h2>
        <MedicationList userId={userId} mode="caretaker" />
      </div>
    </div>
  );
}