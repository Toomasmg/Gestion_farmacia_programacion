# Sistema de Gestión para Farmacia

Trabajo práctico de Programación III.

**Integrantes:** Tomas Muñoz y Leandro Briceño.

## Descripción

Aplicación web para administrar una farmacia. Permite gestionar categorías, medicamentos y empleados desde una interfaz web conectada a una API y una base de datos MySQL.

También incluye un dashboard con un resumen de la información registrada y una advertencia para medicamentos vencidos o próximos a vencer.

## Tecnologías utilizadas

- Frontend: React, Vite y TypeScript.
- Backend: NestJS, TypeScript y TypeORM.
- Base de datos: MySQL 8.4.
- Contenedores: Docker Compose.
- Control de versiones: Git y GitHub.

## Requisitos previos

Antes de iniciar el proyecto se debe tener instalado:

- Node.js 20.19 o superior.
- Docker Desktop.
- Git.
- Visual Studio Code, recomendado.

Docker Desktop debe estar abierto antes de iniciar la base de datos.

## Estructura del proyecto

```text
Gestion_farmacia_programacion/
├── backend/              # API con NestJS y TypeORM
├── frontend/             # Aplicación web con React
├── docs/
│   └── endpoints.md      # Documentación de la API
├── docker-compose.yml    # Configuración de MySQL
├── .env.example          # Variables de entorno de ejemplo
├── REQUISITOS.md         # Requisitos del sistema
└── README.md
```

## Funcionalidades

### Categorías

- Listar categorías.
- Crear categorías.
- Editar categorías.
- Eliminar categorías.
- Evitar categorías repetidas.
- Impedir eliminar una categoría que tiene medicamentos asociados.

### Medicamentos

- Listar medicamentos.
- Crear medicamentos.
- Editar medicamentos.
- Eliminar medicamentos.
- Asociar cada medicamento a una categoría.
- Registrar precio, stock, laboratorio y fecha de vencimiento.

### Empleados

- Listar empleados.
- Crear empleados.
- Editar empleados.
- Eliminar empleados.
- Validar DNI y correo electrónico únicos.

### Dashboard

- Mostrar la cantidad de medicamentos registrados.
- Mostrar la cantidad de categorías registradas.
- Mostrar la cantidad de empleados registrados.
- Mostrar medicamentos vencidos.
- Mostrar medicamentos que vencen dentro de los próximos 30 días.

## Inicio del proyecto

Abrir tres terminales: una para la base de datos, otra para el backend y otra para el frontend.

### 1. Iniciar MySQL con Docker

Desde la raíz del proyecto:

```bash
cp .env.example .env
```

Abrir el archivo `.env` y reemplazar las contraseñas de ejemplo por contraseñas locales.

Luego iniciar la base de datos:

```bash
docker compose up -d
```

Comprobar que el contenedor está funcionando:

```bash
docker compose ps
```

Ver los últimos mensajes de MySQL:

```bash
docker compose logs --tail=50 mysql
```

El servidor MySQL queda disponible en:

```text
Host: 127.0.0.1
Puerto: 3307
Base de datos: farmacia_db
Usuario: farmacia_user
```

### 2. Iniciar el backend

En otra terminal:

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

El archivo `backend/.env` debe tener la misma contraseña configurada como `MYSQL_PASSWORD` en el archivo `.env` de la raíz.

### 3. Iniciar el frontend

En una tercera terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir en el navegador:

```text
http://localhost:5173
```

## Detener la base de datos

Desde la raíz del proyecto:

```bash
docker compose down
```

Los datos se conservan gracias al volumen de Docker llamado `mysql_data`.

## Pruebas y validación

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

### Backend

```bash
cd backend
npm run build
npm run lint
npm test
```

## Documentación de la API

La documentación de los endpoints está disponible en:

```text
docs/endpoints.md
```

La URL base de la API es:

```text
http://localhost:3000
```

## Flujo de trabajo con Git

- Cada tarea se desarrolla en una rama.
- Las ramas de funcionalidades comienzan con `feature/`.
- Las ramas de documentación comienzan con `docs/`.
- Cada cambio se integra primero a `develop`.
- La rama `main` contiene la versión final del proyecto.

Ejemplo:

```bash
git switch develop
git pull origin develop
git switch -c feature/nombre-de-la-tarea
```

## Variables de entorno

El archivo `.env` contiene contraseñas y configuraciones locales. No se sube a GitHub.

Se debe usar `.env.example` como guía para crear el archivo `.env`.
