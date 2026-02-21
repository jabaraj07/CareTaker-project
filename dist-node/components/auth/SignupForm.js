import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { signupSchema } from '../../lib/schemas';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
export function SignupForm() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: { frequency: 'daily' },
    });
    const password = watch('password', '');
    // Password strength indicator
    const getPasswordStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8)
            score++;
        if (/[A-Z]/.test(pw))
            score++;
        if (/[0-9]/.test(pw))
            score++;
        if (/[^a-zA-Z0-9]/.test(pw))
            score++;
        if (score <= 1)
            return { score, label: 'Weak', color: 'bg-red-500' };
        if (score === 2)
            return { score, label: 'Fair', color: 'bg-orange-500' };
        if (score === 3)
            return { score, label: 'Good', color: 'bg-blue-500' };
        return { score, label: 'Strong', color: 'bg-emerald-500' };
    };
    const strength = password.length > 0 ? getPasswordStrength(password) : null;
    const onSubmit = async (data) => {
        try {
            setServerError(null);
            await signUp(data);
            setSuccess(true);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Sign up failed';
            if (message.toLowerCase().includes('already registered')) {
                setServerError('An account with this email already exists. Try signing in.');
            }
            else {
                setServerError(message);
            }
        }
    };
    if (success) {
        return (_jsxs("div", { className: "text-center py-6 space-y-5", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto", children: _jsx("svg", { className: "w-10 h-10 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-slate-900 font-display mb-2", children: "Check your email!" }), _jsx("p", { className: "text-sm text-slate-600 leading-relaxed max-w-sm mx-auto", children: "We sent a verification link to your email address. Click the link to activate your account and get started." })] }), _jsx("div", { className: "pt-2", children: _jsxs(Link, { to: "/login", className: "inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Back to sign in"] }) })] }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [serverError && (_jsxs("div", { className: "p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3", children: [_jsx("svg", { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }), _jsx("p", { className: "text-sm text-red-700 leading-relaxed", children: serverError })] })), _jsx(Input, { label: "Full name", type: "text", autoComplete: "name", placeholder: "Jane Smith", error: errors.full_name?.message, required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), ...register('full_name') }), _jsx(Input, { label: "Email address", type: "email", autoComplete: "email", placeholder: "you@example.com", error: errors.email?.message, required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), ...register('email') }), _jsx(Input, { label: "Caretaker's email", type: "email", autoComplete: "off", placeholder: "caretaker@example.com", error: errors.caretaker_email?.message, hint: "Who should be notified if medications are missed?", leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }) }), ...register('caretaker_email') }), _jsxs("div", { className: "space-y-2", children: [_jsx(Input, { label: "Password", type: showPassword ? 'text' : 'password', autoComplete: "new-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", error: errors.password?.message, required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }), rightIcon: _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-slate-400 hover:text-slate-600 transition-colors", children: showPassword ? (_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) })) : (_jsxs("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) }), ...register('password') }), strength && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4].map((i) => (_jsx("div", { className: `h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-100'}` }, i))) }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Password strength:", ' ', _jsx("span", { className: "font-medium", children: strength.label })] })] }))] }), _jsx(Input, { label: "Confirm password", type: showPassword ? 'text' : 'password', autoComplete: "new-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", error: errors.confirm_password?.message, required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }), ...register('confirm_password') }), _jsx(Button, { type: "submit", fullWidth: true, size: "lg", isLoading: isSubmitting, className: "mt-6", children: isSubmitting ? 'Creating account...' : 'Create account' }), _jsxs("div", { className: "relative my-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-slate-200" }) }), _jsx("div", { className: "relative flex justify-center text-xs", children: _jsx("span", { className: "px-2 bg-white text-slate-500", children: "Already have an account?" }) })] }), _jsx("p", { className: "text-center", children: _jsx(Link, { to: "/login", className: "text-sm text-blue-600 font-medium hover:text-blue-700 underline-offset-2 hover:underline", children: "Sign in instead" }) })] }));
}
