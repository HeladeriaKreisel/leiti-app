import React from 'react';

export default function Header({ onSync, isSyncing, isConnected }) {
  const todayFormatted = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const capitalizedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-2xl flex items-center justify-between border-b border-outline-variant/20">
      <div className="flex items-center gap-space-lg">
        {/* Date pill */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-lg py-space-xs rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-outline-variant/20">
          <span className="material-symbols-outlined text-tertiary text-[18px]">calendar_today</span>
          <span className="font-body-md text-body-md text-on-surface font-medium">{capitalizedDate}</span>
        </div>

        {/* Temporal filter buttons */}
        <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
          <button className="px-space-md py-1 rounded-md font-label-sm text-label-sm bg-surface-container-lowest text-on-surface font-semibold shadow-xs" type="button">
            Día
          </button>
          <button className="px-space-md py-1 rounded-md font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" type="button">
            Semana
          </button>
          <button className="px-space-md py-1 rounded-md font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" type="button">
            Mes
          </button>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        {/* Sync button */}
        <button 
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-space-xs px-space-lg py-space-sm bg-secondary-container text-on-secondary-container rounded-xl font-label-md text-label-md hover:bg-secondary-fixed-dim transition-all shadow-xs active:scale-95 disabled:opacity-50" 
          type="button"
        >
          <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Supabase'}</span>
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-xl bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center justify-center text-on-surface-variant hover:text-on-surface relative border border-outline-variant/20" type="button">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error"></span>
        </button>

        {/* User icon */}
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
}
