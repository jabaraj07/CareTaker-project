import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import LoadingPage from '../../pages/LoadingPage';
export function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuthStore();
    const location = useLocation();
    if (isLoading) {
        return _jsx(LoadingPage, {});
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
export function PublicOnlyRoute({ children }) {
    const { user, isLoading } = useAuthStore();
    if (isLoading) {
        return _jsx(LoadingPage, {});
    }
    if (user) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
