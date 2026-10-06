# Sistemas de gestión para farmacia

Trabajo práctico de Programacion III. 

Integrantes: Tomy y Leandro.

## Tecnologías

- Backend: NestJS + TypeScript + TypeORM
- Frontend: React + Vite + TypeScript
- Base de datos: MySQL 8.4 con Docker Compose

## Requisitos

- Node.js 20.19 o superior
- Docker Desktop
- Git

## Orden para ejecutar el proyecto

1. Levantar MySQL (sección siguiente).
2. Levantar el backend.
3. Levantar el frontend.

## Base de datos con Docker

Requisito: Docker Desktop instalado y en ejecución.

Desde la raíz del repositorio, copiar la configuración de ejemplo:

```bash
cp .env.example .env
```

Editar `.env` y reemplazar las contraseñas de ejemplo antes del primer inicio. Este archivo es local y no debe subirse a Git.

Validar e iniciar MySQL:

```bash
docker compose config --quiet
docker compose up -d
```

Comprobar el estado y los logs:

```bash
docker compose ps
docker compose logs --tail=50 mysql
```

Esperar a que MySQL indique `ready for connections`.

Conectarse para comprobar la base:

```bash
docker compose exec mysql mysql -h 127.0.0.1 -u farmacia_user -p farmacia_db
```

Ingresar la contraseña definida en `MYSQL_PASSWORD` y ejecutar:

```sql
SELECT DATABASE(), CURRENT_USER(), VERSION();
exit;
```

Para conectar el backend ejecutado directamente en la computadora:

- Host: `127.0.0.1`.
- Puerto: `3307`, salvo que se modifique `MYSQL_PORT`.
- Base: `farmacia_db`.
- Usuario: `farmacia_user`.
- Contraseña: el valor local de `MYSQL_PASSWORD`.

Detener y eliminar el contenedor conservando los datos:

```bash
docker compose down
```

Los datos permanecen en el volumen `mysql_data`. No agregar `-v` al comando anterior: esa opción elimina el volumen.

Las variables que crean la base, el usuario y las contraseñas se aplican durante la primera inicialización. Cambiar el archivo `.env` después no modifica automáticamente las credenciales de una base ya existente.

Cada integrante ejecuta su propia base local; los datos no se sincronizan mediante GitHub.

## Backend

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env` y reemplazar `DB_PASSWORD` por la contraseña de `farmacia_user` (el mismo valor de `MYSQL_PASSWORD` del `.env` de la raíz). Luego:

```bash
npm install
npm run start:dev
```

La API queda en `http://localhost:3000`. Las tablas se crean solas al arrancar (`synchronize` está activado solo para desarrollo).

## Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

## Pruebas del backend

```bash
cd backend
npm test
```

## Documentación de la API

Los endpoints de categorías, medicamentos y empleados están en [`docs/endpoints.md`](docs/endpoints.md).

## Flujo de trabajo en Git

- Cada tarea nace desde `develop`, en una rama `feature/...`, `fix/...`, `chore/...` o `docs/...`.
- Se abre un pull request con destino a `develop` y se revisa antes de integrar.
- `main` recibe cambios solo al final, con la versión comprobada para la entrega.