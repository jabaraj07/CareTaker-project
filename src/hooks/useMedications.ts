import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useUIStore } from "../store";
import type {
  Medication,
  Database,
  MedicationRow,
  MedicationFrequency,
} from "../types";
import type { MedicationSchema } from "../lib/schemas";

const QUERY_KEY = "medications";

export function useMedications(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  function normalizeMedication(row: MedicationRow): Medication {
    const validFrequencies: MedicationFrequency[] = [
      "daily",
      "twice_daily",
      "three_times_daily",
      "weekly",
    ];

    return {
      id: row.id,
      name: row.name,
      user_id: row.user_id ?? "",
      dosage: row.dosage ?? "",
      frequency: validFrequencies.includes(row.frequency as MedicationFrequency)
        ? (row.frequency as MedicationFrequency)
        : "daily",
      reminder_time: row.reminder_time ?? null,
      is_active: row.is_active ?? true,
      created_at: row.created_at ?? "",
      updated_at: row.updated_at ?? "",
    };
  }

  const {
    data: medications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: async (): Promise<Medication[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      // return data;
      return (data ?? []).map(normalizeMedication);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addMedication = useMutation({
    mutationFn: async (formData: MedicationSchema): Promise<Medication> => {
      if (!userId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("medications")
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

      if (error || !data) throw new Error(error?.message || "Insert failed");
      // return data;

      return normalizeMedication(data);
    },
    onSuccess: (newMedication) => {
      queryClient.setQueryData<Medication[]>(
        [QUERY_KEY, userId],
        (old = []) => [newMedication, ...old],
      );
      addToast({
        type: "success",
        title: "Medication added!",
        message: `${newMedication.name} has been added to your list.`,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Failed to add medication",
        message: error.message,
      });
    },
  });

  const updateMedication = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Database["public"]["Tables"]["medications"]["Update"] & {
      id: string;
    }) => {
      const { data, error } = await supabase
        .from("medications")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return normalizeMedication(data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Medication[]>([QUERY_KEY, userId], (old = []) =>
        old.map((m) => (m.id === updated.id ? updated : m)),
      );
      addToast({ type: "success", title: "Medication updated!" });
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Failed to update medication",
        message: error.message,
      });
    },
  });

  const deleteMedication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("medications")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Medication[]>([QUERY_KEY, userId], (old = []) =>
        old.filter((m) => m.id !== deletedId),
      );
      addToast({ type: "success", title: "Medication removed." });
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Failed to remove medication",
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
