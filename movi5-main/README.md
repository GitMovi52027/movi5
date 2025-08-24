# Movi5 - Sistema de Gestión de Rutas y Reservas de Transporte


## Descripción del Proyecto

Movi5 es una plataforma de gestión de rutas y reservas para servicios de transporte público o privado, diseñada para facilitar la administración de rutas, horarios y solicitudes de reserva. El sistema permite a los usuarios buscar rutas disponibles, realizar reservas y a los administradores gestionar el catálogo de rutas, revisar solicitudes y configurar aspectos generales del servicio.

## Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con renderizado del lado del servidor
- **React 19** - Biblioteca para construir interfaces de usuario
- **TailwindCSS 4** - Framework CSS para diseño rápido y responsivo
- **Shadcn UI** - Componentes de UI reutilizables y accesibles
- **Radix UI** - Primitivos de UI accesibles para componentes
- **React Hook Form** - Manejo de formularios con validaciones
- **Zod** - Validación de esquemas de datos
- **Framer Motion** - Animaciones fluidas de UI
- **Sonner** - Notificaciones elegantes

### Backend
- **Next.js API Routes** - API REST integrada
- **NextAuth.js** - Autenticación y autorización
- **Prisma ORM** - ORM para interacción con la base de datos
- **PostgreSQL** - Base de datos relacional (en Neon Tech)
- **bcrypt** - Encriptación segura de contraseñas

## Estructura del Proyecto

- **/app** - Rutas y páginas organizadas por features (App Router de Next.js)
- **/components** - Componentes reutilizables
- **/prisma** - Esquema de base de datos y migraciones
- **/lib** - Utilidades y funciones auxiliares
- **/types** - Definiciones de tipos TypeScript

## Características Principales

- Panel administrativo para gestión de rutas
- Sistema de búsqueda y filtrado de rutas
- Proceso de reserva en múltiples pasos
- Panel de control para administradores
- Informes y estadísticas
- Notificaciones y alertas
- Configuración de webhook para integración con sistemas externos

## Plataformas de Despliegue

- **Vercel** - Hosting y despliegue de la aplicación
- **Neon Tech** - Base de datos PostgreSQL serverless
- **Prisma Data Platform** - Monitoreo y gestión de la base de datos

## Instalación y Desarrollo

### Requisitos previos
- Node.js 20 o superior
- npm, yarn o pnpm

### Configuración local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/movi5.git
cd movi5
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Configura las variables de entorno creando un archivo `.env` en la raíz del proyecto:
```
DATABASE_URL="postgresql://usuario:contraseña@host:port/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-seguro"
```

4. Ejecuta las migraciones de Prisma:
```bash
npx prisma migrate dev
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Guía de Contribución

1. Haz fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añade nueva característica'`)
4. Sube tus cambios (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [incluir tipo de licencia]
