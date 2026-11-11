import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab, finca, isConnected }) {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: 'grid_view' },
    { id: 'mi-finca', label: 'Mi Finca', icon: 'agriculture' },
    { id: 'leche-del-dia', label: 'Leche del Día', icon: 'water_drop' },
    { id: 'ventas', label: 'Ventas', icon: 'point_of_sale' },
    { id: 'clientes', label: 'Clientes / Plantas', icon: 'groups' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none border-r border-outline-variant/30">
      <div className="flex flex-col">
        {/* Brand header con el nuevo logo Leiti.app */}
        <div className="h-24 px-space-xl flex items-center gap-space-md border-b border-surface-container-low">
          <img
            src="/logo-icon.png"
            alt="Logo Leiti.app"
            className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-outline-variant/20 shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-[22px] tracking-tight leading-none font-extrabold text-[#1d334a]">
              Leiti<span className="text-[#69b6bf] font-semibold">.app</span>
            </span>
            <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider mt-1 font-semibold">
              Gestión Ganadera
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="px-space-md mt-space-md">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  type="button"
                  className={`flex items-center gap-space-md px-space-lg py-space-md rounded-xl transition-all text-left w-full font-label-lg text-label-lg ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span 
                    className={`material-symbols-outlined text-[22px] ${isActive ? 'text-primary' : 'text-tertiary'}`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User profile & Supabase connection info */}
      <div className="p-space-md">
        <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm border border-outline-variant/20">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-on-primary text-[20px]">person</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-lg text-label-lg text-on-surface truncate font-semibold">
                {finca?.propietario_nombre || 'Don Carlos Mendoza'}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                {finca?.nombre_finca || 'Hda. La Pradera'}
              </span>
            </div>
            <button 
              onClick={() => setCurrentTab('mi-finca')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              title="Configuración"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high/60">
            <div className="flex items-center gap-space-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-secondary-container'}`}></span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                {isConnected ? 'Supabase Activo' : 'Modo Local'}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary">PostgreSQL v17</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
