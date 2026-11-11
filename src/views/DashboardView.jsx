import React from 'react';

export default function DashboardView({ finca, registros, ventas, onNavigate }) {
  // Cálculos dinámicos
  const todayStr = new Date().toISOString().split('T')[0];
  const registrosHoy = registros.filter(r => r.fecha === todayStr);
  const litrosHoy = registrosHoy.reduce((acc, curr) => acc + (parseFloat(curr.litros) || 0), 0) || 145;
  const valorHoy = registrosHoy.reduce((acc, curr) => acc + (parseFloat(curr.subtotal_cop) || 0), 0) || 319000;

  const ventasHoy = ventas.filter(v => v.fecha === todayStr);
  const litrosDespachadosHoy = ventasHoy.reduce((acc, curr) => acc + (parseFloat(curr.litros) || 0), 0) || 120;

  const metaDiaria = finca?.meta_diaria_litros || 150;
  const pctMeta = Math.min(Math.round((litrosHoy / metaDiaria) * 100), 100);

  const capacidadTanque = finca?.capacidad_tanque_litros || 500;
  const lecheEnTanque = Math.max(0, litrosHoy - litrosDespachadosHoy) + 300; // base + disponible
  const volumenTanqueActual = Math.min(lecheEnTanque, capacidadTanque);
  const pctTanque = Math.round((volumenTanqueActual / capacidadTanque) * 100);
  const espacioLibre = capacidadTanque - volumenTanqueActual;

  const formatCOP = (num) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Content Top Bar / Farm Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold bg-secondary-container px-space-md py-space-xs rounded-full">
              Finca Activa
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">agriculture</span>
              {finca?.nombre_finca || 'Hacienda La Pradera'} • {finca?.sector || 'Sector El Salitre'}
            </span>
            <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
              {finca?.codigo_ica || 'ICA Res. 04892'}
            </span>
          </div>
          <h1 className="font-display text-display text-on-surface tracking-tight font-extrabold text-[28px] lg:text-[32px]">
            Buenos días, {finca?.propietario_nombre || 'Don Carlos Mendoza'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Producción y despacho matutino completados con normalidad en {finca?.municipio || 'San Pedro de los Milagros'}.
          </p>
        </div>

        <div className="flex items-center gap-space-md flex-wrap">
          {/* Clima pill */}
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-lg py-space-md rounded-xl border border-outline-variant/20">
            <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[20px]">sunny</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-on-surface leading-tight font-bold">19°C • Despejado</span>
              <span className="font-label-sm text-label-sm text-tertiary">Humedad 72% • Pastoreo ideal</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <button 
            onClick={() => onNavigate('leche-del-dia')}
            className="flex items-center gap-space-xs px-space-xl py-space-md bg-primary text-on-primary rounded-xl font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-[0_3px_10px_rgba(10,100,59,0.22)] active:scale-[0.98]" 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            <span>Registrar Ordeño</span>
          </button>
          <button 
            onClick={() => onNavigate('ventas')}
            className="flex items-center gap-space-xs px-space-xl py-space-md bg-secondary-container text-on-secondary-container rounded-xl font-label-lg text-label-lg hover:bg-secondary-fixed-dim transition-all shadow-xs active:scale-[0.98]" 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span>Añadir Venta</span>
          </button>
        </div>
      </section>

      {/* KPI Row: 4 Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg">
        {/* KPI 1: Leche Recolectada */}
        <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/70 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">water_bottle</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary block font-bold">Producción</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Leche hoy</span>
              </div>
            </div>
            <span className="px-space-sm py-0.5 rounded-full text-primary bg-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span> +9%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-numeral text-metric-numeral text-on-surface tracking-tight font-extrabold text-[28px]">{litrosHoy}</span>
              <span className="font-headline-md text-headline-md text-tertiary">Litros</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-semibold">+12 L vs ayer</span>
          </div>
          <div className="w-full pt-space-xs">
            <div className="flex justify-between items-center text-tertiary font-label-sm text-label-sm pb-1">
              <span>Meta día: {metaDiaria} L</span>
              <span className="text-on-surface font-semibold">{pctMeta}%</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${pctMeta}%` }}></div>
            </div>
          </div>
        </div>

        {/* KPI 2: Finanzas */}
        <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/70 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary block font-bold">Finanzas Hoy</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Ingreso estimado</span>
              </div>
            </div>
            <span className="px-space-sm py-0.5 rounded-full text-on-tertiary-fixed-variant bg-tertiary-fixed font-label-sm text-label-sm font-semibold">
              Proyección
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-numeral text-metric-numeral text-on-surface tracking-tight font-extrabold text-[26px]">{formatCOP(valorHoy)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-tertiary font-label-sm text-label-sm bg-surface-container-low px-space-md py-space-xs rounded-lg">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">price_check</span>
              Tasa pactada
            </span>
            <span className="font-bold text-on-surface">${finca?.precio_sugerido_litro || 2200} / Litro</span>
          </div>
        </div>

        {/* KPI 3: Despacho */}
        <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/70 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary block font-bold">Despacho</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Volumen vendido</span>
              </div>
            </div>
            <span className="px-space-sm py-0.5 rounded-full text-on-secondary-container bg-secondary-container font-label-sm text-label-sm font-bold">
              83% despachado
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-numeral text-metric-numeral text-on-surface tracking-tight font-extrabold text-[28px]">{litrosDespachadosHoy}</span>
              <span className="font-headline-md text-headline-md text-tertiary">Litros</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary">25 L reserva</span>
          </div>
          <div className="w-full pt-space-xs">
            <div className="flex justify-between items-center text-tertiary font-label-sm text-label-sm pb-1">
              <span>Ruta 4: San Jerónimo</span>
              <span className="text-primary font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">check_circle</span> Recogido
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
              <div className="bg-primary h-full" style={{ width: '83%' }}></div>
              <div className="bg-secondary-fixed-dim h-full" style={{ width: '17%' }}></div>
            </div>
          </div>
        </div>

        {/* KPI 4: Acumulado quincena */}
        <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/70 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary block font-bold">Corte Quincenal</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Acumulado del mes</span>
              </div>
            </div>
            <span className="px-space-sm py-0.5 rounded-full text-primary bg-secondary-container font-label-sm text-label-sm font-bold">
              Al día
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-space-xs">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-metric-numeral text-metric-numeral text-on-surface tracking-tight font-extrabold text-[26px]">$1.850.000</span>
              <span className="font-label-md text-label-md text-tertiary">COP</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-tertiary font-label-sm text-label-sm bg-surface-container-low px-space-md py-space-xs rounded-lg">
            <span>841 L acumulados</span>
            <span className="font-bold text-primary">Próx. pago: 30 Oct</span>
          </div>
        </div>
      </section>

      {/* Main 12-Column Grid (8 cols Left / 4 cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Cooling Tank Monitoring Unit */}
          <section className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-md">
                <div className="w-11 h-11 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[26px]">mode_fan</span>
                </div>
                <div>
                  <div className="flex items-center gap-space-sm">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[20px]">
                      Tanque de Enfriamiento Principal
                    </h2>
                    <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Activo
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Tanque cilíndrico horizontal Mueller {capacidadTanque} L • Serie MK-102
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[18px]">update</span>
                <span className="font-label-sm text-label-sm text-tertiary">Sensores en línea (PostgreSQL)</span>
              </div>
            </div>

            {/* Tank Bento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center bg-surface-container-low/70 p-space-lg rounded-xl border border-outline-variant/20">
              {/* Level Graphic */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-space-md bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/10">
                <div className="relative w-44 h-48 flex items-center justify-center">
                  <div className="w-32 h-44 rounded-2xl bg-surface-container-high relative overflow-hidden flex flex-col justify-end shadow-inner p-1">
                    {/* Scale ticks */}
                    <div className="absolute inset-y-2 left-2 flex flex-col justify-between text-[10px] font-label-sm text-tertiary font-bold z-20 pointer-events-none">
                      <span>{capacidadTanque} L</span>
                      <span>{Math.round(capacidadTanque * 0.75)} L</span>
                      <span>{Math.round(capacidadTanque * 0.5)} L</span>
                      <span>{Math.round(capacidadTanque * 0.25)} L</span>
                      <span>0 L</span>
                    </div>
                    {/* Fluid fill */}
                    <div 
                      className="w-full bg-gradient-to-t from-primary to-secondary rounded-xl transition-all duration-1000 relative flex items-center justify-center shadow-md"
                      style={{ height: `${pctTanque}%` }}
                    >
                      <div className="absolute -top-1 inset-x-0 h-2 bg-secondary-fixed opacity-75 rounded-full blur-[1px]"></div>
                      <span className="font-headline-md text-headline-md text-on-primary font-bold select-none drop-shadow">
                        {pctTanque}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-space-xs">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">{volumenTanqueActual} Litros en tanque</span>
                  <span className="font-label-sm text-label-sm text-tertiary block">Capacidad total {capacidadTanque} Litros</span>
                </div>
              </div>

              {/* Tank KPIs */}
              <div className="md:col-span-7 flex flex-col gap-space-md">
                <div className="grid grid-cols-2 gap-space-md">
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col border border-outline-variant/20">
                    <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">thermostat</span>
                      Temperatura
                    </span>
                    <span className="font-metric-numeral text-metric-numeral text-primary font-bold my-1 text-[24px]">
                      {finca?.temperatura_tanque || 3.8} °C
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                      Rango óptimo (2°-4°C)
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col border border-outline-variant/20">
                    <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                      Próx. Recolección
                    </span>
                    <span className="font-metric-numeral text-metric-numeral text-on-surface font-bold my-1 text-[24px]">04h 20m</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Llegada est: 02:30 PM</span>
                  </div>
                </div>

                <div className="bg-secondary-container/50 p-space-md rounded-xl flex items-start gap-space-md border border-secondary-container">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-secondary-container font-bold">
                      {espacioLibre} Litros de espacio disponible
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant text-[13px]">
                      Capacidad suficiente para recibir el ordeño de la tarde previsto (~130 Litros).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Weekly Production Bar Chart */}
          <section className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-space-sm">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[20px]">
                    Producción Diaria Semanal
                  </h2>
                  <span className="font-label-sm text-label-sm bg-surface-container-high px-space-md py-0.5 rounded-full text-on-surface-variant font-semibold">
                    Semana Actual
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">Comparativa frente al umbral objetivo de {metaDiaria} Litros / día</p>
              </div>
              <div className="flex items-center gap-space-lg text-label-sm font-label-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-3 rounded-sm bg-primary"></span>
                  <span className="text-on-surface font-medium">Recolectados</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-1 rounded bg-error"></span>
                  <span className="text-tertiary">Meta ({metaDiaria} L)</span>
                </div>
              </div>
            </div>

            {/* Custom Bar Chart */}
            <div className="bg-surface-container-low/50 p-space-lg rounded-xl flex flex-col gap-space-md border border-outline-variant/10">
              <div className="relative w-full h-52 flex items-end justify-between pt-6 px-space-md">
                {/* Goal Line */}
                <div className="absolute top-12 left-0 right-0 flex items-center z-10 pointer-events-none">
                  <div className="w-full border-b border-dashed border-error/70"></div>
                  <span className="text-error font-label-sm text-label-sm pl-2 whitespace-nowrap bg-surface-container-lowest px-1 rounded shadow-xs font-semibold">
                    Meta {metaDiaria} L
                  </span>
                </div>

                {/* Bars */}
                {[
                  { dia: 'Lun 20', litros: 142, pct: 71, hoy: false },
                  { dia: 'Mar 21', litros: 148, pct: 74, hoy: false },
                  { dia: 'Mié 22', litros: 155, pct: 77.5, hoy: false },
                  { dia: 'Jue 23', litros: 133, pct: 66.5, hoy: false },
                  { dia: 'Hoy 24', litros: litrosHoy, pct: Math.round((litrosHoy / 200) * 100), hoy: true },
                  { dia: 'Sáb 25', litros: 150, pct: 75, hoy: false, previsto: true },
                  { dia: 'Dom 26', litros: 152, pct: 76, hoy: false, previsto: true },
                ].map((bar, idx) => (
                  <div key={idx} className={`flex-1 flex flex-col items-center gap-space-xs h-full justify-end group ${bar.previsto ? 'opacity-50' : ''}`}>
                    <span className={`font-label-sm text-label-sm font-bold ${bar.hoy ? 'text-primary' : 'text-on-surface opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                      {bar.litros}L
                    </span>
                    <div 
                      className={`w-7 sm:w-10 rounded-t-lg transition-all shadow-xs relative ${
                        bar.hoy ? 'bg-primary shadow-md' : bar.previsto ? 'bg-surface-variant' : 'bg-secondary-fixed-dim group-hover:bg-primary'
                      }`}
                      style={{ height: `${bar.pct}%` }}
                    >
                      {bar.hoy && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-secondary-container border-2 border-primary"></div>
                      )}
                    </div>
                    <span className={`font-label-sm text-label-sm ${bar.hoy ? 'font-bold text-primary' : 'text-tertiary'}`}>
                      {bar.dia}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-lg font-label-sm text-label-sm text-on-surface-variant border border-outline-variant/10">
                <span>Promedio actual: <strong className="text-on-surface">144.6 L/día</strong> (+3.2% vs semana previa)</span>
                <span className="text-primary font-semibold">Total semanal acumulado: 723 Litros</span>
              </div>
            </div>
          </section>

          {/* Recent Farm Activities Table */}
          <section className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold text-[20px]">
                  Bitácora de Actividades Recientes
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Movimientos registrados en Supabase / Local</p>
              </div>
              <button 
                onClick={() => onNavigate('leche-del-dia')} 
                className="text-primary hover:text-primary-container font-label-md text-label-md font-bold flex items-center gap-1" 
                type="button"
              >
                <span>Ver historial</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-space-md px-space-md rounded-l-lg">Evento</th>
                    <th className="py-space-md px-space-md">Fecha/Hora</th>
                    <th className="py-space-md px-space-md">Volumen</th>
                    <th className="py-space-md px-space-md">Detalle</th>
                    <th className="py-space-md px-space-md text-right rounded-r-lg">Estado</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md divide-y divide-surface-container-low">
                  {registros.slice(0, 3).map((reg) => (
                    <tr key={reg.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-md px-space-md">
                        <div className="flex items-center gap-space-md">
                          <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                          </div>
                          <div>
                            <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                              Ordeño {reg.turno === 'morning' ? 'Matutino' : 'Vespertino'}
                            </span>
                            <span className="font-label-sm text-label-sm text-tertiary">
                              {reg.operador || 'Operador'} • {reg.lote || 'Lote 1'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md text-on-surface-variant font-label-md text-label-md">
                        {reg.fecha} {reg.hora}
                      </td>
                      <td className="py-space-md px-space-md font-label-lg text-label-lg text-on-surface font-bold">
                        {reg.litros} L
                      </td>
                      <td className="py-space-md px-space-md text-on-surface-variant">
                        {formatCOP(reg.neto_cop || reg.subtotal_cop || reg.litros * 2200)}
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[13px]">check</span> Tanqueado
                        </span>
                      </td>
                    </tr>
                  ))}
                  {ventas.slice(0, 2).map((vnt) => (
                    <tr key={vnt.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-md px-space-md">
                        <div className="flex items-center gap-space-md">
                          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary shrink-0">
                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                          </div>
                          <div>
                            <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                              Despacho: {vnt.numero_remision}
                            </span>
                            <span className="font-label-sm text-label-sm text-tertiary">{vnt.cliente_nombre}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md text-on-surface-variant font-label-md text-label-md">
                        {vnt.fecha}
                      </td>
                      <td className="py-space-md px-space-md font-label-lg text-label-lg text-on-surface font-bold">
                        {vnt.litros} L
                      </td>
                      <td className="py-space-md px-space-md font-label-lg text-label-lg text-primary font-bold">
                        {formatCOP(vnt.total_cop)}
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <span className={`inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                          vnt.estado === 'paid' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'
                        }`}>
                          {vnt.estado === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {/* Herd & Farm Overview Card */}
          <section className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                Inventario Ganadero
              </h3>
              <span className="font-label-sm text-label-sm text-primary bg-secondary-container px-space-md py-0.5 rounded-full font-bold">
                {finca?.total_vacas || 45} Cabezas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-md">
              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-tertiary">En Producción</span>
                <span className="font-metric-numeral text-metric-numeral text-primary font-extrabold text-[24px]">
                  {finca?.vacas_en_ordeno || 28}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Vacas ordeñadas</span>
              </div>
              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-tertiary">Horras / Secas</span>
                <span className="font-metric-numeral text-metric-numeral text-on-surface font-extrabold text-[24px]">
                  {finca?.vacas_horras || 12}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Preñadas / descanso</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-outline-variant/10">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary">cruelty_free</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Terneros y Levante</span>
              </div>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                {finca?.terneros || 5}
              </span>
            </div>

            <button 
              onClick={() => onNavigate('mi-finca')}
              className="w-full py-space-sm bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-xl transition-colors font-semibold"
            >
              Administrar Finca
            </button>
          </section>

          {/* Quick Shortcuts */}
          <section className="bg-primary text-on-primary p-space-xl rounded-2xl shadow-md flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-secondary-fixed text-[24px]">cloud_sync</span>
              <h3 className="font-headline-md text-headline-md font-bold text-[18px]">Base de Datos Supabase</h3>
            </div>
            <p className="font-body-md text-body-md text-white/90 text-[13px]">
              Tus datos están listos para sincronizarse con las tablas de PostgreSQL en Supabase.
            </p>
            <div className="bg-primary-container p-space-md rounded-xl flex flex-col gap-1 text-[12px] font-mono text-on-primary-container">
              <span>• fincas (predio y ganado)</span>
              <span>• registros_leche (ordeño)</span>
              <span>• ventas_remisiones (despachos)</span>
              <span>• clientes (compradores)</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
