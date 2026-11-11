/**
 * Clase de Dominio: RegistroLeche
 * Representa un pesaje de ordeño diario (mañana o tarde) y sus cálculos financieros.
 */
export class RegistroLeche {
  constructor(data = {}) {
    this.id = data.id || null;
    this.finca_id = data.finca_id || null;
    this.fecha = data.fecha || new Date().toISOString().split('T')[0];
    this.hora = data.hora || new Date().toTimeString().slice(0, 5);
    this.turno = data.turno || 'morning';
    this.litros = Number(data.litros ?? 0);
    this.precio_litro = Number(data.precio_litro ?? 2200);
    this.flete_por_litro = Number(data.flete_por_litro ?? 50);
    this.tanque_temperatura = Number(data.tanque_temperatura ?? 3.6);
    this.operador = data.operador || 'Hernán Gómez';
    this.lote = data.lote || 'Lote 1';
    this.vacas_ordenadas = Number(data.vacas_ordenadas ?? data.vacas_ordeñadas ?? 28);
    this.subtotal_cop = Number(data.subtotal_cop ?? this.calcularSubtotal());
    this.descuento_flete = Number(data.descuento_flete ?? this.calcularDescuentoFlete());
    this.neto_cop = Number(data.neto_cop ?? this.calcularNeto());
  }

  calcularSubtotal() {
    return this.litros * this.precio_litro;
  }

  calcularDescuentoFlete() {
    return this.litros * this.flete_por_litro;
  }

  calcularNeto() {
    return this.calcularSubtotal() - this.calcularDescuentoFlete();
  }

  obtenerEtiquetaTurno() {
    return this.turno === 'morning' ? 'Mañana (AM)' : 'Tarde (PM)';
  }

  /**
   * Omite columnas generadas (subtotal_cop, descuento_flete, neto_cop) para PostgreSQL.
   */
  toDatabasePayload() {
    return {
      fecha: this.fecha,
      hora: this.hora,
      turno: this.turno,
      litros: Number(this.litros),
      precio_litro: Number(this.precio_litro),
      flete_por_litro: Number(this.flete_por_litro),
      tanque_temperatura: Number(this.tanque_temperatura),
      operador: this.operador,
      lote: this.lote,
      vacas_ordenadas: Number(this.vacas_ordenadas)
    };
  }
}
