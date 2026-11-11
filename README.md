# Leitti - Sistema de Gestión Ganadera & Control Lechero

Este proyecto integra el diseño visual exportado de la IA (desde el archivo ZIP `stitch_redise_o_interfaz_verde_claro.zip`) con **React**, **JavaScript**, **Tailwind CSS** y **Supabase** (PostgreSQL).

---

## 🚀 1. Estructura del Proyecto

- `supabase_schema.sql`: Script completo de base de datos en **PostgreSQL** para Supabase con tablas, relaciones, vistas, políticas de seguridad (RLS) y datos iniciales.
- `app.html`: Aplicación React completa ejecutable al instante con doble clic en cualquier navegador.
- `iniciar_servidor.bat`: Lanzador de servidor local en un solo clic (usa PowerShell en el puerto `3000`).
- `servidor.ps1`: Servidor HTTP local nativo para Windows.
- `src/`:
  - `lib/supabase.js`: Conexión y configuración del cliente Supabase.
  - `services/supabaseService.js`: Funciones de lectura/escritura (fincas, registros de leche, clientes, ventas y remisiones).
  - `views/`:
    - `DashboardView.jsx`: Dashboard general con KPIs, tanque de enfriamiento en tiempo real, gráfico de barras semanal y bitácora.
    - `LecheDiaView.jsx`: Registro de ordeño matutino/vespertino, botones de incremento rápido (+10, +25, +50, +100 L), cálculo de fletes y neto.
    - `MiFincaView.jsx`: Ficha técnica del ganadero, código ICA, capacidad de tanques e inventario de vacas.
    - `VentasView.jsx`: Control comercial, emisión de remisiones, enlace directo a WhatsApp del comprador y control de pagos.
  - `components/`:
    - `Sidebar.jsx`: Menú lateral de navegación con estado del predio y de Supabase.
    - `Header.jsx`: Barra superior con fecha, filtros y botón de sincronización.
    - `Toast.jsx`: Notificaciones flotantes de éxito y alerta.
- `.env.example` y `.env`: Variables de entorno para conectar tus credenciales de Supabase.

---

## 🛠️ 2. ¿Qué tienes que ir haciendo en Supabase? (Paso a Paso)

Sigue estos 4 sencillos pasos para dejar tu base de datos PostgreSQL conectada:

### Paso 1: Crear el proyecto en Supabase
1. Entra a [https://supabase.com](https://supabase.com) e inicia sesión o regístrate gratis.
2. Haz clic en **"New Project"** (Nuevo proyecto).
3. Elige un nombre para tu proyecto (ejemplo: `Leitti-Ganaderia`), asigna una contraseña de base de datos segura y selecciona tu región más cercana.

### Paso 2: Crear las tablas y datos en PostgreSQL
1. En el menú lateral izquierdo de Supabase, entra a **"SQL Editor"** (icono de terminal/código).
2. Haz clic en **"New query"** (Nueva consulta).
3. Abre el archivo `supabase_schema.sql` que creamos en esta carpeta, copia todo su contenido y pégalo en el editor de Supabase.
4. Haz clic en el botón verde **"Run"** (o presiona `Ctrl + Enter`).
   - ¡Listo! Se crearán automáticamente las tablas: `fincas`, `registros_leche`, `clientes`, `ventas_remisiones`, la vista de resumen y los datos iniciales.

### Paso 3: Obtener tus claves de conexión
1. En el menú lateral de Supabase, ve al icono de engranaje **"Project Settings"** (Configuración del proyecto).
2. Haz clic en la sección **"API"**.
3. Copia dos valores:
   - **Project URL** (ejemplo: `https://xyzcompany.supabase.co`)
   - **Project API Keys -> anon / public** (la clave que empieza por `eyJ...`)

### Paso 4: Configurar tus credenciales
Abre el archivo `.env` en la raíz del proyecto y pega tus datos:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

---

## 🖥️ 3. Cómo Ejecutar el Proyecto

Tienes dos formas muy fáciles de correr tu proyecto:

### Opción A: Inmediata (Sin instalar Node.js ni nada adicional)
1. Haz doble clic en el archivo **`iniciar_servidor.bat`** (o haz doble clic directamente sobre **`app.html`**).
2. Se abrirá automáticamente tu navegador en `http://localhost:3000/app.html` con toda la aplicación React funcionando, con reactividad en vivo, cálculos automáticos y lista para conectar.

### Opción B: Con Vite / Node.js
Si tienes Node.js instalado:
```bash
npm install
npm run dev
```
Tu aplicación correrá en `http://localhost:5173`.
