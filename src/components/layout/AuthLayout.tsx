import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';


interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}


export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Subtle decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-100 rounded-full opacity-40" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and branding above card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-4-4 1.41-1.41L12 14.17l6.59-6.58L20 9l-8 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-display mb-2">{title}</h1>
          <p className="text-slate-600 text-sm">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your health data is encrypted and secure
        </p>
      </div>
    </div>
  );
}