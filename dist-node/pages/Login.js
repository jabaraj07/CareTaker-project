import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
export default function LoginPage() {
    return (_jsx(AuthLayout, { title: "Welcome back", subtitle: "Sign in to track your medications", children: _jsx(LoginForm, {}) }));
}
