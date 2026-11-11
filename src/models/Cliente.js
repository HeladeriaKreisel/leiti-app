/**
 * Clase de Dominio: Cliente
 * Representa un comprador, planta procesadora o centro de acopio de leche.
 */
export class Cliente {
  constructor(data = {}) {
    this.id = data.id || null;
    this.clave_alias = data.clave_alias || this.generarAlias(data.nombre || 'cliente');
    this.nombre = data.nombre || '';
    this.empresa = data.empresa || data.nombre || '';
    this.contacto_nombre = data.contacto_nombre || 'Encargado de Compras';
    this.telefono = data.telefono || '';
    this.telefono_wa = data.telefono_wa || this.normalizarWhatsApp(data.telefono || '');
    this.precio_acordado_litro = Number(data.precio_acordado_litro ?? 2200);
    this.ruta = data.ruta || 'Ruta General';
    this.activo = data.activo !== undefined ? Boolean(data.activo) : true;
  }

  generarAlias(nombre) {
    return (
      nombre
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
        .slice(0, 24) +
      '_' +
      Math.floor(100 + Math.random() * 900)
    );
  }

  normalizarWhatsApp(telefono) {
    const cleanDigits = String(telefono).replace(/\D/g, '');
    if (!cleanDigits) return '573000000000';
    return cleanDigits.startsWith('57') ? cleanDigits : `57${cleanDigits}`;
  }

  obtenerEnlaceWhatsApp(mensaje = '') {
    const texto = encodeURIComponent(
      mensaje || `Hola ${this.contacto_nombre}, te escribo desde Leiti.app sobre el despacho de leche.`
    );
    return `https://wa.me/${this.telefono_wa}?text=${texto}`;
  }

  toDatabasePayload() {
    return {
      clave_alias: this.clave_alias,
      nombre: this.nombre,
      empresa: this.empresa,
      contacto_nombre: this.contacto_nombre,
      telefono: this.telefono,
      telefono_wa: this.telefono_wa,
      precio_acordado_litro: Number(this.precio_acordado_litro),
      ruta: this.ruta,
      activo: this.activo
    };
  }
}
