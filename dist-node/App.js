import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute, PublicOnlyRoute, } from "./components/auth/ProtectedRoute";
import { ToastContainer } from "./components/ui/Toast";
import { AuthInitializer } from "./components/auth/AuthInitializer";
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const ManagePage = lazy(() => import("./pages/Manage"));
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60 * 2, // 2 minutes
        },
        mutations: {
            retry: 0,
        },
    },
});
function PageLoader() {
    return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center", children: _jsx("div", { className: "flex items-center gap-1", children: [0, 1, 2].map((i) => (_jsx("div", { className: "w-2 h-2 rounded-full bg-amber-400 animate-bounce", style: { animationDelay: `${i * 0.15}s` } }, i))) }) }));
}
export default function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthInitializer, { children: _jsxs(BrowserRouter, { children: [_jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicOnlyRoute, { children: _jsx(LoginPage, {}) }) }), _jsx(Route, { path: "/signup", element: _jsx(PublicOnlyRoute, { children: _jsx(SignupPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/manage", element: _jsx(ProtectedRoute, { children: _jsx(ManagePage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) }), _jsx(ToastContainer, {})] }) }) }));
}
