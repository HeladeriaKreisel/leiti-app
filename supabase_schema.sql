-- ==============================================================================
-- LEITTI - SISTEMA DE GESTIÓN GANADERA Y CONTROL LECHERO
-- SCRIPT SQL PARA SUPABASE (POSTGRESQL)
-- ==============================================================================
-- Instrucciones:
-- 1. Entra a tu proyecto en https://supabase.com
-- 2. Ve al menú lateral "SQL Editor" -> "New query"
-- 3. Pega todo este código y haz clic en "Run" (Ejecutar)
-- ==============================================================================

-- 1. EXTENSIÓN PARA UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: FINCAS (Parámetros y Ficha Técnica del Predio)
CREATE TABLE IF NOT EXISTS public.fincas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_finca VARCHAR(150) NOT NULL DEFAULT 'Hacienda La Pradera',
    propietario_nombre VARCHAR(150) NOT NULL DEFAULT 'Don Carlos Mendoza',
    propietario_cedula VARCHAR(50) DEFAULT 'CC 71.492.308-4',
    telefono VARCHAR(50) DEFAULT '+57 312 489 9012',
    email VARCHAR(100) DEFAULT 'carlos.mendoza@lapradera.co',
    municipio VARCHAR(100) DEFAULT 'San Pedro de los Milagros',
    departamento VARCHAR(100) DEFAULT 'Antioquia',
    sector VARCHAR(100) DEFAULT 'Sector El Salitre',
    codigo_ica VARCHAR(50) DEFAULT 'ICA Res. 04892',
    id_predial VARCHAR(50) DEFAULT 'COL-ANT-88210',
    capacidad_tanque_litros NUMERIC(10,2) DEFAULT 500.00,
    temperatura_tanque NUMERIC(4,1) DEFAULT 3.8,
    tanque_activo BOOLEAN DEFAULT true,
    total_vacas INTEGER DEFAULT 45,
    vacas_en_ordeno INTEGER DEFAULT 28,
    vacas_horras INTEGER DEFAULT 12,
    terneros INTEGER DEFAULT 5,
    meta_diaria_litros NUMERIC(10,2) DEFAULT 150.00,
    precio_sugerido_litro NUMERIC(10,2) DEFAULT 2200.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA: REGISTROS_LECHE (Ordeños y acopio diario)
CREATE TABLE IF NOT EXISTS public.registros_leche (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finca_id UUID REFERENCES public.fincas(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora TIME NOT NULL DEFAULT CURRENT_TIME,
    turno VARCHAR(20) NOT NULL CHECK (turno IN ('morning', 'afternoon')),
    litros NUMERIC NOT NULL CHECK (litros > 0),
    precio_litro NUMERIC NOT NULL DEFAULT 2200.00,
    flete_por_litro NUMERIC NOT NULL DEFAULT 50.00,
    descuento_flete NUMERIC GENERATED ALWAYS AS (litros * flete_por_litro) STORED,
    subtotal_cop NUMERIC GENERATED ALWAYS AS (litros * precio_litro) STORED,
    neto_cop NUMERIC GENERATED ALWAYS AS ((litros * precio_litro) - (litros * flete_por_litro)) STORED,
    tanque_temperatura NUMERIC DEFAULT 3.4,
    operador VARCHAR(100) DEFAULT 'Hernán Gómez',
    lote VARCHAR(50) DEFAULT 'Lote 1',
    vacas_ordeñadas INTEGER DEFAULT 28,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA: CLIENTES (Compradores y plantas receptoras)
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clave_alias VARCHAR(50) UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    empresa VARCHAR(150),
    contacto_nombre VARCHAR(150),
    telefono VARCHAR(50) NOT NULL,
    telefono_wa VARCHAR(50),
    precio_acordado_litro NUMERIC(10,2) NOT NULL DEFAULT 2200.00,
    ruta VARCHAR(100) DEFAULT 'Ruta Principal',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA: VENTAS_REMISSIONES (Control comercial de despachos)
CREATE TABLE IF NOT EXISTS public.ventas_remisiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_remision VARCHAR(50) NOT NULL UNIQUE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    cliente_nombre VARCHAR(150) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora TIME NOT NULL DEFAULT CURRENT_TIME,
    litros NUMERIC NOT NULL CHECK (litros > 0),
    precio_litro NUMERIC NOT NULL,
    total_cop NUMERIC NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'Transferencia Bancolombia',
    estado VARCHAR(20) DEFAULT 'pending' CHECK (estado IN ('pending', 'paid', 'cancelled')),
    conductor_nombre VARCHAR(100) DEFAULT 'Conductor de Ruta',
    placa_vehiculo VARCHAR(20) DEFAULT 'TRK-982',
    recibo_firmado BOOLEAN DEFAULT false,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.fincas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_leche ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas_remisiones ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas previas para evitar duplicados
DROP POLICY IF EXISTS "Permitir lectura publica fincas" ON public.fincas;
DROP POLICY IF EXISTS "Permitir actualizacion fincas" ON public.fincas;
DROP POLICY IF EXISTS "Permitir insercion fincas" ON public.fincas;

DROP POLICY IF EXISTS "Permitir lectura registros_leche" ON public.registros_leche;
DROP POLICY IF EXISTS "Permitir insercion registros_leche" ON public.registros_leche;
DROP POLICY IF EXISTS "Permitir actualizacion registros_leche" ON public.registros_leche;
DROP POLICY IF EXISTS "Permitir eliminacion registros_leche" ON public.registros_leche;

DROP POLICY IF EXISTS "Permitir lectura clientes" ON public.clientes;
DROP POLICY IF EXISTS "Permitir insercion clientes" ON public.clientes;
DROP POLICY IF EXISTS "Permitir actualizacion clientes" ON public.clientes;

DROP POLICY IF EXISTS "Permitir lectura ventas" ON public.ventas_remisiones;
DROP POLICY IF EXISTS "Permitir insercion ventas" ON public.ventas_remisiones;
DROP POLICY IF EXISTS "Permitir actualizacion ventas" ON public.ventas_remisiones;
DROP POLICY IF EXISTS "Permitir eliminacion ventas" ON public.ventas_remisiones;

-- Políticas para permitir acceso público anónimo (o autenticado) a la app de Leitti
CREATE POLICY "Permitir lectura publica fincas" ON public.fincas FOR SELECT USING (true);
CREATE POLICY "Permitir actualizacion fincas" ON public.fincas FOR UPDATE USING (true);
CREATE POLICY "Permitir insercion fincas" ON public.fincas FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura registros_leche" ON public.registros_leche FOR SELECT USING (true);
CREATE POLICY "Permitir insercion registros_leche" ON public.registros_leche FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion registros_leche" ON public.registros_leche FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminacion registros_leche" ON public.registros_leche FOR DELETE USING (true);

CREATE POLICY "Permitir lectura clientes" ON public.clientes FOR SELECT USING (true);
CREATE POLICY "Permitir insercion clientes" ON public.clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion clientes" ON public.clientes FOR UPDATE USING (true);

CREATE POLICY "Permitir lectura ventas" ON public.ventas_remisiones FOR SELECT USING (true);
CREATE POLICY "Permitir insercion ventas" ON public.ventas_remisiones FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion ventas" ON public.ventas_remisiones FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminacion ventas" ON public.ventas_remisiones FOR DELETE USING (true);

-- 7. VISTA: RESUMEN DE ACTIVIDAD DE HOY
CREATE OR REPLACE VIEW public.vista_resumen_hoy AS
SELECT 
    CURRENT_DATE AS fecha,
    COALESCE(SUM(r.litros), 0) AS total_litros_recolectados,
    COALESCE(SUM(r.neto_cop), 0) AS valor_neto_acumulado,
    COUNT(r.id) AS total_ordenos_hoy,
    COALESCE((SELECT SUM(v.litros) FROM public.ventas_remisiones v WHERE v.fecha = CURRENT_DATE), 0) AS litros_despachados_hoy,
    COALESCE((SELECT SUM(v.total_cop) FROM public.ventas_remisiones v WHERE v.fecha = CURRENT_DATE), 0) AS ventas_hoy_cop
FROM public.registros_leche r
WHERE r.fecha = CURRENT_DATE;

-- 8. DATOS INICIALES (SEED DATA)
-- Inserción de la finca principal si no existe
INSERT INTO public.fincas (id, nombre_finca, propietario_nombre, propietario_cedula, telefono, email, municipio, departamento, sector, codigo_ica, id_predial, capacidad_tanque_litros, temperatura_tanque, total_vacas, vacas_en_ordeno)
VALUES (
    'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    'Hacienda La Pradera',
    'Don Carlos Mendoza',
    'CC 71.492.308-4',
    '+57 312 489 9012',
    'carlos.mendoza@lapradera.co',
    'San Pedro de los Milagros',
    'Antioquia',
    'Sector El Salitre',
    'ICA Res. 04892',
    'COL-ANT-88210',
    500,
    3.8,
    45,
    28
) ON CONFLICT (id) DO NOTHING;

-- Inserción de clientes frecuentes
INSERT INTO public.clientes (clave_alias, nombre, empresa, contacto_nombre, telefono, telefono_wa, precio_acordado_litro, ruta)
VALUES
    ('san_jeronimo', 'Lácteos San Jerónimo (Ruta Norte)', 'Lácteos San Jerónimo S.A.S.', 'Don Rodrigo Velásquez', '+57 (310) 455-8291', '573104558291', 2180.00, 'Ruta Norte'),
    ('dona_martha', 'Quesera Doña Martha (Pueblo)', 'Quesos Artesanales Doña Martha', 'Doña Martha Lucía', '+57 (321) 876-4022', '573218764022', 2200.00, 'Ruta Centro Urbano'),
    ('acopio', 'Acopio Regional CooLeche', 'Cooperativa Lechera Regional', 'Ing. Javier Ospina', '+57 (300) 998-1244', '573009981244', 2140.00, 'Ruta Acopio Industrial')
ON CONFLICT (clave_alias) DO UPDATE SET
    precio_acordado_litro = EXCLUDED.precio_acordado_litro,
    telefono = EXCLUDED.telefono;

-- Inserción de registros iniciales de ordeño
INSERT INTO public.registros_leche (finca_id, fecha, turno, litros, precio_litro, flete_por_litro, operador, lote, vacas_ordeñadas)
VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', CURRENT_DATE, 'morning', 145.00, 2200.00, 50.00, 'Hernán Gómez', 'Lote 1', 28),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', CURRENT_DATE - INTERVAL '1 day', 'morning', 133.00, 2200.00, 50.00, 'Hernán Gómez', 'Lote 1', 28),
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', CURRENT_DATE - INTERVAL '1 day', 'afternoon', 115.00, 2200.00, 50.00, 'Hernán Gómez', 'Lote 1', 28)
ON CONFLICT DO NOTHING;

-- Inserción de remisiones de venta iniciales
INSERT INTO public.ventas_remisiones (numero_remision, cliente_nombre, fecha, litros, precio_litro, total_cop, metodo_pago, estado, conductor_nombre, placa_vehiculo)
VALUES
    ('REM-0293', 'Lácteos San Jerónimo (Ruta Norte)', CURRENT_DATE, 120.00, 2180.00, 261600.00, 'Transferencia Bancaria', 'paid', 'Rodrigo Velásquez', 'TRK-982'),
    ('REM-0292', 'Quesera Doña Martha (Pueblo)', CURRENT_DATE - INTERVAL '1 day', 150.00, 2200.00, 330000.00, 'Efectivo contra entrega', 'paid', 'Carlos Soto', 'VAN-441'),
    ('REM-0291', 'Acopio Regional CooLeche', CURRENT_DATE - INTERVAL '2 days', 350.00, 2140.00, 749000.00, 'Transferencia Bancaria', 'paid', 'Hernán Darío', 'CST-109')
ON CONFLICT (numero_remision) DO NOTHING;
