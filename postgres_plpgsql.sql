-- ==============================================================================
-- LEITTI - SISTEMA DE GESTIÓN GANADERA
-- CÓDIGO NATIVO EN LENGUAJE PROCEDURAL DE POSTGRESQL (PL/pgSQL)
-- ==============================================================================
-- Este script utiliza bloques procedurales DO $$ BEGIN ... END $$ y funciones
-- nativas escritas en LANGUAGE plpgsql exclusivas del motor PostgreSQL.
-- ==============================================================================

-- 1. BLOQUE PROCEDURAL PL/pgSQL PARA LA CREACIÓN DE ESTRUCTURAS
DO $$
BEGIN
    -- Activar extensión de UUIDs si no existe
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- TABLA: FINCAS
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

    -- TABLA: REGISTROS_LECHE
    CREATE TABLE IF NOT EXISTS public.registros_leche (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        finca_id UUID REFERENCES public.fincas(id) ON DELETE CASCADE,
        fecha DATE NOT NULL DEFAULT CURRENT_DATE,
        hora TIME NOT NULL DEFAULT CURRENT_TIME,
        turno VARCHAR(20) NOT NULL CHECK (turno IN ('morning', 'afternoon')),
        litros NUMERIC(10,2) NOT NULL CHECK (litros > 0),
        precio_litro NUMERIC(10,2) NOT NULL DEFAULT 2200.00,
        flete_por_litro NUMERIC(10,2) NOT NULL DEFAULT 50.00,
        descuento_flete NUMERIC(10,2) GENERATED ALWAYS AS (litros * flete_por_litro) STORED,
        subtotal_cop NUMERIC(12,2) GENERATED ALWAYS AS (litros * precio_litro) STORED,
        neto_cop NUMERIC(12,2) GENERATED ALWAYS AS ((litros * precio_litro) - (litros * flete_por_litro)) STORED,
        tanque_temperatura NUMERIC(4,1) DEFAULT 3.4,
        operador VARCHAR(100) DEFAULT 'Hernán Gómez',
        lote VARCHAR(50) DEFAULT 'Lote 1',
        vacas_ordeñadas INTEGER DEFAULT 28,
        notas TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- TABLA: CLIENTES
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

    -- TABLA: VENTAS_REMISSIONES
    CREATE TABLE IF NOT EXISTS public.ventas_remisiones (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        numero_remision VARCHAR(50) NOT NULL UNIQUE,
        cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
        cliente_nombre VARCHAR(150) NOT NULL,
        fecha DATE NOT NULL DEFAULT CURRENT_DATE,
        hora TIME NOT NULL DEFAULT CURRENT_TIME,
        litros NUMERIC(10,2) NOT NULL CHECK (litros > 0),
        precio_litro NUMERIC(10,2) NOT NULL,
        total_cop NUMERIC(12,2) NOT NULL,
        metodo_pago VARCHAR(50) DEFAULT 'Transferencia Bancolombia',
        estado VARCHAR(20) DEFAULT 'pending' CHECK (estado IN ('pending', 'paid', 'cancelled')),
        conductor_nombre VARCHAR(100) DEFAULT 'Conductor de Ruta',
        placa_vehiculo VARCHAR(20) DEFAULT 'TRK-982',
        recibo_firmado BOOLEAN DEFAULT false,
        notas TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Habilitar Row Level Security (RLS) nativo de PostgreSQL
    ALTER TABLE public.fincas ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.registros_leche ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.ventas_remisiones ENABLE ROW LEVEL SECURITY;

    RAISE NOTICE 'Estructuras de PostgreSQL creadas exitosamente mediante PL/pgSQL';
END $$;

-- 2. PROCEDIMIENTO ALMACENADO EN LENGUAJE PL/pgSQL: REGISTRAR ORDEÑO
CREATE OR REPLACE FUNCTION public.sp_registrar_ordeno(
    p_turno VARCHAR,
    p_litros NUMERIC,
    p_precio NUMERIC DEFAULT 2200,
    p_operador VARCHAR DEFAULT 'Hernán Gómez',
    p_lote VARCHAR DEFAULT 'Lote 1'
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_id UUID;
    v_resultado JSONB;
BEGIN
    INSERT INTO public.registros_leche (
        turno,
        litros,
        precio_litro,
        operador,
        lote,
        fecha,
        hora
    ) VALUES (
        p_turno,
        p_litros,
        p_precio,
        p_operador,
        p_lote,
        CURRENT_DATE,
        CURRENT_TIME
    )
    RETURNING id INTO v_id;

    SELECT json_build_object(
        'status', 'success',
        'mensaje', 'Ordeño registrado correctamente con PL/pgSQL',
        'registro_id', v_id,
        'litros', p_litros
    )::jsonb INTO v_resultado;

    RETURN v_resultado;
END;
$$;

-- 3. PROCEDIMIENTO ALMACENADO EN LENGUAJE PL/pgSQL: EMITIR REMISIÓN DE VENTA
CREATE OR REPLACE FUNCTION public.sp_emitir_remision(
    p_cliente_nombre VARCHAR,
    p_litros NUMERIC,
    p_precio_litro NUMERIC,
    p_conductor VARCHAR DEFAULT 'Conductor Asignado',
    p_placa VARCHAR DEFAULT 'TRK-000'
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_numero_remision VARCHAR;
    v_total NUMERIC;
    v_resultado JSONB;
BEGIN
    v_numero_remision := 'REM-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    v_total := p_litros * p_precio_litro;

    INSERT INTO public.ventas_remisiones (
        numero_remision,
        cliente_nombre,
        litros,
        precio_litro,
        total_cop,
        conductor_nombre,
        placa_vehiculo,
        fecha,
        hora,
        estado
    ) VALUES (
        v_numero_remision,
        p_cliente_nombre,
        p_litros,
        p_precio_litro,
        v_total,
        p_conductor,
        p_placa,
        CURRENT_DATE,
        CURRENT_TIME,
        'paid'
    );

    SELECT json_build_object(
        'status', 'success',
        'mensaje', 'Remisión creada exitosamente con PL/pgSQL',
        'remision', v_numero_remision,
        'total_cop', v_total
    )::jsonb INTO v_resultado;

    RETURN v_resultado;
END;
$$;

-- 4. PROCEDIMIENTO ALMACENADO EN LENGUAJE PL/pgSQL: OBTENER RESUMEN DE HOY
CREATE OR REPLACE FUNCTION public.sp_obtener_resumen_hoy()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_litros NUMERIC := 0;
    v_total_dinero NUMERIC := 0;
    v_total_ventas NUMERIC := 0;
    v_resultado JSONB;
BEGIN
    SELECT COALESCE(SUM(litros), 0), COALESCE(SUM(neto_cop), 0)
    INTO v_total_litros, v_total_dinero
    FROM public.registros_leche
    WHERE fecha = CURRENT_DATE;

    SELECT COALESCE(SUM(total_cop), 0)
    INTO v_total_ventas
    FROM public.ventas_remisiones
    WHERE fecha = CURRENT_DATE;

    SELECT json_build_object(
        'fecha', CURRENT_DATE,
        'litros_recolectados_hoy', v_total_litros,
        'valor_neto_acumulado_cop', v_total_dinero,
        'ventas_despachadas_cop', v_total_ventas
    )::jsonb INTO v_resultado;

    RETURN v_resultado;
END;
$$;

-- 5. POLÍTICAS DE PERMISO (RLS)
DO $$
BEGIN
    DROP POLICY IF EXISTS "acceso_total_fincas" ON public.fincas;
    DROP POLICY IF EXISTS "acceso_total_registros" ON public.registros_leche;
    DROP POLICY IF EXISTS "acceso_total_clientes" ON public.clientes;
    DROP POLICY IF EXISTS "acceso_total_ventas" ON public.ventas_remisiones;

    CREATE POLICY "acceso_total_fincas" ON public.fincas FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "acceso_total_registros" ON public.registros_leche FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "acceso_total_clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "acceso_total_ventas" ON public.ventas_remisiones FOR ALL USING (true) WITH CHECK (true);
END $$;

-- 6. DATOS INICIALES SEMBRADOS DESDE PL/pgSQL
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.fincas WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef') THEN
        INSERT INTO public.fincas (id, nombre_finca, propietario_nombre, municipio, departamento, capacidad_tanque_litros, temperatura_tanque, total_vacas, vacas_en_ordeno)
        VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Hacienda La Pradera', 'Don Carlos Mendoza', 'San Pedro de los Milagros', 'Antioquia', 500, 3.8, 45, 28);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.clientes WHERE clave_alias = 'san_jeronimo') THEN
        INSERT INTO public.clientes (clave_alias, nombre, contacto_nombre, telefono, telefono_wa, precio_acordado_litro)
        VALUES ('san_jeronimo', 'Lácteos San Jerónimo (Ruta Norte)', 'Don Rodrigo Velásquez', '+57 (310) 455-8291', '573104558291', 2180);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.clientes WHERE clave_alias = 'dona_martha') THEN
        INSERT INTO public.clientes (clave_alias, nombre, contacto_nombre, telefono, telefono_wa, precio_acordado_litro)
        VALUES ('dona_martha', 'Quesera Doña Martha (Pueblo)', 'Doña Martha Lucía', '+57 (321) 876-4022', '573218764022', 2200);
    END IF;

    RAISE NOTICE 'Datos iniciales sembrados con éxito mediante bloques procedurales PL/pgSQL';
END $$;
