# Diagrama de Clases UML y Arquitectura de React — Leiti.app

Este documento presenta el **Diagrama de Clases UML** y la **Arquitectura en Capas de React** acorde al código fuente del proyecto (`src/models/`, `src/services/`, `src/views/` y `src/components/`).

---

## 1. Diagrama de Clases UML (Acorde al Código)

```mermaid
classDiagram
    direction TB

    class App {
        -string currentTab
        -Finca finca
        -RegistroLeche[] registros
        -Cliente[] clientes
        -VentaRemision[] ventas
        -boolean isSyncing
        -object toast
        +loadData() Promise~boolean~
        +handleSync() Promise~void~
        +handleSaveFinca(datosFinca) Promise~object~
        +handleAddRegistro(nuevoRegistro) Promise~object~
        +handleAddVenta(nuevaVenta) Promise~object~
        +handleToggleEstadoVenta(id, nuevoEstado) Promise~void~
        +handleAddCliente(nuevoCliente) Promise~object~
        +handleDeleteCliente(id) Promise~void~
        +showToast(title, message, type) void
    }

    class SupabaseService {
        <<service>>
        +obtenerFinca() Promise~Finca~
        +guardarFinca(fincaData) Promise~object~
        +listarRegistrosLeche() Promise~RegistroLeche[]~
        +registrarOrdeno(registro) Promise~RegistroLeche~
        +listarClientes() Promise~Cliente[]~
        +crearCliente(clienteData) Promise~Cliente~
        +eliminarCliente(id) Promise~object~
        +listarVentas() Promise~VentaRemision[]~
        +emitirRemision(ventaData) Promise~VentaRemision~
        +actualizarEstadoVenta(id, nuevoEstado) Promise~object~
    }

    class Finca {
        +string id
        +string nombre_finca
        +string propietario_nombre
        +string propietario_cedula
        +string telefono
        +string email
        +string municipio
        +string departamento
        +string sector
        +string codigo_ica
        +string id_predial
        +number capacidad_tanque_litros
        +number temperatura_tanque
        +number total_vacas
        +number vacas_en_ordeno
        +number vacas_horras
        +number terneros
        +number meta_diaria_litros
        +number precio_sugerido_litro
        +calcularPorcentajeOcupacionTanque(litrosActuales) number
        +calcularCumplimientoMeta(litrosDia) number
        +calcularPromedioLitrosPorVaca(litrosDia) number
        +toDatabasePayload() object
    }

    class RegistroLeche {
        +string id
        +string finca_id
        +string fecha
        +string hora
        +string turno
        +number litros
        +number precio_litro
        +number flete_por_litro
        +number tanque_temperatura
        +string operador
        +string lote
        +number vacas_ordenadas
        +number subtotal_cop
        +number descuento_flete
        +number neto_cop
        +calcularSubtotal() number
        +calcularDescuentoFlete() number
        +calcularNeto() number
        +obtenerEtiquetaTurno() string
        +toDatabasePayload() object
    }

    class Cliente {
        +string id
        +string clave_alias
        +string nombre
        +string empresa
        +string contacto_nombre
        +string telefono
        +string telefono_wa
        +number precio_acordado_litro
        +string ruta
        +boolean activo
        +generarAlias(nombre) string
        +normalizarWhatsApp(telefono) string
        +obtenerEnlaceWhatsApp(mensaje) string
        +toDatabasePayload() object
    }

    class VentaRemision {
        +string id
        +string numero_remision
        +string cliente_id
        +string cliente_nombre
        +string fecha
        +string hora
        +number litros
        +number precio_litro
        +number total_cop
        +string metodo_pago
        +string estado
        +string conductor_nombre
        +string placa_vehiculo
        +generarNumeroRemision() string
        +calcularTotal() number
        +estaPagada() boolean
        +alternarEstadoPago() string
        +toDatabasePayload() object
    }

    class DashboardView {
        <<React Component>>
        +props finca, registros, ventas, onNavigate
    }
    class MiFincaView {
        <<React Component>>
        +props finca, onSaveFinca, onNotify
    }
    class LecheDiaView {
        <<React Component>>
        +props finca, registros, onAddRegistro, onNotify
    }
    class VentasView {
        <<React Component>>
        +props clientes, ventas, onAddVenta, onToggleEstadoVenta
    }
    class ClientesView {
        <<React Component>>
        +props clientes, onAddCliente, onDeleteCliente
    }

    App --> SupabaseService : consume API / persistencia
    App *-- DashboardView : renderiza
    App *-- MiFincaView : renderiza
    App *-- LecheDiaView : renderiza
    App *-- VentasView : renderiza
    App *-- ClientesView : renderiza

    SupabaseService ..> Finca : instancia / persiste
    SupabaseService ..> RegistroLeche : instancia / persiste
    SupabaseService ..> Cliente : instancia / persiste
    SupabaseService ..> VentaRemision : instancia / persiste

    Finca "1" *-- "0..*" RegistroLeche : produce ordeños
    Cliente "1" o-- "0..*" VentaRemision : recibe despachos
```

---

## 2. Explicación de las Relaciones del Diagrama

1. **Composición (`Finca "1" *-- "0..*" RegistroLeche`)**:
   - Una `Finca` produce múltiples registros diarios de ordeño (`RegistroLeche`). Cada pesaje pertenece a la unidad productiva y alimenta el nivel del tanque de enfriamiento.
2. **Agregación (`Cliente "1" o-- "0..*" VentaRemision`)**:
   - Un `Cliente` (planta procesadora, quesera o cooperativa) está asociado a cero o muchas remisiones de venta (`VentaRemision`), pero el cliente existe independientemente de si hoy hubo despacho o no.
3. **Dependencia / Servicio (`SupabaseService ..> Modelos`)**:
   - La clase estática `SupabaseService` (`src/services/supabaseService.js`) actúa como capa de acceso a datos (DAO/Repository), transformando las filas JSON de PostgreSQL (Supabase) en instancias de `Finca`, `RegistroLeche`, `Cliente` y `VentaRemision`.
4. **Arquitectura de Componentes en React (`App *-- Views`)**:
   - `App.jsx` centraliza el estado global (`useState`) y el ciclo de vida (`useEffect`), pasando datos y callbacks hacia abajo mediante `props` (flujo de datos unidireccional de React).
