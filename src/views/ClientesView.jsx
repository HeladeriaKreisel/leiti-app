import React, { useState } from 'react';
import { Cliente } from '../models/Cliente';

export default function ClientesView({ clientes = [], onAddCliente, onDeleteCliente, onNotify }) {
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    contacto_nombre: '',
    telefono: '',
    precio_acordado_litro: 2200,
    ruta: 'Ruta Norte'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const nuevoCliente = new Cliente(form);
    await onAddCliente(nuevoCliente.toDatabasePayload());
    setForm({
      nombre: '',
      empresa: '',
      contacto_nombre: '',
      telefono: '',
      precio_acordado_litro: 2200,
      ruta: 'Ruta Norte'
    });
    if (onNotify) {
      onNotify('Cliente Registrado', `${nuevoCliente.nombre} fue guardado en Supabase.`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface">Directorio de Clientes y Plantas</h1>
          <p className="text-sm text-on-surface-variant">
            Administra los compradores, queseras y cooperativas sincronizados con la tabla <code className="font-mono">clientes</code> en Supabase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-4 leiti-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-on-surface">Nuevo Cliente / Comprador</h2>
          <div>
            <label className="text-xs font-bold uppercase text-on-surface-variant">Nombre Comercial *</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Lácteos El Trébol"
              className="mt-1 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-on-surface-variant">Empresa / Razón Social</label>
            <input
              type="text"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              placeholder="Ej: Inversiones El Trébol S.A.S."
              className="mt-1 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-on-surface-variant">Contacto</label>
              <input
                type="text"
                value={form.contacto_nombre}
                onChange={(e) => setForm({ ...form, contacto_nombre: e.target.value })}
                placeholder="Nombre encargado"
                className="mt-1 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-on-surface-variant">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+57 310..."
                className="mt-1 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-medium"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-on-surface-variant">Precio / L (COP)</label>
              <input
                type="number"
                required
                value={form.precio_acordado_litro}
                onChange={(e) => setForm({ ...form, precio_acordado_litro: Number(e.target.value) })}
                className="mt-1 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-on-surface-variant">Ruta</label>
              <input
                type="text"
                value={form.ruta}
                onChange={(e) => setForm({ ...form, ruta: e.target.value })}
                className="mt-1 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-medium"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 leiti-btn-primary text-sm">
            Guardar Cliente en Supabase
          </button>
        </form>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientes.map((raw) => {
            const c = new Cliente(raw);
            return (
              <div key={c.id || c.clave_alias} className="leiti-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container text-primary mb-1">
                        {c.ruta}
                      </span>
                      <h3 className="font-bold text-base text-on-surface">{c.nombre}</h3>
                      <p className="text-xs text-on-surface-variant">{c.empresa}</p>
                    </div>
                    {onDeleteCliente && c.id && (
                      <button
                        type="button"
                        onClick={() => onDeleteCliente(c.id)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-outline-variant/20 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Contacto:</span>
                      <span className="font-semibold">{c.contacto_nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Teléfono:</span>
                      <span className="font-semibold">{c.telefono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Precio Acordado:</span>
                      <span className="font-extrabold text-primary">
                        ${Number(c.precio_acordado_litro).toLocaleString('es-CO')} / L
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
