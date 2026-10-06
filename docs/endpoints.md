# Endpoints de la API

URL base: `http://localhost:3000`

Todas las peticiones con body usan `Content-Type: application/json`.

## Categorías

Campos: `id`, `nombre` (obligatorio, único, máx. 100), `descripcion` (opcional), `createdAt`, `updatedAt`.

| Método | Ruta | Descripción | Respuesta OK |
|--------|------|-------------|--------------|
| GET | `/categorias` | Lista todas, ordenadas por nombre | 200 + arreglo |
| GET | `/categorias/:id` | Devuelve una | 200 + objeto |
| POST | `/categorias` | Crea una | 201 + objeto creado |
| PATCH | `/categorias/:id` | Edita uno o más campos | 200 + objeto actualizado |
| DELETE | `/categorias/:id` | Elimina | 204 sin cuerpo |

### Ejemplo: crear

```json
{ "nombre": "Analgésicos", "descripcion": "Para el dolor" }
```

Respuesta:

```json
{
  "id": 1,
  "nombre": "Analgésicos",
  "descripcion": "Para el dolor",
  "createdAt": "2026-10-05T22:30:00.000Z",
  "updatedAt": "2026-10-05T22:30:00.000Z"
}
```

### Errores

| Código | Cuándo |
|--------|--------|
| 400 | Falta `nombre`, está vacío, supera 100 caracteres, se envía una propiedad que no existe, o el `:id` no es un número |
| 404 | No existe una categoría con ese `id` |
| 409 | Ya existe una categoría con ese `nombre` |

Los errores 400 devuelven `message` como un **arreglo de textos**. Los 404 y 409 devuelven `message` como un solo texto.

Al editar con PATCH **no** hay que enviar `id`, `createdAt` ni `updatedAt`: la API responde 400.