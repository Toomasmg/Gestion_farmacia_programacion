# Requisitos del Sistema

## Requisitos funcionales

### RF01 - Gestión de categorías

El sistema debe permitir listar, crear, editar y eliminar categorías de medicamentos.

### RF02 - Validación de categorías

El sistema debe impedir registrar dos categorías con el mismo nombre.

### RF03 - Protección de categorías asociadas

El sistema no debe permitir eliminar una categoría si tiene medicamentos asociados.

### RF04 - Gestión de medicamentos

El sistema debe permitir listar, crear, editar y eliminar medicamentos.

### RF05 - Datos de medicamentos

Cada medicamento debe registrar:

- Nombre.
- Descripción.
- Precio.
- Stock.
- Laboratorio.
- Fecha de vencimiento.
- Categoría.

### RF06 - Categoría obligatoria

Cada medicamento debe estar asociado a una categoría existente.

### RF07 - Gestión de empleados

El sistema debe permitir listar, crear, editar y eliminar empleados.

### RF08 - Datos de empleados

Cada empleado debe registrar:

- Nombre.
- Apellido.
- DNI.
- Correo electrónico.
- Teléfono.
- Cargo.
- Fecha de ingreso.

### RF09 - Validación de empleados

El sistema debe impedir registrar empleados con DNI o correo electrónico repetidos.

### RF10 - Dashboard

El sistema debe mostrar un dashboard con la cantidad de:

- Medicamentos.
- Categorías.
- Empleados.

### RF11 - Advertencia de vencimiento

El sistema debe mostrar medicamentos vencidos y medicamentos que vencen dentro de los próximos 30 días.

## Requisitos técnicos

### RT01 - Frontend

El frontend debe desarrollarse con React, Vite y TypeScript.

### RT02 - Backend

El backend debe desarrollarse con NestJS, TypeScript y TypeORM.

### RT03 - Base de datos

La base de datos debe utilizar MySQL.

### RT04 - Contenedores

MySQL debe ejecutarse mediante Docker Compose.

### RT05 - Persistencia

La base de datos debe utilizar un volumen de Docker para conservar la información al reiniciar el contenedor.

### RT06 - Variables de entorno

Las contraseñas y configuraciones locales deben guardarse en archivos `.env`, excluidos de Git.

### RT07 - API

La API debe documentar sus endpoints en `docs/endpoints.md`.

## Requisitos de instalación

- Node.js 20.19 o superior.
- Docker Desktop.
- Git.
- Conexión a Internet para instalar dependencias con npm.