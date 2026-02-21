import React from 'react'

const LoadingPage = () => {
  return (
     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Logo mark */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <svg className="w-7 h-7 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-4-4 1.41-1.41L12 14.17l6.59-6.58L20 9l-8 8z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-2">Checking your session...</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage