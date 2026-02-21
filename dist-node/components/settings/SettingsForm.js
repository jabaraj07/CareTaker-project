import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../lib/schemas";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Divider } from "../ui/Card";
export function SettingsForm({ onClose }) {
    const { profile, updateProfile, user } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile?.full_name ?? "",
            caretaker_email: profile?.caretaker_email ?? "",
            notification_time: profile?.notification_time ?? "20:00",
        },
    });
    const onSubmit = async (data) => {
        const cleanedData = {
            full_name: data.full_name,
            caretaker_email: data.caretaker_email,
            notification_time: data.notification_time || null,
        };
        try {
            await updateProfile(cleanedData);
            onClose();
        }
        catch (error) {
            // Error handled by hook (toast)
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", noValidate: true, children: [_jsxs("div", { className: "p-3.5 rounded-xl bg-slate-50 border border-slate-100", children: [_jsx("p", { className: "text-xs font-medium text-slate-500 uppercase tracking-wide mb-1", children: "Logged in as" }), _jsx("p", { className: "text-sm font-semibold text-slate-900", children: user?.email })] }), _jsx(Divider, {}), _jsx(Input, { label: "Full name", type: "text", placeholder: "Jane Smith", error: errors.full_name?.message, required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), ...register("full_name") }), _jsx(Input, { label: "Caretaker's email", type: "email", placeholder: "caretaker@example.com", error: errors.caretaker_email?.message, hint: "This person will receive email alerts for missed medications", leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), ...register("caretaker_email") }), _jsx(Input, { label: "Notification check time", type: "time", error: errors.notification_time?.message, hint: "If medications aren't marked by this time, caretaker will be notified", leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }), ...register("notification_time") }), _jsx(Divider, {}), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { type: "button", variant: "ghost", fullWidth: true, onClick: onClose, children: "Cancel" }), _jsx(Button, { type: "submit", fullWidth: true, isLoading: isSubmitting, disabled: !isDirty, children: "Save changes" })] })] }));
}
