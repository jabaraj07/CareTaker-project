import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useStore";
import LoadingPage from '../../pages/LoadingPage';
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
