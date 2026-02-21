import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../lib/schemas';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
export function LoginForm() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        try {
            setServerError(null);
            await signIn(data);
            navigate('/dashboard');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Sign in failed';
            // Map Supabase errors to friendly messages
            if (message.toLowerCase().includes('invalid login')) {
                setServerError('Invalid email or password. Please try again.');
            }
            else if (message.toLowerCase().includes('email not confirmed')) {
                setServerError('Please verify your email before signing in.');
            }
            else {
                setServerError(message);
            }
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", noValidate: true, children: [serverError && (_jsxs("div", { className: "p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3", children: [_jsx("svg", { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }), _jsx("p", { className: "text-sm text-red-700 leading-relaxed", children: serverError })] })), _jsx(Input, { label: "Email address", type: "email", autoComplete: "email", placeholder: "you@example.com", error: errors.email?.message, required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" }) }), ...register('email') }), _jsxs("div", { children: [_jsx(Input, { label: "Password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", error: errors.password?.message, required: true, leftIcon: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }), rightIcon: _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-slate-400 hover:text-slate-600 transition-colors", "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? (_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) })) : (_jsxs("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) }), ...register('password') }), _jsx("div", { className: "text-right mt-2", children: _jsx("button", { type: "button", className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "Forgot password?" }) })] }), _jsx(Button, { type: "submit", fullWidth: true, size: "lg", isLoading: isSubmitting, className: "mt-6", children: isSubmitting ? 'Signing in...' : 'Sign in' }), _jsxs("div", { className: "relative my-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-slate-200" }) }), _jsx("div", { className: "relative flex justify-center text-xs", children: _jsx("span", { className: "px-2 bg-white text-slate-500", children: "New to MedRemind?" }) })] }), _jsx("p", { className: "text-center", children: _jsx(Link, { to: "/signup", className: "text-sm text-blue-600 font-medium hover:text-blue-700 underline-offset-2 hover:underline", children: "Create a free account" }) })] }));
}
