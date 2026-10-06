import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { API_URL } from '../api'
import {
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
type Categoria = {
  id: number
  nombre: string
  descripcion: string | null
}

export function CategoriasPage() {
  // Categorías que llegan desde la API.
  const [categorias, setCategorias] = useState<Categoria[]>([])

  // Campos del formulario.
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')

  // Muestra u oculta el formulario.
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Guarda la categoría que estamos editando.
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)

  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function traerCategorias() {
      try {
        const respuesta = await fetch(`${API_URL}/categorias`)
        const datos = await respuesta.json()

        setCategorias(datos)
      } catch {
        alert('No se pudieron cargar las categorías.')
      } finally {
        setCargando(false)
      }
    }

    void traerCategorias()
  }, [])




    async function guardarCategoria(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nombre.trim()) {
      alert('El nombre es obligatorio.')
      return
    }

    // Si hay una categoría elegida, la edita.
    const url = categoriaEditando
      ? `http://localhost:3000/categorias/${categoriaEditando.id}`
      : 'http://localhost:3000/categorias'

    const metodo = categoriaEditando ? 'PATCH' : 'POST'

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
        }),
      })

      const categoriaGuardada = await respuesta.json()

      if (!respuesta.ok) {
        alert(categoriaGuardada.message)
        return
      }

      if (categoriaEditando) {
        // Cambia la categoría editada.
        setCategorias(
          categorias.map((categoria) =>
            categoria.id === categoriaGuardada.id
              ? categoriaGuardada
              : categoria,
          ),
        )
      } else {
        // Agrega una categoría nueva.
        setCategorias([...categorias, categoriaGuardada])
      }

      setNombre('')
      setDescripcion('')
      setCategoriaEditando(null)
      setMostrarFormulario(false)
    } catch {
      alert('No se pudo guardar la categoría.')
    }
  }



    async function eliminarCategoria(id: number, nombre: string) {
    // Pide confirmación antes de eliminar.
    const confirmar = window.confirm(
      `¿Querés eliminar la categoría "${nombre}"?`,
    )

    if (!confirmar) {
      return
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/categorias/${id}`,
        {
          method: 'DELETE',
        },
      )

      if (!respuesta.ok) {
        alert('No se pudo eliminar la categoría.')
        return
      }

      // Quita la categoría de la pantalla.
      setCategorias(categorias.filter((categoria) => categoria.id !== id))
    } catch {
      alert('No se pudo conectar con la API.')
    }
  }




    function editarCategoria(categoria: Categoria) {
    // Completa el formulario con los datos actuales.
    setCategoriaEditando(categoria)
    setNombre(categoria.nombre)
    setDescripcion(categoria.descripcion || '')
    setMostrarFormulario(true)
  }

    return (
    <section>
      <header className="page-header page-header--row">
        <div>
          <p className="eyebrow">Gestión</p>
          <h1>Categorías</h1>
          <p>Organizá los medicamentos por categoría.</p>
        </div>

        <Button
          variant="contained"
          onClick={() => {
            setCategoriaEditando(null)
            setNombre('')
            setDescripcion('')
            setMostrarFormulario(true)
          }}
        >
          Nueva categoría
        </Button>
      </header>

      {mostrarFormulario && (
        <Box
          component="form"
          onSubmit={guardarCategoria}
          sx={{ display: 'grid', gap: 2, maxWidth: 480, mb: 3 }}
        >
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 100 } }}
            fullWidth
          />

          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained">
              {categoriaEditando ? 'Guardar cambios' : 'Guardar categoría'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}

      {cargando && <Alert severity="info">Cargando categorías...</Alert>}

      {!cargando && categorias.length === 0 && (
        <Alert severity="info">Todavía no hay categorías para mostrar.</Alert>
      )}

      {!cargando && categorias.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.nombre}</TableCell>
                <TableCell>
                  {categoria.descripcion || 'Sin descripción'}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => editarCategoria(categoria)}
                  >
                    Editar
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      eliminarCategoria(categoria.id, categoria.nombre)
                    }
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}