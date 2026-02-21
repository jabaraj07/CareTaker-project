import { jsx as _jsx } from "react/jsx-runtime";
import { AuthLayout } from '../components/layout/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';
export default function SignupPage() {
    return (_jsx(AuthLayout, { title: "Create your account", subtitle: "Set up medication tracking in minutes", children: _jsx(SignupForm, {}) }));
}
