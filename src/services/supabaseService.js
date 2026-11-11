import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Datos por defecto (Seed inicial local para cuando no hay conexión a Supabase)
const DEFAULT_FINCA = {
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
  precio_sugerido_litro: 2200
};

const DEFAULT_CLIENTES = [
  {
    clave_alias: 'san_jeronimo',
    nombre: 'Lácteos San Jerónimo (Ruta Norte)',
    empresa: 'Lácteos San Jerónimo S.A.S.',
    contacto_nombre: 'Don Rodrigo Velásquez',
    telefono: '+57 (310) 455-8291',
    telefono_wa: '573104558291',
    precio_acordado_litro: 2180,
    ruta: 'Ruta Norte'
  },
  {
    clave_alias: 'dona_martha',
    nombre: 'Quesera Doña Martha (Pueblo)',
    empresa: 'Quesos Artesanales Doña Martha',
    contacto_nombre: 'Doña Martha Lucía',
    telefono: '+57 (321) 876-4022',
    telefono_wa: '573218764022',
    precio_acordado_litro: 2200,
    ruta: 'Ruta Centro Urbano'
  },
  {
    clave_alias: 'acopio',
    nombre: 'Acopio Regional CooLeche',
    empresa: 'Cooperativa Lechera Regional',
    contacto_nombre: 'Ing. Javier Ospina',
    telefono: '+57 (300) 998-1244',
    telefono_wa: '573009981244',
    precio_acordado_litro: 2140,
    ruta: 'Ruta Industrial'
  }
];

const DEFAULT_REGISTROS = [
  {
    id: 'reg-01',
    fecha: new Date().toISOString().split('T')[0],
    hora: '05:45',
    turno: 'morning',
    litros: 145,
    precio_litro: 2200,
    flete_por_litro: 50,
    subtotal_cop: 319000,
    neto_cop: 311750,
    tanque_temperatura: 3.4,
    operador: 'Hernán Gómez',
    lote: 'Lote 1',
    vacas_ordeñadas: 28
  },
  {
    id: 'reg-02',
    fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    hora: '05:30',
    turno: 'morning',
    litros: 133,
    precio_litro: 2200,
    flete_por_litro: 50,
    subtotal_cop: 292600,
    neto_cop: 285950,
    tanque_temperatura: 3.5,
    operador: 'Hernán Gómez',
    lote: 'Lote 1',
    vacas_ordeñadas: 28
  }
];

const DEFAULT_VENTAS = [
  {
    id: 'vnt-01',
    numero_remision: 'REM-0294',
    cliente_nombre: 'Lácteos San Jerónimo (Ruta Norte)',
    fecha: new Date().toISOString().split('T')[0],
    hora: '07:15',
    litros: 120,
    precio_litro: 2180,
    total_cop: 261600,
    metodo_pago: 'Transferencia Bancaria',
    estado: 'paid',
    conductor_nombre: 'Rodrigo Velásquez',
    placa_vehiculo: 'TRK-982'
  },
  {
    id: 'vnt-02',
    numero_remision: 'REM-0293',
    cliente_nombre: 'Quesera Doña Martha (Pueblo)',
    fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    hora: '08:00',
    litros: 150,
    precio_litro: 2200,
    total_cop: 330000,
    metodo_pago: 'Efectivo contra entrega',
    estado: 'paid',
    conductor_nombre: 'Carlos Soto',
    placa_vehiculo: 'VAN-441'
  },
  {
    id: 'vnt-03',
    numero_remision: 'REM-0292',
    cliente_nombre: 'Acopio Regional CooLeche',
    fecha: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    hora: '06:30',
    litros: 350,
    precio_litro: 2140,
    total_cop: 749000,
    metodo_pago: 'Transferencia Bancolombia',
    estado: 'pending',
    conductor_nombre: 'Hernán Darío',
    placa_vehiculo: 'CST-109'
  }
];

// Helper para localStorage
function getLocal(key, fallback) {
  try {
    const val = localStorage.getItem(`leitti_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal(key, data) {
  try {
    localStorage.setItem(`leitti_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error guardando en localStorage', e);
  }
}

// ==========================================
// 1. SERVICIOS DE FINCA
// ==========================================
export async function getFincaData() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('fincas')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setLocal('finca', data);
        return { data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Error conectando a Supabase para fincas, usando local:', err);
    }
  }
  return { data: getLocal('finca', DEFAULT_FINCA), source: 'local' };
}

export async function saveFincaData(fincaData) {
  setLocal('finca', fincaData);
  if (isSupabaseConfigured) {
    try {
      const { data: existing } = await supabase.from('fincas').select('id').limit(1).maybeSingle();
      if (existing) {
        await supabase.from('fincas').update(fincaData).eq('id', existing.id);
      } else {
        await supabase.from('fincas').insert([fincaData]);
      }
      return { success: true, source: 'supabase' };
    } catch (err) {
      console.warn('Fallo guardando en Supabase:', err);
      return { success: true, source: 'local_cached' };
    }
  }
  return { success: true, source: 'local' };
}

// ==========================================
// 2. SERVICIOS DE REGISTROS DE LECHE
// ==========================================
export async function getRegistrosLeche() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('registros_leche')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setLocal('registros', data);
        return { data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Error leyendo registros de Supabase:', err);
    }
  }
  return { data: getLocal('registros', DEFAULT_REGISTROS), source: 'local' };
}

export async function addRegistroLeche(registro) {
  const localList = getLocal('registros', DEFAULT_REGISTROS);
  const nuevoRegistro = {
    ...registro,
    id: registro.id || `reg-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  const updatedList = [nuevoRegistro, ...localList];
  setLocal('registros', updatedList);

  if (isSupabaseConfigured) {
    try {
      const { id, created_at, subtotal_cop, neto_cop, descuento_flete, ...dbPayload } = registro;
      const { data, error } = await supabase
        .from('registros_leche')
        .insert([dbPayload])
        .select();

      if (!error && data) {
        return { success: true, data: data[0], source: 'supabase' };
      }
    } catch (err) {
      console.warn('Error insertando registro en Supabase:', err);
    }
  }
  return { success: true, data: nuevoRegistro, source: 'local' };
}

// ==========================================
// 3. SERVICIOS DE CLIENTES
// ==========================================
export async function getClientes() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre');

      if (!error && data && data.length > 0) {
        setLocal('clientes', data);
        return { data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Error leyendo clientes en Supabase:', err);
    }
  }
  return { data: getLocal('clientes', DEFAULT_CLIENTES), source: 'local' };
}

// ==========================================
// 4. SERVICIOS DE VENTAS / REMISIONES
// ==========================================
export async function getVentas() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('ventas_remisiones')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setLocal('ventas', data);
        return { data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Error leyendo ventas en Supabase:', err);
    }
  }
  return { data: getLocal('ventas', DEFAULT_VENTAS), source: 'local' };
}

export async function addVenta(venta) {
  const localVentas = getLocal('ventas', DEFAULT_VENTAS);
  const nuevaVenta = {
    ...venta,
    id: venta.id || `vnt-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  const updatedList = [nuevaVenta, ...localVentas];
  setLocal('ventas', updatedList);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('ventas_remisiones')
        .insert([venta])
        .select();

      if (!error && data) {
        return { success: true, data: data[0], source: 'supabase' };
      }
    } catch (err) {
      console.warn('Error registrando venta en Supabase:', err);
    }
  }
  return { success: true, data: nuevaVenta, source: 'local' };
}

export async function updateEstadoVenta(id, nuevoEstado) {
  const localVentas = getLocal('ventas', DEFAULT_VENTAS);
  const updatedList = localVentas.map(v => v.id === id ? { ...v, estado: nuevoEstado } : v);
  setLocal('ventas', updatedList);

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('ventas_remisiones')
        .update({ estado: nuevoEstado })
        .eq('id', id);
    } catch (err) {
      console.warn('Error actualizando venta en Supabase:', err);
    }
  }
  return { success: true };
}
