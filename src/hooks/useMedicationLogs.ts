import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useUIStore } from "../store";
import { getTodayDateString } from "../lib/utils";
import type { MedicationLog, MedicationStatus } from "../types";
import type { Database } from "../lib/supabase-types";

const QUERY_KEY = "medication-logs";

type MedicationLogRow = Database["public"]["Tables"]["medication_logs"]["Row"];

export function useMedicationLogs(userId: string | undefined, date?: string) {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();
  const scheduledDate = date ?? getTodayDateString();

  const {
    data: logs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY, userId, scheduledDate],
    queryFn: async (): Promise<MedicationLog[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("scheduled_date", scheduledDate);

      if (error) throw new Error(error.message);
      return (data ?? []).map(normalizeMedicationLog);
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });

  function normalizeMedicationLog(row: MedicationLogRow): MedicationLog {
    const safeStatus =
      row.status && isMedicationStatus(row.status) ? row.status : "pending";
    return {
      id: row.id,
      medication_id: row.medication_id ?? "",
      user_id: row.user_id ?? "",
      scheduled_date: row.scheduled_date,
      taken: row.taken ?? false,
      status: safeStatus,
      taken_at: row.taken_at ?? "",
      created_at: row.created_at ?? "",
    };
  }

  // const markAsTaken = useMutation({
  //   mutationFn: async (medicationId: string) => {
  //     console.log("🔥 useMedicationLogs markAsTaken called");
  //     console.log("medicationId:", medicationId);
  //     console.log("medicationId : " + medicationId);

  //     const today = scheduledDate;

  //     console.log("Today value : "+ today)
  //     const { data, error } = await supabase
  //       .from("medication_logs")
  //       .update({
  //         status: "taken",
  //         taken_at: new Date().toISOString(),
  //       })
  //       .eq("medication_id", medicationId)
  //       .select()
  //       .maybeSingle()
  //     if (error) throw new Error(error.message);
  //     if (!data) throw new Error("No medication log found for this ID");
  //     console.log("Data : "+JSON.stringify(data))
  //     return data;
  //   },

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: [QUERY_KEY, userId, scheduledDate],
  //     });
  //   },

  // });

  const markAsTaken = useMutation({
    mutationFn: async (medicationId: string) => {
      const today = scheduledDate;

      // 1️⃣ Try to get today's log
      const { data: existingLog } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("medication_id", medicationId)
        .eq("scheduled_date", today)
        .maybeSingle();

      if (!existingLog) {
        // 2️⃣ If no log exists → create it
        const { data: newLog, error: insertError } = await supabase
          .from("medication_logs")
          .insert({
            medication_id: medicationId,
            user_id: userId,
            scheduled_date: today,
            status: "taken",
            taken_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newLog;
      }

      // 3️⃣ If exists → update
      const { data: updatedLog, error: updateError } = await supabase
        .from("medication_logs")
        .update({
          status: "taken",
          taken_at: new Date().toISOString(),
        })
        .eq("id", existingLog.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return updatedLog;
    },

    onSuccess: () => {
      if (userId && scheduledDate) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY, userId, scheduledDate],
        });
      }
    },
  });

  const isMedicationStatus = (status: string): status is MedicationStatus =>
    ["taken", "missed", "pending"].includes(status);

  const getStatusForMedication = (
    medicationId: string,
  ): MedicationStatus | null => {
    const log = logs.find((l) => l.medication_id === medicationId);
    if (!log?.status) return null;

    return isMedicationStatus(log.status) ? log.status : null;
  };

  const isTakenToday = (medicationId: string): boolean => {
    return getStatusForMedication(medicationId) === "taken";
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
