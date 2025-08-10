# Gamma Clients - Dashboard de Usuarios

Una aplicación moderna de gestión de usuarios con interfaz elegante y funcional, construida con React, Vite, Tailwind CSS y Supabase.

## Características

- **Autenticación con Supabase**: Sistema de login seguro con email y password
- **Autorización por roles**: Acceso diferenciado para administradores y usuarios
- **Login elegante**: Pantalla de inicio de sesión con diseño moderno y minimalista
- **Dashboard completo**: Listado de usuarios con DataTable interactivo
- **Layout Theme**: Sistema de layout reutilizable con header y sidebar
- **Diseño responsivo**: Adaptado para diferentes tamaños de pantalla
- **Navegación intuitiva**: Sidebar simplificado con menú de navegación
- **Filtros y búsqueda**: Funcionalidades avanzadas de filtrado
- **Estadísticas**: Tarjetas de resumen con métricas importantes

## Tecnologías utilizadas

- React 19
- Vite
- React Router
- React Data Table Component
- Tailwind CSS
- Lucide React (iconos)
- Supabase (autenticación y base de datos)

## Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Configura la tabla `profiles` en Supabase con la siguiente estructura:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  lastname TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno (ver sección de Supabase)

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## Estructura del proyecto

```
src/
├── components/
│   ├── Layout.jsx           # Layout principal con header y sidebar
│   ├── ProtectedRoute.jsx   # Componente para rutas protegidas
│   ├── UsersContent.jsx     # Contenido de la página de usuarios
│   ├── cardWidget.jsx       # Componente para las tarjetas de estadísticas
│   ├── header.jsx           # Header del dashboard
│   ├── Sidebar.jsx          # Barra lateral de navegación
│   └── UsersTable.jsx       # Tabla de usuarios con DataTable
├── contexts/
│   └── AuthContext.jsx      # Contexto de autenticación
├── lib/
│   └── supabase.js          # Configuración de Supabase
├── screens/
│   ├── Login/
│   │   └── Login.jsx        # Pantalla de login
│   ├── Users/
│   │   └── UsersList.jsx    # Listado de usuarios (solo admin)
│   └── Dashboard/
│       └── Dashboard.jsx    # Dashboard para usuarios normales
├── routes/
│   └── routes.js            # Configuración de rutas protegidas
├── App.jsx                  # Componente principal con AuthProvider
└── index.css                # Estilos globales
```

## Rutas disponibles

- `/` - Pantalla de login
- `/users` - Listado de usuarios (solo administradores)
- `/dashboard` - Dashboard con estadísticas (usuarios normales)

## Sistema de Autenticación

### Roles de Usuario
- **Admin**: Acceso completo a la lista de usuarios
- **User**: Acceso al dashboard con estadísticas

### Flujo de Autenticación
1. Usuario ingresa email y password
2. Supabase valida las credenciales
3. Se obtiene el perfil del usuario desde la tabla `profiles`
4. Se redirige según el rol:
   - Admin → `/users`
   - User → `/dashboard`

## Funcionalidades

### Login
- Formulario de autenticación con validación
- Campos de email y contraseña con iconos
- Toggle para mostrar/ocultar contraseña
- Manejo de errores de autenticación
- Redirección automática según rol

### Dashboard de Usuarios (Solo Admin)
- **Layout Theme**: Sistema de layout reutilizable
- **Sidebar simplificado**: Solo incluye la opción "Users"
- **Header**: Con información del usuario y botón de logout
- **Widgets de estadísticas**: 
  - Total Usuarios
  - Usuarios Activos
  - Usuarios Inactivos
  - Administradores
- **Tabla de usuarios** con:
  - Avatares de usuarios
  - Información de contacto
  - Roles y estados con badges de colores
  - Fechas de último acceso
  - Acciones (ver, editar, eliminar)
- Filtros y búsqueda
- Paginación

### Dashboard General (Usuarios Normales)
- **Widgets de estadísticas**:
  - Total General
  - Ingresos
  - Gastos
  - Transacciones
- **Lista de transacciones** con:
  - Iconos diferenciados por tipo
  - Montos con formato de moneda
  - Descripción de cada transacción

## Componentes

### AuthContext
Contexto de autenticación que proporciona:
- Estado del usuario autenticado
- Perfil del usuario desde Supabase
- Funciones de login y logout
- Verificación de roles
- Estado de carga

### ProtectedRoute
Componente para proteger rutas:
- Verifica autenticación
- Verifica roles específicos
- Redirección automática
- Pantalla de carga

### Layout
Componente principal que proporciona la estructura base:
- Header con navegación y logout
- Sidebar con menú
- Área de contenido dinámico
- Sin márgenes innecesarios

### UsersContent
Contenido específico de la página de usuarios:
- Widgets de estadísticas
- Tabla de usuarios
- Configuración de datos

### Dashboard
Dashboard para usuarios normales:
- Widgets de montos y transacciones
- Lista de transacciones recientes
- Cálculos automáticos de totales

## Personalización

### Variables de Entorno
Configura las variables de Supabase en el archivo `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Colores
Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... más variantes
      }
    }
  }
}
```

### Datos
Los datos de ejemplo se encuentran en los componentes correspondientes. Para usar datos reales:

1. Configura las tablas en Supabase
2. Actualiza las consultas en los componentes
3. Ajusta la estructura de datos según tus necesidades

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Seguridad

- **Row Level Security (RLS)** habilitado en Supabase
- **Rutas protegidas** con verificación de roles
- **Autenticación centralizada** con contexto
- **Redirección automática** según permisos

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
