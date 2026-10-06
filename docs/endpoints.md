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
### Cambio en categorías: borrar con medicamentos

`DELETE /categorias/:id` responde **409** si la categoría todavía tiene medicamentos asociados:

```json
{ "message": "No se puede eliminar la categoría porque tiene medicamentos asociados", "error": "Conflict", "statusCode": 409 }
```

## Medicamentos

Campos:

| Campo | Tipo | Reglas |
|-------|------|--------|
| `id` | número | lo genera la API |
| `nombre` | texto | obligatorio, máx. 150 |
| `descripcion` | texto | obligatorio |
| `precio` | **número** | mayor que 0, hasta 2 decimales |
| `stock` | entero | 0 o más |
| `laboratorio` | texto | obligatorio, máx. 100 |
| `fechaVencimiento` | texto `YYYY-MM-DD` | fecha válida |
| `categoriaId` | entero | debe ser una categoría existente |
| `categoria` | objeto | solo en las respuestas, con los datos de la categoría |
| `createdAt`, `updatedAt` | fecha ISO | los genera la API |

| Método | Ruta | Descripción | Respuesta OK |
|--------|------|-------------|--------------|
| GET | `/medicamentos` | Lista todos, ordenados por nombre | 200 + arreglo |
| GET | `/medicamentos/:id` | Devuelve uno | 200 + objeto |
| POST | `/medicamentos` | Crea uno | 201 + objeto creado |
| PATCH | `/medicamentos/:id` | Edita uno o más campos | 200 + objeto actualizado |
| DELETE | `/medicamentos/:id` | Elimina | 204 sin cuerpo |

### Ejemplo: crear

```json
{
  "nombre": "Ibuprofeno 400",
  "descripcion": "Antiinflamatorio",
  "precio": 1250.5,
  "stock": 30,
  "laboratorio": "Bago",
  "fechaVencimiento": "2027-03-15",
  "categoriaId": 3
}
```

### Errores

| Código | Cuándo |
|--------|--------|
| 400 | Validación: campo faltante o inválido, precio no positivo, fecha inválida, propiedad que no existe, o `:id` no numérico |
| 404 | No existe el medicamento, o no existe la `categoriaId` enviada |

Al editar con PATCH **no** hay que enviar `id`, `categoria`, `createdAt` ni `updatedAt`.
