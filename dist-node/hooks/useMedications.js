import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store';
const QUERY_KEY = 'medications';
export function useMedications(userId) {
    const queryClient = useQueryClient();
    const { addToast } = useUIStore();
    const { data: medications = [], isLoading, error, refetch, } = useQuery({
        queryKey: [QUERY_KEY, userId],
        queryFn: async () => {
            if (!userId)
                return [];
            const { data, error } = await supabase
                .from('medications')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            if (error)
                throw new Error(error.message);
            return data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const addMedication = useMutation({
        mutationFn: async (formData) => {
            if (!userId)
                throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('medications')
                .insert({
                user_id: userId,
                name: formData.name,
                dosage: formData.dosage,
                frequency: formData.frequency,
                reminder_time: formData.reminder_time ?? null,
                is_active: true,
            })
                .select()
                .single();
            if (error)
                throw new Error(error.message);
            return data;
        },
        onSuccess: (newMedication) => {
            queryClient.setQueryData([QUERY_KEY, userId], (old = []) => [
                newMedication,
                ...old,
            ]);
            addToast({
                type: 'success',
                title: 'Medication added!',
                message: `${newMedication.name} has been added to your list.`,
            });
        },
        onError: (error) => {
            addToast({
                type: 'error',
                title: 'Failed to add medication',
                message: error.message,
            });
        },
    });
    const updateMedication = useMutation({
        mutationFn: async ({ id, ...updates }) => {
            const { data, error } = await supabase
                .from('medications')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw new Error(error.message);
            return data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData([QUERY_KEY, userId], (old = []) => old.map((m) => (m.id === updated.id ? updated : m)));
            addToast({ type: 'success', title: 'Medication updated!' });
        },
        onError: (error) => {
            addToast({
                type: 'error',
                title: 'Failed to update medication',
                message: error.message,
            });
        },
    });
    const deleteMedication = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('medications')
                .update({ is_active: false, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error)
                throw new Error(error.message);
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData([QUERY_KEY, userId], (old = []) => old.filter((m) => m.id !== deletedId));
            addToast({ type: 'success', title: 'Medication removed.' });
        },
        onError: (error) => {
            addToast({
                type: 'error',
                title: 'Failed to remove medication',
                message: error.message,
            });
        },
    });
    return {
        medications,
        isLoading,
        error,
        refetch,
        addMedication,
        updateMedication,
        deleteMedication,
    };
}
