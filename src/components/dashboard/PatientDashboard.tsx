import { useMemo } from 'react';
import { format } from 'date-fns';
import { useMedications } from '../../hooks/useMedications';
import { useMedicationLogs } from '../../hooks/useMedicationLogs';
import { computeMedicationsWithStatus, computeDailyProgress, getGreeting } from '../../lib/utils';
import { MedicationList } from '../medications/MedicationList';
import { Card, ProgressBar } from '../ui/Card';
import type { SafeProfile  } from '../../types';


interface PatientDashboardProps {
  userId: string;
  profile: SafeProfile  | null;
}


function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 font-display leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}


export function PatientDashboard({ userId, profile }: PatientDashboardProps) {
  const { medications } = useMedications(userId);
  const { logs } = useMedicationLogs(userId);

  const medicationsWithStatus = useMemo(
    () => computeMedicationsWithStatus(medications, logs),
    [medications, logs]
  );

  const progress = useMemo(
    () => computeDailyProgress(medicationsWithStatus),
    [medicationsWithStatus]
  );

  const today = format(new Date(), 'EEEE, MMMM d');
  const greeting = getGreeting();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div>
        <p className="text-sm text-slate-500">{today}</p>
        <h1 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {progress.total === 0
            ? 'No medications to track today.'
            : progress.taken === progress.total
            ? "You've taken all your medications today! Great job! 🎉"
            : `You have ${progress.pending} medication${progress.pending !== 1 ? 's' : ''} left to take today.`}
        </p>
      </div>

      {/* Progress Card */}
      {progress.total > 0 && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-0 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-300 font-medium">Today's Progress</p>
              <p className="text-3xl font-bold font-display mt-0.5">
                {progress.percentage}%
                <span className="text-base font-normal text-slate-400 ml-1">complete</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-display text-amber-400">
                {progress.taken}/{progress.total}
              </p>
              <p className="text-xs text-slate-400">taken</p>
            </div>
          </div>
          <ProgressBar value={progress.percentage} color="amber" className="bg-slate-600" />
        </Card>
      )}

      {/* Stats */}
      {progress.total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Taken"
            value={progress.taken}
            color="bg-emerald-50 text-emerald-600"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatCard
            label="Pending"
            value={progress.pending}
            color="bg-amber-50 text-amber-600"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Missed"
            value={progress.missed}
            color="bg-red-50 text-red-500"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Medication List */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 font-display mb-3">
          Today's medications
        </h2>
        <MedicationList userId={userId} mode="patient" />
      </div>
    </div>
  );
}