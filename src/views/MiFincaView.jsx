import React, { useState, useEffect } from 'react';

export default function MiFincaView({ finca, onSaveFinca, onNotify }) {
  const [formData, setFormData] = useState({
    nombre_finca: 'Hacienda La Pradera',
    propietario_nombre: 'Don Carlos Mendoza',
    propietario_cedula: 'CC 71.492.308-4',
    telefono: '+57 312 489 9012',
    email: 'carlos.mendoza@lapradera.co',
    municipio: 'San Pedro de los Milagros',
    departamento: 'Antioquia',
    sector: 'Sector El Salitre',
    codigo_ica: 'ICA Res. 04892',
    id_predial: 'COL-ANT-88210',
    capacidad_tanque_litros: 500,
    temperatura_tanque: 3.8,
    total_vacas: 45,
    vacas_en_ordeno: 28,
    vacas_horras: 12,
    terneros: 5,
    meta_diaria_litros: 150,
    precio_sugerido_litro: 2200,
    ...(finca || {})
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (finca) {
      setFormData(prev => ({ ...prev, ...finca }));
    }
  }, [finca]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await onSaveFinca(formData);
    setSaving(false);

    if (res?.success) {
      onNotify('Parámetros Guardados', `Ficha técnica actualizada en ${res.source === 'supabase' ? 'Supabase PostgreSQL' : 'almacenamiento local'}.`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Page Context & Status Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-2xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              Administración y Parámetros Operativos
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-tertiary">ID Predial: {formData.id_predial}</span>
          </div>
          <h1 className="font-display text-display text-on-surface tracking-tight font-extrabold text-[28px] lg:text-[32px]">
            Ficha Técnica de la Finca
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-1">
            Parámetros zootécnicos, infraestructura frigorífica y credenciales sanitarias oficiales para recolección láctea.
          </p>
        </div>

        {/* Active Status Badge */}
        <div className="flex items-center gap-space-md bg-surface-container-lowest px-space-lg py-space-md rounded-xl shadow-xs border border-outline-variant/20 self-start md:self-auto">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-primary animate-ping absolute opacity-75"></span>
            <span className="w-3 h-3 rounded-full bg-primary relative"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-bold">Finca Activa • Supabase Sync</span>
            <span className="font-label-sm text-label-sm text-primary">Tanque encendido • {formData.temperatura_tanque} °C estable</span>
          </div>
          <span className="material-symbols-outlined text-secondary ml-space-xs text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
        </div>
      </div>

      {/* Primary Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
        {/* LEFT COLUMN: Main Form Specifications (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-xl">
            {/* SECTION 1: Datos del Propietario */}
            <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                    Datos del Propietario
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm bg-surface-container-low text-tertiary px-space-sm py-1 rounded-md font-semibold">
                  Titular Registrado
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Nombre Completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="propietario_nombre"
                      value={formData.propietario_nombre}
                      onChange={handleChange}
                      className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md pl-11 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                    />
                    <span className="material-symbols-outlined text-tertiary absolute left-3.5 top-3 text-[20px]">person</span>
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Cédula de Ciudadanía / NIT</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="propietario_cedula"
                      value={formData.propietario_cedula}
                      onChange={handleChange}
                      className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md pl-11 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                    />
                    <span className="material-symbols-outlined text-tertiary absolute left-3.5 top-3 text-[20px]">fingerprint</span>
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Teléfono / WhatsApp</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md pl-11 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                    />
                    <span className="material-symbols-outlined text-tertiary absolute left-3.5 top-3 text-[20px]">call</span>
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md pl-11 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                    />
                    <span className="material-symbols-outlined text-tertiary absolute left-3.5 top-3 text-[20px]">alternate_email</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Ubicación y Territorio */}
            <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">nature</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                    Ubicación y Territorio
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span> ICA Acreditado
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Nombre del Predio</label>
                  <input
                    type="text"
                    name="nombre_finca"
                    value={formData.nombre_finca}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Municipio</label>
                  <input
                    type="text"
                    name="municipio"
                    value={formData.municipio}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Sector / Vereda</label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Código ICA</label>
                  <input
                    type="text"
                    name="codigo_ica"
                    value={formData.codigo_ica}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Capacidad e Inventario */}
            <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">storage</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
                    Infraestructura Frigorífica e Hato
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Capacidad Tanque (L)</label>
                  <input
                    type="number"
                    name="capacidad_tanque_litros"
                    value={formData.capacidad_tanque_litros}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperatura_tanque"
                    value={formData.temperatura_tanque}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-primary"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Meta Diaria (L)</label>
                  <input
                    type="number"
                    name="meta_diaria_litros"
                    value={formData.meta_diaria_litros}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Total Vacas</label>
                  <input
                    type="number"
                    name="total_vacas"
                    value={formData.total_vacas}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">En Ordeño</label>
                  <input
                    type="number"
                    name="vacas_en_ordeno"
                    value={formData.vacas_en_ordeno}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-primary"
                  />
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant font-bold">Precio Sugerido (COP)</label>
                  <input
                    type="number"
                    name="precio_sugerido_litro"
                    value={formData.precio_sugerido_litro}
                    onChange={handleChange}
                    className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="py-space-lg bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-space-sm font-bold disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[22px]">{saving ? 'sync' : 'save'}</span>
              <span>{saving ? 'Guardando en Supabase...' : 'Guardar Ficha Técnica en Supabase'}</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Badges & Certificates */}
        <div className="lg:col-span-5 flex flex-col gap-space-xl">
          <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-[18px]">
              Certificaciones Sanitarias
            </h3>

            <div className="flex flex-col gap-space-sm">
              <div className="p-space-md bg-surface-container-low rounded-xl flex items-center gap-space-md border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary text-[28px]">verified_user</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Hato Libre de Brucelosis</span>
                  <span className="font-label-sm text-label-sm text-tertiary">Vigencia hasta Dic 2026</span>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-low rounded-xl flex items-center gap-space-md border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary text-[28px]">shield</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Hato Libre de Tuberculosis</span>
                  <span className="font-label-sm text-label-sm text-tertiary">Resolución Vigente ICA</span>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-low rounded-xl flex items-center gap-space-md border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary text-[28px]">energy_savings_leaf</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Buenas Prácticas Ganaderas (BPG)</span>
                  <span className="font-label-sm text-label-sm text-tertiary">Inspección aprobada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
