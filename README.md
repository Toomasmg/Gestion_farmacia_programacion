# Sistemas de gestión para farmacia

Trabajo práctico de Programacion III. 

Integrantes: Tomy y Leandro.


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