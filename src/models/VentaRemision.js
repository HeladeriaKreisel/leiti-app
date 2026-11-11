/**
 * Clase de Dominio: VentaRemision
 * Representa un despacho comercial de leche hacia un Cliente/Planta.
 */
export class VentaRemision {
  constructor(data = {}) {
    this.id = data.id || null;
    this.numero_remision = data.numero_remision || this.generarNumeroRemision();
    this.cliente_id = data.cliente_id || null;
    this.cliente_nombre = data.cliente_nombre || '';
    this.fecha = data.fecha || new Date().toISOString().split('T')[0];
    this.hora = data.hora || new Date().toTimeString().slice(0, 5);
    this.litros = Number(data.litros ?? 0);
    this.precio_litro = Number(data.precio_litro ?? 2200);
    this.total_cop = Number(data.total_cop ?? this.calcularTotal());
    this.metodo_pago = data.metodo_pago || 'Transferencia Bancaria';
    this.estado = data.estado || 'paid';
    this.conductor_nombre = data.conductor_nombre || 'Transporte Finca';
    this.placa_vehiculo = data.placa_vehiculo || 'TRK-982';
  }

  generarNumeroRemision() {
    return `REM-${String(Math.floor(100 + Math.random() * 900)).padStart(4, '0')}`;
  }

  calcularTotal() {
    return this.litros * this.precio_litro;
  }

  estaPagada() {
    return this.estado === 'paid';
  }

  alternarEstadoPago() {
    this.estado = this.estado === 'paid' ? 'pending' : 'paid';
    return this.estado;
  }

  toDatabasePayload() {
    return {
      numero_remision: this.numero_remision,
      cliente_nombre: this.cliente_nombre,
      fecha: this.fecha,
      hora: this.hora,
      litros: Number(this.litros),
      precio_litro: Number(this.precio_litro),
      total_cop: Number(this.calcularTotal()),
      metodo_pago: this.metodo_pago,
      estado: this.estado,
      conductor_nombre: this.conductor_nombre,
      placa_vehiculo: this.placa_vehiculo
    };
  }
}
