/**
 * Clase de Dominio: Finca
 * Representa la unidad productiva ganadera y su estado de tanque/hato.
 */
export class Finca {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre_finca = data.nombre_finca || 'Hacienda La Pradera';
    this.propietario_nombre = data.propietario_nombre || 'TOMAS GARCIA';
    this.propietario_cedula = data.propietario_cedula || 'CC 71.492.308-4';
    this.telefono = data.telefono || '+57 312 489 9012';
    this.email = data.email || 'carlos.mendoza@lapradera.co';
    this.municipio = data.municipio || 'San Pedro de los Milagros';
    this.departamento = data.departamento || 'Antioquia';
    this.sector = data.sector || 'Sector El Salitre';
    this.codigo_ica = data.codigo_ica || 'ICA Res. 04892';
    this.id_predial = data.id_predial || 'COL-ANT-88210';
    this.capacidad_tanque_litros = Number(data.capacidad_tanque_litros ?? 500);
    this.temperatura_tanque = Number(data.temperatura_tanque ?? 3.8);
    this.total_vacas = Number(data.total_vacas ?? 45);
    this.vacas_en_ordeno = Number(data.vacas_en_ordeno ?? 28);
    this.vacas_horras = Number(data.vacas_horras ?? 12);
    this.terneros = Number(data.terneros ?? 5);
    this.meta_diaria_litros = Number(data.meta_diaria_litros ?? 150);
    this.precio_sugerido_litro = Number(data.precio_sugerido_litro ?? 2200);
  }

  calcularPorcentajeOcupacionTanque(litrosActuales) {
    if (!this.capacidad_tanque_litros || this.capacidad_tanque_litros <= 0) return 0;
    return Math.min(100, Math.round((Number(litrosActuales) / this.capacidad_tanque_litros) * 100));
  }

  calcularCumplimientoMeta(litrosDia) {
    if (!this.meta_diaria_litros || this.meta_diaria_litros <= 0) return 0;
    return Math.min(100, Math.round((Number(litrosDia) / this.meta_diaria_litros) * 100));
  }

  calcularPromedioLitrosPorVaca(litrosDia) {
    if (!this.vacas_en_ordeno || this.vacas_en_ordeno <= 0) return 0;
    return Number((Number(litrosDia) / this.vacas_en_ordeno).toFixed(1));
  }

  toDatabasePayload() {
    return {
      nombre_finca: this.nombre_finca,
      propietario_nombre: this.propietario_nombre,
      propietario_cedula: this.propietario_cedula,
      telefono: this.telefono,
      email: this.email,
      municipio: this.municipio,
      departamento: this.departamento,
      sector: this.sector,
      codigo_ica: this.codigo_ica,
      id_predial: this.id_predial,
      capacidad_tanque_litros: Number(this.capacidad_tanque_litros),
      temperatura_tanque: Number(this.temperatura_tanque),
      total_vacas: Number(this.total_vacas),
      vacas_en_ordeno: Number(this.vacas_en_ordeno),
      vacas_horras: Number(this.vacas_horras),
      terneros: Number(this.terneros),
      meta_diaria_litros: Number(this.meta_diaria_litros),
      precio_sugerido_litro: Number(this.precio_sugerido_litro)
    };
  }
}
