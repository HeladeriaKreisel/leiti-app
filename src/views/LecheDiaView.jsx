import React, { useState } from 'react';

export default function LecheDiaView({ finca, registros, onAddRegistro, onNotify }) {
  const [shift, setShift] = useState('morning');
  const [liters, setLiters] = useState(145);
  const [price, setPrice] = useState(finca?.precio_sugerido_litro || 2200);
  const [operador, setOperador] = useState('Hernán Gómez');
  const [lote, setLote] = useState('Lote 1');
  const [vacas, setVacas] = useState(finca?.vacas_en_ordeno || 28);
  const [saving, setSaving] = useState(false);

  const fleteRate = 50; // COP por litro
  const subtotal = liters * price;
  const flete = liters * fleteRate;
  const neto = subtotal - flete;

  const capacidadTanque = finca?.capacidad_tanque_litros || 500;
  const tankFillPct = Math.min(Math.round((liters / capacidadTanque) * 100), 100);
  const capacidadRestante = Math.max(0, capacidadTanque - liters);

  const formatCOP = (num) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);

  // Cálculos acumulados del día
  const todayStr = new Date().toISOString().split('T')[0];
  const registrosHoy = registros.filter(r => r.fecha === todayStr);
  const totalLitrosHoy = registrosHoy.reduce((acc, curr) => acc + (parseFloat(curr.litros) || 0), 0) + (registrosHoy.length === 0 ? 145 : 0);
  const valorAcumuladoHoy = registrosHoy.reduce((acc, curr) => acc + (parseFloat(curr.neto_cop) || 0), 0) + (registrosHoy.length === 0 ? 311750 : 0);

  const handleAddLiters = (amount) => {
    setLiters(prev => (parseFloat(prev) || 0) + amount);
  };

  const handleSetTankFull = () => {
    setLiters(capacidadTanque);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!liters || liters <= 0) {
      onNotify('Atención', 'Por favor ingresa un volumen de litros válido.', 'error');
      return;
    }

    setSaving(true);
    const nuevoRegistro = {
      finca_id: finca?.id,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
      turno: shift,
      litros: parseFloat(liters),
      precio_litro: parseFloat(price),
      flete_por_litro: fleteRate,
      subtotal_cop: subtotal,
      neto_cop: neto,
      tanque_temperatura: finca?.temperatura_tanque || 3.4,
      operador: operador,
      lote: lote,
      vacas_ordeñadas: parseInt(vacas) || 28
    };

    const res = await onAddRegistro(nuevoRegistro);
    setSaving(false);

    if (res?.success) {
      onNotify(
        'Ordeño Registrado', 
        `Se guardaron ${liters} L con éxito (${res.source === 'supabase' ? 'Supabase PostgreSQL' : 'Almacenamiento Local'}).`
      );
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-2xl">
      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-xl bg-surface-container-lowest p-space-2xl rounded-2xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm text-tertiary">
            <span className="material-symbols-outlined text-primary text-[20px]">water_drop</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Control Lechero Diario • {finca?.nombre_finca || 'Hda. La Pradera'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold text-[26px]">
              Registro de Ordeño y Acopio
            </h1>
            <span className="inline-flex items-center gap-1.5 px-space-md py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Tanque 01 Activo ({finca?.temperatura_tanque || 3.4}°C)
            </span>
          </div>
        </div>

        {/* Live Accumulator Badges */}
        <div className="flex items-center gap-space-xl">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-tertiary">Total Acopiado Hoy</span>
            <span className="font-headline-md text-headline-md text-on-surface font-extrabold text-[22px]">
              {totalLitrosHoy} <span className="font-label-md text-label-md text-tertiary font-normal">Litros</span>
            </span>
          </div>
          <div className="h-10 w-px bg-surface-container-high hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-tertiary">Valor Acumulado</span>
            <span className="font-headline-md text-headline-md text-primary font-extrabold text-[22px]">
              {formatCOP(valorAcumuladoHoy)} <span className="font-label-sm text-label-sm text-tertiary font-normal">COP</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Dual Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-2xl items-start">
        {/* LEFT: Fast Data Entry Interactive Terminal (7 Cols on XL) */}
        <section className="xl:col-span-7 flex flex-col gap-space-xl">
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-space-2xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-xl relative overflow-hidden">
            {/* Shift switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div className="flex flex-col">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-[20px]">
                  Nueva Entrada de Tanque
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Capture litros medidos en báscula o varilla de tanque.
                </p>
              </div>

              {/* Shift Segmented Control */}
              <div className="flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShift('morning')}
                  className={`flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-md text-label-md transition-all ${
                    shift === 'morning'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">light_mode</span>
                  <span>Mañana (05:30)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShift('afternoon')}
                  className={`flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-md text-label-md transition-all ${
                    shift === 'afternoon'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
                  <span>Tarde (16:00)</span>
                </button>
              </div>
            </div>

            {/* Metric Volume Field with Fast Bump Buttons */}
            <div className="flex flex-col gap-space-sm bg-surface-container-low p-space-xl rounded-xl border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <label className="font-label-lg text-label-lg text-on-surface font-bold">Volumen Extraído de Leche</label>
                <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">speed</span> 
                  Capacidad restante: {capacidadRestante} L
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={liters}
                  onChange={(e) => setLiters(parseFloat(e.target.value) || 0)}
                  className="w-full h-20 bg-surface-container-lowest text-on-surface font-metric-numeral text-display pl-space-xl pr-28 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all font-extrabold text-[36px]"
                />
                <div className="absolute right-space-xl flex items-center gap-space-xs pointer-events-none">
                  <span className="font-headline-md text-headline-md text-tertiary font-bold">LITROS</span>
                </div>
              </div>

              {/* Rapid Addition Pills */}
              <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                <button
                  type="button"
                  onClick={() => handleAddLiters(10)}
                  className="px-space-md py-space-xs bg-surface-container-lowest hover:bg-secondary-container text-on-surface-variant hover:text-on-secondary-container font-label-sm text-label-sm rounded-lg shadow-xs transition-all border border-outline-variant/10"
                >
                  +10 L
                </button>
                <button
                  type="button"
                  onClick={() => handleAddLiters(25)}
                  className="px-space-md py-space-xs bg-surface-container-lowest hover:bg-secondary-container text-on-surface-variant hover:text-on-secondary-container font-label-sm text-label-sm rounded-lg shadow-xs transition-all border border-outline-variant/10"
                >
                  +25 L
                </button>
                <button
                  type="button"
                  onClick={() => handleAddLiters(50)}
                  className="px-space-md py-space-xs bg-surface-container-lowest hover:bg-secondary-container text-on-surface-variant hover:text-on-secondary-container font-label-sm text-label-sm rounded-lg shadow-xs transition-all border border-outline-variant/10"
                >
                  +50 L
                </button>
                <button
                  type="button"
                  onClick={() => handleAddLiters(100)}
                  className="px-space-md py-space-xs bg-surface-container-lowest hover:bg-secondary-container text-on-surface-variant hover:text-on-secondary-container font-label-sm text-label-sm rounded-lg shadow-xs transition-all border border-outline-variant/10"
                >
                  +100 L
                </button>
                <button
                  type="button"
                  onClick={handleSetTankFull}
                  className="px-space-md py-space-xs bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-lg font-bold shadow-xs hover:bg-secondary-fixed-dim transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span> 
                  Llenar Tanque ({capacidadTanque} L)
                </button>
              </div>
            </div>

            {/* Price & Operador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-end">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Precio Pactado / Litro (COP)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-space-lg font-headline-md text-headline-md text-tertiary">$</span>
                  <input
                    type="number"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-headline-md text-headline-md pl-10 pr-space-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Operador Responsable
                </label>
                <input
                  type="text"
                  value={operador}
                  onChange={(e) => setOperador(e.target.value)}
                  className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Financial summary breakdown */}
            <div className="bg-surface-container-low/60 p-space-xl rounded-xl border border-outline-variant/20 flex flex-col gap-space-sm">
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Subtotal Bruto ({liters} L × ${price}):</span>
                <span className="font-bold text-on-surface">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-body-md text-error">
                <span>Deducción Flete ({liters} L × ${fleteRate}):</span>
                <span className="font-bold">-{formatCOP(flete)}</span>
              </div>
              <div className="border-t border-surface-container-high pt-space-xs flex justify-between items-center">
                <span className="font-label-lg text-label-lg text-on-surface font-extrabold">Neto a Liquidar:</span>
                <span className="font-headline-md text-headline-md text-primary font-extrabold text-[22px]">{formatCOP(neto)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-space-lg bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md rounded-xl transition-all shadow-[0_3px_10px_rgba(10,100,59,0.22)] active:scale-[0.99] flex items-center justify-center gap-space-sm font-bold disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[22px]">{saving ? 'refresh' : 'check_circle'}</span>
              <span>{saving ? 'Guardando en Supabase...' : 'Registrar Ordeño en Tanque'}</span>
            </button>
          </form>
        </section>

        {/* RIGHT: Live Tank Monitor & Entries Table (5 Cols on XL) */}
        <section className="xl:col-span-5 flex flex-col gap-space-xl">
          {/* Tank Visual Card */}
          <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                Monitoreo Tanque Frío
              </h3>
              <span className="font-label-sm text-label-sm text-primary font-bold bg-secondary-container px-space-md py-0.5 rounded-full">
                3.4 °C Estable
              </span>
            </div>

            <div className="w-full bg-surface-container-low h-4 rounded-full overflow-hidden border border-outline-variant/20">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-700" 
                style={{ width: `${tankFillPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-label-sm text-tertiary">
              <span>0 L</span>
              <span className="font-bold text-on-surface">{liters} L ({tankFillPct}%)</span>
              <span>{capacidadTanque} L</span>
            </div>
          </div>

          {/* Historial de Ordeños de Hoy */}
          <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
              Ordeños Registrados
            </h3>

            <div className="flex flex-col divide-y divide-surface-container-low">
              {registros.map((reg) => (
                <div key={reg.id} className="py-space-md flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        {reg.turno === 'morning' ? 'light_mode' : 'wb_twilight'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        {reg.turno === 'morning' ? 'Mañana' : 'Tarde'} • {reg.litros} Litros
                      </span>
                      <span className="font-label-sm text-label-sm text-tertiary">
                        {reg.fecha} {reg.hora} • {reg.operador}
                      </span>
                    </div>
                  </div>
                  <span className="font-label-lg text-label-lg text-primary font-bold">
                    {formatCOP(reg.neto_cop || reg.subtotal_cop || reg.litros * 2200)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
