import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Finca, Cliente, RegistroLeche, VentaRemision } from '../models';

const DEFAULT_FINCA = new Finca({
  nombre_finca: 'Hacienda La Pradera',
  propietario_nombre: 'TOMAS GARCIA',
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
});

const DEFAULT_CLIENTES = [
  new Cliente({
    clave_alias: 'san_jeronimo',
    nombre: 'Lácteos San Jerónimo (Ruta Norte)',
    empresa: 'Lácteos San Jerónimo S.A.S.',
    contacto_nombre: 'Don Rodrigo Velásquez',
    telefono: '+57 (310) 455-8291',
    telefono_wa: '573104558291',
    precio_acordado_litro: 2180,
    ruta: 'Ruta Norte'
  }),
  new Cliente({
    clave_alias: 'dona_martha',
    nombre: 'Quesera Doña Martha (Pueblo)',
    empresa: 'Quesos Artesanales Doña Martha',
    contacto_nombre: 'Doña Martha Lucía',
    telefono: '+57 (321) 876-4022',
    telefono_wa: '573218764022',
    precio_acordado_litro: 2200,
    ruta: 'Ruta Centro Urbano'
  }),
  new Cliente({
    clave_alias: 'acopio',
    nombre: 'Acopio Regional CooLeche',
    empresa: 'Cooperativa Lechera Regional',
    contacto_nombre: 'Ing. Javier Ospina',
    telefono: '+57 (300) 998-1244',
    telefono_wa: '573009981244',
    precio_acordado_litro: 2140,
    ruta: 'Ruta Industrial'
  })
];

const DEFAULT_REGISTROS = [
  new RegistroLeche({
    id: 'reg-01',
    fecha: new Date().toISOString().split('T')[0],
    hora: '05:45',
    turno: 'morning',
    litros: 145,
    precio_litro: 2200,
    flete_por_litro: 50,
    tanque_temperatura: 3.4,
    operador: 'Hernán Gómez',
    lote: 'Lote 1',
    vacas_ordenadas: 28
  }),
  new RegistroLeche({
    id: 'reg-02',
    fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    hora: '05:30',
    turno: 'morning',
    litros: 133,
    precio_litro: 2200,
    flete_por_litro: 50,
    tanque_temperatura: 3.5,
    operador: 'Hernán Gómez',
    lote: 'Lote 1',
    vacas_ordenadas: 28
  })
];

const DEFAULT_VENTAS = [
  new VentaRemision({
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
  })
];

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

/**
 * Clase de Servicio: SupabaseService
 * Gestiona la persistencia en PostgreSQL (Supabase) y sincronización local de las entidades POO.
 */
export class SupabaseService {
  static async obtenerFinca() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('fincas').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const instancia = new Finca(data);
          setLocal('finca', instancia);
          return { data: instancia, source: 'supabase' };
        }
      } catch (err) {
        console.warn('Error conectando a Supabase para fincas:', err);
      }
    }
    return { data: new Finca(getLocal('finca', DEFAULT_FINCA)), source: 'local' };
  }

  static async guardarFinca(fincaData) {
    const instancia = new Finca(fincaData);
    setLocal('finca', instancia);
    if (isSupabaseConfigured) {
      try {
        const payload = instancia.toDatabasePayload();
        const { data: existing } = await supabase.from('fincas').select('id').limit(1).maybeSingle();
        if (existing) {
          await supabase.from('fincas').update(payload).eq('id', existing.id);
        } else {
          await supabase.from('fincas').insert([payload]);
        }
        return { success: true, source: 'supabase' };
      } catch (err) {
        console.warn('Fallo guardando finca en Supabase:', err);
        return { success: true, source: 'local_cached' };
      }
    }
    return { success: true, source: 'local' };
  }

  static async listarRegistrosLeche() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('registros_leche')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const list = data.map((r) => new RegistroLeche(r));
          setLocal('registros', list);
          return { data: list, source: 'supabase' };
        }
      } catch (err) {
        console.warn('Error leyendo registros de Supabase:', err);
      }
    }
    return { data: getLocal('registros', DEFAULT_REGISTROS).map((r) => new RegistroLeche(r)), source: 'local' };
  }

  static async registrarOrdeno(registro) {
    const instancia = new RegistroLeche(registro);
    const localList = getLocal('registros', DEFAULT_REGISTROS);
    const nuevoLocal = { ...instancia, id: instancia.id || `reg-${Date.now()}` };
    setLocal('registros', [nuevoLocal, ...localList]);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('registros_leche')
          .insert([instancia.toDatabasePayload()])
          .select();
        if (!error && data && data[0]) {
          return { success: true, data: new RegistroLeche(data[0]), source: 'supabase' };
        }
      } catch (err) {
        console.warn('Error insertando registro en Supabase:', err);
      }
    }
    return { success: true, data: new RegistroLeche(nuevoLocal), source: 'local' };
  }

  static async listarClientes() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('clientes').select('*').order('nombre');
        if (!error && data) {
          const list = data.map((c) => new Cliente(c));
          setLocal('clientes', list);
          return { data: list, source: 'supabase' };
        }
      } catch (err) {
        console.warn('Error leyendo clientes en Supabase:', err);
      }
    }
    return { data: getLocal('clientes', DEFAULT_CLIENTES).map((c) => new Cliente(c)), source: 'local' };
  }

  static async crearCliente(clienteData) {
    const instancia = new Cliente(clienteData);
    const localList = getLocal('clientes', DEFAULT_CLIENTES);
    const nuevoLocal = { ...instancia, id: instancia.id || `cli-${Date.now()}` };
    setLocal('clientes', [...localList, nuevoLocal]);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('clientes')
          .insert([instancia.toDatabasePayload()])
          .select();
        if (!error && data && data[0]) {
          return { success: true, data: new Cliente(data[0]), source: 'supabase' };
        }
      } catch (err) {
        console.warn('Error creando cliente en Supabase:', err);
      }
    }
    return { success: true, data: new Cliente(nuevoLocal), source: 'local' };
  }

  static async eliminarCliente(id) {
    const localList = getLocal('clientes', DEFAULT_CLIENTES).filter((c) => c.id !== id);
    setLocal('clientes', localList);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('clientes').delete().eq('id', id);
      } catch (err) {
        console.warn('Error eliminando cliente en Supabase:', err);
      }
    }
    return { success: true };
  }

  static async listarVentas() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('ventas_remisiones')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const list = data.map((v) => new VentaRemision(v));
          setLocal('ventas', list);
          return { data: list, source: 'supabase' };
        }
      } catch (err) {
        console.warn('Error leyendo ventas en Supabase:', err);
      }
    }
    return { data: getLocal('ventas', DEFAULT_VENTAS).map((v) => new VentaRemision(v)), source: 'local' };
  }

  static async emitirRemision(ventaData) {
    const instancia = new VentaRemision(ventaData);
    const localVentas = getLocal('ventas', DEFAULT_VENTAS);
    const nuevaLocal = { ...instancia, id: instancia.id || `vnt-${Date.now()}` };
    setLocal('ventas', [nuevaLocal, ...localVentas]);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('ventas_remisiones')
          .insert([instancia.toDatabasePayload()])
          .select();
        if (!error && data && data[0]) {
          return { success: true, data: new VentaRemision(data[0]), source: 'supabase' };
        }
      } catch (err) {
        console.warn('Error registrando venta en Supabase:', err);
      }
    }
    return { success: true, data: new VentaRemision(nuevaLocal), source: 'local' };
  }

  static async actualizarEstadoVenta(id, nuevoEstado) {
    const localVentas = getLocal('ventas', DEFAULT_VENTAS);
    const updatedList = localVentas.map((v) => (v.id === id ? { ...v, estado: nuevoEstado } : v));
    setLocal('ventas', updatedList);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('ventas_remisiones').update({ estado: nuevoEstado }).eq('id', id);
      } catch (err) {
        console.warn('Error actualizando venta en Supabase:', err);
      }
    }
    return { success: true };
  }
}

export const getFincaData = () => SupabaseService.obtenerFinca();
export const saveFincaData = (data) => SupabaseService.guardarFinca(data);
export const getRegistrosLeche = () => SupabaseService.listarRegistrosLeche();
export const addRegistroLeche = (data) => SupabaseService.registrarOrdeno(data);
export const getClientes = () => SupabaseService.listarClientes();
export const addCliente = (data) => SupabaseService.crearCliente(data);
export const deleteCliente = (id) => SupabaseService.eliminarCliente(id);
export const getVentas = () => SupabaseService.listarVentas();
export const addVenta = (data) => SupabaseService.emitirRemision(data);
export const updateEstadoVenta = (id, estado) => SupabaseService.actualizarEstadoVenta(id, estado);
