import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Card';
import { cn } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { SettingsForm } from '../settings/SettingsForm';
const navItems = [
    {
        label: 'My Medications',
        href: '/dashboard',
        icon: (_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.75, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) })),
    },
    {
        label: 'Manage',
        href: '/manage',
        icon: (_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.75, d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" }) })),
    },
];
export function AppLayout({ children }) {
    const { profile, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const handleSignOut = async () => {
        try {
            setSigningOut(true);
            await signOut();
            navigate('/login');
        }
        finally {
            setSigningOut(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col", children: [_jsx("header", { className: "sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 h-14 flex items-center justify-between", children: [_jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center shadow-sm", children: _jsx("svg", { className: "w-4 h-4 text-amber-400", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-4-4 1.41-1.41L12 14.17l6.59-6.58L20 9l-8 8z" }) }) }), _jsx("span", { className: "font-bold text-slate-900 font-display text-sm tracking-tight", children: "MedRemind" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setSettingsOpen(true), className: "flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200", "aria-label": "Settings", title: "Settings", children: [_jsxs("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.75, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.75, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }), _jsx("span", { className: "text-sm font-medium", children: "Settings" })] }), _jsxs("button", { onClick: handleSignOut, disabled: signingOut, className: "flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 border border-slate-200", "aria-label": "Sign out", title: "Sign out", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.75, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }), _jsx("span", { className: "text-sm font-medium", children: "Logout" })] }), _jsx(Avatar, { name: profile?.full_name ?? null, size: "sm" })] })] }) }), _jsx("main", { className: "flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-24", children: children }), _jsx("nav", { className: "fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40 safe-area-inset-bottom", children: _jsx("div", { className: "max-w-2xl mx-auto px-4 h-16 flex items-center", children: navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (_jsxs(Link, { to: item.href, className: cn('flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-150', isActive
                                ? 'text-slate-900'
                                : 'text-slate-400 hover:text-slate-600'), "aria-current": isActive ? 'page' : undefined, children: [_jsx("span", { className: cn('p-1.5 rounded-xl transition-all', isActive ? 'bg-amber-50 text-amber-600' : ''), children: item.icon }), _jsx("span", { className: cn('text-xs font-medium transition-all', isActive ? 'text-slate-900' : 'text-slate-400'), children: item.label })] }, item.href));
                    }) }) }), _jsx(Modal, { isOpen: settingsOpen, onClose: () => setSettingsOpen(false), title: "Settings", description: "Manage your profile and notification preferences", children: _jsx(SettingsForm, { onClose: () => setSettingsOpen(false) }) })] }));
}
