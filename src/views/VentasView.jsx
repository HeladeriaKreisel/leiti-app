import React, { useState } from 'react';

export default function VentasView({ clientes, ventas, onAddVenta, onToggleEstadoVenta, onNotify }) {
  const [selectedBuyerKey, setSelectedBuyerKey] = useState('san_jeronimo');
  const [liters, setLiters] = useState(120);
  const [price, setPrice] = useState(2180);
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancolombia');
  const [conductor, setConductor] = useState('Rodrigo Velásquez');
  const [placa, setPlaca] = useState('TRK-982');
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  const selectedBuyer = clientes.find(c => c.clave_alias === selectedBuyerKey) || clientes[0] || {
    nombre: 'Lácteos San Jerónimo',
    contacto_nombre: 'Don Rodrigo Velásquez',
    telefono: '+57 (310) 455-8291',
    telefono_wa: '573104558291',
    precio_acordado_litro: 2180
  };

  const handleBuyerChange = (e) => {
    const key = e.target.value;
    setSelectedBuyerKey(key);
    const buyer = clientes.find(c => c.clave_alias === key);
    if (buyer) {
      setPrice(buyer.precio_acordado_litro || 2180);
      if (buyer.contacto_nombre) setConductor(buyer.contacto_nombre);
    }
  };

  const total = Math.round(liters * price);
  const formatCOP = (num) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);

  const waMessage = encodeURIComponent(
    `Hola ${selectedBuyer.contacto_nombre || selectedBuyer.nombre}, ya tenemos listo el despacho de leche de ${liters} L en Hda. La Pradera. Total: ${formatCOP(total)}.`
  );
  const waUrl = `https://wa.me/${selectedBuyer.telefono_wa || '573104558291'}?text=${waMessage}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!liters || liters <= 0) {
      onNotify('Atención', 'Por favor especifica un volumen de litros válido.', 'error');
      return;
    }

    setSaving(true);
    const numeroRemision = `REM-0${Math.floor(100 + Math.random() * 900)}`;
    const nuevaVenta = {
      numero_remision: numeroRemision,
      cliente_id: selectedBuyer?.id,
      cliente_nombre: selectedBuyer.nombre,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }),
      litros: parseFloat(liters),
      precio_litro: parseFloat(price),
      total_cop: total,
      metodo_pago: paymentMethod,
      estado: 'paid',
      conductor_nombre: conductor,
      placa_vehiculo: placa
    };

    const res = await onAddVenta(nuevaVenta);
    setSaving(false);

    if (res?.success) {
      onNotify('Remisión Creada', `Remisión ${numeroRemision} registrada en ${res.source === 'supabase' ? 'Supabase' : 'modo local'}.`);
    }
  };

  const filteredVentas = ventas.filter(v => {
    if (filter === 'paid') return v.estado === 'paid';
    if (filter === 'pending') return v.estado === 'pending';
    return true;
  });

  const totalLitros = ventas.reduce((acc, curr) => acc + (parseFloat(curr.litros) || 0), 0);
  const totalFacturado = ventas.reduce((acc, curr) => acc + (parseFloat(curr.total_cop) || 0), 0);
  const totalPendiente = ventas.filter(v => v.estado === 'pending').reduce((acc, curr) => acc + (parseFloat(curr.total_cop) || 0), 0);

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Top Banner / Quick Header Bar */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/20 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-space-xl">
          <div>
            <div className="flex items-center gap-space-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Módulo Comercial
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold text-[26px]">
              Ventas y Despachos
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-space-md">
            {/* Stock Available Badge */}
            <div className="flex items-center gap-space-md bg-secondary-container/50 px-space-lg py-space-sm rounded-xl border border-secondary-container">
              <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">propane_tank</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">En Tanque Frío</span>
                <span className="font-label-lg text-label-lg text-primary font-extrabold">142 Litros disponibles</span>
              </div>
            </div>

            {/* Reference Price Badge */}
            <div className="flex items-center gap-space-md bg-surface-container-low px-space-lg py-space-sm rounded-xl border border-outline-variant/10">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Precio Sugerido</span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">$2.180 COP / Litro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-space-md">
          <button 
            type="button" 
            onClick={() => onNotify('Exportación', 'Generando reporte de ventas en CSV...')}
            className="flex items-center gap-space-xs px-space-lg py-space-md bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-xl font-label-md text-label-md transition-colors shadow-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Exportar CSV</span>
          </button>
        </div>
      </section>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start">
        {/* LEFT PANEL: New Sale Dispatch Form (5 cols on Desktop) */}
        <aside className="xl:col-span-5 bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                  Nueva Remisión
                </h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Salida de leche y ticket</p>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary bg-surface-container-low px-space-md py-space-xs rounded-full font-mono font-bold">
              DOC: #REM-AUTO
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            {/* Client Selector */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm text-on-surface font-bold">
                Comprador / Planta Lechera
              </label>
              <div className="relative">
                <select
                  value={selectedBuyerKey}
                  onChange={handleBuyerChange}
                  className="w-full bg-surface-container-low hover:bg-surface-variant text-on-surface rounded-xl px-space-lg py-space-md font-body-md text-body-md transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
                >
                  {clientes.map(c => (
                    <option key={c.clave_alias} value={c.clave_alias}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="flex items-center justify-between bg-surface-container-low px-space-lg py-space-sm rounded-xl border border-outline-variant/10">
              <div className="flex items-center gap-space-md">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">
                    {selectedBuyer.contacto_nombre || selectedBuyer.nombre}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {selectedBuyer.telefono}
                  </span>
                </div>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-space-xs px-space-md py-space-xs bg-secondary-container text-on-secondary-container rounded-lg font-label-sm text-label-sm hover:bg-secondary-fixed-dim transition-colors font-bold shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Volume to Dispatch */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-label-sm text-on-surface font-bold">
                  Litros a Despachar
                </label>
                <button
                  type="button"
                  onClick={() => setLiters(142)}
                  className="text-primary hover:underline text-[12px] font-semibold"
                >
                  Máximo Disponible (142 L)
                </button>
              </div>
              <input
                type="number"
                min="1"
                value={liters}
                onChange={(e) => setLiters(parseFloat(e.target.value) || 0)}
                className="w-full h-12 bg-surface-container-low text-on-surface font-headline-md text-headline-md px-space-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
              />
            </div>

            {/* Price & Payment */}
            <div className="grid grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-bold">Precio / Litro</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 bg-surface-container-low text-on-surface font-headline-md text-headline-md px-space-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                />
              </div>
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-bold">Forma de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                >
                  <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                  <option value="Efectivo contra entrega">Efectivo contra entrega</option>
                  <option value="Cheque / Consignación">Cheque / Consignación</option>
                </select>
              </div>
            </div>

            {/* Conductor y Placa */}
            <div className="grid grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-bold">Conductor de Ruta</label>
                <input
                  type="text"
                  value={conductor}
                  onChange={(e) => setConductor(e.target.value)}
                  className="w-full h-11 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                />
              </div>
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-bold">Placa del Vehículo</label>
                <input
                  type="text"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className="w-full h-11 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono font-bold"
                />
              </div>
            </div>

            {/* Total card */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-outline-variant/10">
              <span className="font-label-md text-label-md text-on-surface font-bold">Total a Facturar:</span>
              <span className="font-headline-md text-headline-md text-primary font-extrabold text-[22px]">
                {formatCOP(total)}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="py-space-md bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-space-xs font-bold disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">{saving ? 'sync' : 'receipt_long'}</span>
              <span>{saving ? 'Guardando...' : 'Crear y Emitir Remisión'}</span>
            </button>
          </form>
        </aside>

        {/* RIGHT PANEL: History & Filtered Table (7 cols on Desktop) */}
        <main className="xl:col-span-7 flex flex-col gap-space-lg">
          {/* Summary counters */}
          <div className="grid grid-cols-3 gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/20 flex flex-col">
              <span className="font-label-sm text-label-sm text-tertiary">Total Facturado</span>
              <span className="font-headline-md text-headline-md text-primary font-extrabold text-[20px]">
                {formatCOP(totalFacturado)}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/20 flex flex-col">
              <span className="font-label-sm text-label-sm text-tertiary">Total Despachado</span>
              <span className="font-headline-md text-headline-md text-on-surface font-extrabold text-[20px]">
                {totalLitros} L
              </span>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/20 flex flex-col">
              <span className="font-label-sm text-label-sm text-tertiary">Por Cobrar</span>
              <span className="font-headline-md text-headline-md text-error font-extrabold text-[20px]">
                {formatCOP(totalPendiente)}
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                Historial de Remisiones
              </h3>

              {/* Status filter buttons */}
              <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-space-md py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                    filter === 'all' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('paid')}
                  className={`px-space-md py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                    filter === 'paid' ? 'bg-surface-container-lowest text-primary font-bold shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Pagados
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('pending')}
                  className={`px-space-md py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                    filter === 'pending' ? 'bg-surface-container-lowest text-error font-bold shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Pendientes
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-space-md px-space-md rounded-l-lg">Remisión</th>
                    <th className="py-space-md px-space-md">Comprador</th>
                    <th className="py-space-md px-space-md">Litros</th>
                    <th className="py-space-md px-space-md">Total COP</th>
                    <th className="py-space-md px-space-md text-right rounded-r-lg">Estado</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md divide-y divide-surface-container-low">
                  {filteredVentas.map((vnt) => (
                    <tr key={vnt.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-md px-space-md font-mono font-bold text-on-surface">
                        {vnt.numero_remision}
                      </td>
                      <td className="py-space-md px-space-md">
                        <span className="font-label-md text-label-md text-on-surface block font-semibold">
                          {vnt.cliente_nombre}
                        </span>
                        <span className="font-label-sm text-label-sm text-tertiary">
                          {vnt.conductor_nombre} ({vnt.placa_vehiculo})
                        </span>
                      </td>
                      <td className="py-space-md px-space-md font-bold text-on-surface">
                        {vnt.litros} L
                      </td>
                      <td className="py-space-md px-space-md font-bold text-primary">
                        {formatCOP(vnt.total_cop)}
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <button
                          type="button"
                          onClick={() => onToggleEstadoVenta(vnt.id, vnt.estado === 'paid' ? 'pending' : 'paid')}
                          className={`inline-flex items-center gap-1 px-space-md py-1 rounded-full font-label-sm text-label-sm font-bold transition-all ${
                            vnt.estado === 'paid'
                              ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim'
                              : 'bg-error-container text-on-error-container hover:opacity-80'
                          }`}
                          title="Hacer clic para cambiar estado"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {vnt.estado === 'paid' ? 'check' : 'schedule'}
                          </span>
                          <span>{vnt.estado === 'paid' ? 'Pagado' : 'Pendiente'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
