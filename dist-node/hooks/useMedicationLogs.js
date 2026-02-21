import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store';
import { getTodayDateString } from '../lib/utils';
const QUERY_KEY = 'medication-logs';
export function useMedicationLogs(userId, date) {
    const queryClient = useQueryClient();
    const { addToast } = useUIStore();
    const scheduledDate = date ?? getTodayDateString();
    const { data: logs = [], isLoading, error, } = useQuery({
        queryKey: [QUERY_KEY, userId, scheduledDate],
        queryFn: async () => {
            if (!userId)
                return [];
            const { data, error } = await supabase
                .from('medication_logs')
                .select('*')
                .eq('user_id', userId)
                .eq('scheduled_date', scheduledDate);
            if (error)
                throw new Error(error.message);
            return data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60, // 1 minute
    });


    const markAsTaken = useMutation({
        mutationFn: async (medicationId) => {
            if (!userId)
                throw new Error('Not authenticated');
            // Check if log already exists for today
            const { data: existing } = await supabase
                .from('medication_logs')
                .select('*')
                .eq('medication_id', medicationId)
                .eq('user_id', userId)
                .eq('scheduled_date', scheduledDate)
                .maybeSingle();
            if (existing) {
                // Update existing log to "taken"
                const { data, error } = await supabase
                    .from('medication_logs')
                    .update({
                    status: 'taken',
                    taken_at: new Date().toISOString(),
                })
                    .eq('id', existing.id)
                    .select()
                    .single();
                if (error)
                    throw new Error(error.message);
                return data;
            }
            else {
                // Create new log
                const { data, error } = await supabase
                    .from('medication_logs')
                    .insert({
                    medication_id: medicationId,
                    user_id: userId,
                    scheduled_date: scheduledDate,
                    status: 'taken',
                    taken_at: new Date().toISOString(),
                })
                    .select()
                    .single();
                if (error)
                    throw new Error(error.message);
                return data;
            }
        },
        // Optimistic update
        onMutate: async (medicationId) => {
            await queryClient.cancelQueries({ queryKey: [QUERY_KEY, userId, scheduledDate] });
            const previousLogs = queryClient.getQueryData([
                QUERY_KEY,
                userId,
                scheduledDate,
            ]);
            queryClient.setQueryData([QUERY_KEY, userId, scheduledDate], (old = []) => {
                const existing = old.find((l) => l.medication_id === medicationId);
                if (existing) {
                    return old.map((l) => l.medication_id === medicationId
                        ? { ...l, status: 'taken', taken_at: new Date().toISOString() }
                        : l);
                }
                return [
                    ...old,
                    {
                        id: `optimistic-${medicationId}`,
                        medication_id: medicationId,
                        user_id: userId,
                        scheduled_date: scheduledDate,
                        status: 'taken',
                        taken_at: new Date().toISOString(),
                        created_at: new Date().toISOString(),
                    },
                ];
            });
            return { previousLogs };
        },
        onError: (error, _medicationId, context) => {
            // Rollback on error
            if (context?.previousLogs) {
                queryClient.setQueryData([QUERY_KEY, userId, scheduledDate], context.previousLogs);
            }
            addToast({
                type: 'error',
                title: 'Failed to mark medication',
                message: error.message,
            });
        },
        onSuccess: (updatedLog) => {
            // Replace optimistic update with real data
            queryClient.setQueryData([QUERY_KEY, userId, scheduledDate], (old = []) => {
                const exists = old.find((l) => l.id === updatedLog.id);
                if (exists) {
                    return old.map((l) => (l.id === updatedLog.id ? updatedLog : l));
                }
                return old
                    .filter((l) => !l.id.startsWith('optimistic-'))
                    .concat(updatedLog);
            });
            addToast({ type: 'success', title: '✓ Medication marked as taken!' });
        },
    });


    const getStatusForMedication = (medicationId) => {
        const log = logs.find((l) => l.medication_id === medicationId);
        return log?.status ?? null;
    };
    const isTakenToday = (medicationId) => {
        return getStatusForMedication(medicationId) === 'taken';
    };
    return {
        logs,
        isLoading,
        error,
        markAsTaken,
        isTakenToday,
        getStatusForMedication,
    };
}
