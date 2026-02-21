import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileSchema } from "../../lib/schemas";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Divider } from "../ui/Card";

interface SettingsFormProps {
  onClose: () => void;
}

export function SettingsForm({ onClose }: SettingsFormProps) {
  const { profile, updateProfile, user } = useAuth();

  function convertUTCToLocal(timeStr: string) {
    const [hours, minutes] = timeStr.split(":").map(Number);

    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);

    const localHours = date.getHours().toString().padStart(2, "0");
    const localMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${localHours}:${localMinutes}`;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      caretaker_email: profile?.caretaker_email ?? "",
      notification_time: profile?.notification_time
        ? convertUTCToLocal(profile.notification_time)
        : "14:30",
    },
  });

  function convertLocalToUTC(timeStr: string) {
    const [hours, minutes] = timeStr.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    const utcHours = date.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}`;
  }

  const onSubmit = async (data: ProfileSchema) => {
    const cleanedData = {
      full_name: data.full_name,
      caretaker_email: data.caretaker_email,
      notification_time: data.notification_time
        ? convertLocalToUTC(data.notification_time)
        : undefined,
    };
    try {
      await updateProfile(cleanedData);
      onClose();
    } catch (error) {
      // Error handled by hook (toast)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Account Info */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
          Logged in as
        </p>
        <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
      </div>

      <Divider />

      {/* Full Name */}
      <Input
        label="Full name"
        type="text"
        placeholder="Jane Smith"
        error={errors.full_name?.message}
        required
        leftIcon={
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
        {...register("full_name")}
      />

      {/* Caretaker Email */}
      <Input
        label="Caretaker's email"
        type="email"
        placeholder="caretaker@example.com"
        error={errors.caretaker_email?.message}
        hint="This person will receive email alerts for missed medications"
        leftIcon={
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
        {...register("caretaker_email")}
      />

      {/* Notification Time */}
      <Input
        label="Notification check time"
        type="time"
        error={errors.notification_time?.message}
        hint="If medications aren't marked by this time, caretaker will be notified"
        leftIcon={
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        }
        {...register("notification_time")}
      />

      <Divider />

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="button" variant="ghost" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={!isDirty}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}
