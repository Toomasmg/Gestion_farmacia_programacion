import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { API_URL } from '../api'
import {
  Alert,
  Box,
  Button,
  MenuItem,
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
}

type Medicamento = {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  laboratorio: string
  fechaVencimiento: string
  categoria: {
    id: number
    nombre: string
  }
}

export function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [laboratorio, setLaboratorio] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [categoriaId, setCategoriaId] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [medicamentoEditando, setMedicamentoEditando] =
    useState<Medicamento | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function traerDatos() {
      try {
        // Trae medicamentos.
        const respuestaMedicamentos = await fetch(`${API_URL}/medicamentos`)
        const datosMedicamentos = await respuestaMedicamentos.json()

        // Trae categorías para el selector.
        const respuestaCategorias = await fetch(`${API_URL}/categorias`)
        const datosCategorias = await respuestaCategorias.json()

        setMedicamentos(datosMedicamentos)
        setCategorias(datosCategorias)
      } catch {
        alert('No se pudieron cargar los datos.')
      } finally {
        setCargando(false)
      }
    }

    void traerDatos()
  }, [])

    async function guardarMedicamento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Si edita usa PATCH; si crea usa POST.
    const url = medicamentoEditando
      ? `${API_URL}/medicamentos/${medicamentoEditando.id}`
      : `${API_URL}/medicamentos`

    const metodo = medicamentoEditando ? 'PATCH' : 'POST'

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: Number(precio),
          stock: Number(stock),
          laboratorio: laboratorio.trim(),
          fechaVencimiento,
          categoriaId: Number(categoriaId),
        }),
      })

      const medicamentoGuardado = await respuesta.json()

      if (!respuesta.ok) {
        alert(medicamentoGuardado.message)
        return
      }

      if (medicamentoEditando) {
        // Reemplaza el medicamento editado.
        setMedicamentos(
          medicamentos.map((medicamento) =>
            medicamento.id === medicamentoGuardado.id
              ? medicamentoGuardado
              : medicamento,
          ),
        )
      } else {
        // Agrega uno nuevo.
        setMedicamentos([...medicamentos, medicamentoGuardado])
      }

      limpiarFormulario()
    } catch {
      alert('No se pudo guardar el medicamento.')
    }
  }

    async function eliminarMedicamento(id: number, nombre: string) {
        const confirmar = window.confirm(
          `¿Querés eliminar "${nombre}"?`,
        )

        if (!confirmar) {
          return
        }

        await fetch(`${API_URL}/medicamentos/${id}`, {
          method: 'DELETE',
        })

        // Lo quita de la lista.
        setMedicamentos(
          medicamentos.filter((medicamento) => medicamento.id !== id),
        )
      }
  function limpiarFormulario() {
    setNombre('')
    setDescripcion('')
    setPrecio('')
    setStock('')
    setLaboratorio('')
    setFechaVencimiento('')
    setCategoriaId('')
    setMedicamentoEditando(null)
    setMostrarFormulario(false)
  }

  function editarMedicamento(medicamento: Medicamento) {
    // Carga los datos en el formulario.
    setNombre(medicamento.nombre)
    setDescripcion(medicamento.descripcion)
    setPrecio(String(medicamento.precio))
    setStock(String(medicamento.stock))
    setLaboratorio(medicamento.laboratorio)
    setFechaVencimiento(medicamento.fechaVencimiento.slice(0, 10))
    setCategoriaId(String(medicamento.categoria.id))

    setMedicamentoEditando(medicamento)
    setMostrarFormulario(true)
  }


    return (
    <section>
      <header className="page-header page-header--row">
        <div>
          <p className="eyebrow">Gestión</p>
          <h1>Medicamentos</h1>
          <p>Consultá y administrá el stock de la farmacia.</p>
        </div>

        <Button
          variant="contained"
          onClick={() => {
            limpiarFormulario()
            setMostrarFormulario(true)
          }}
        >
          Nuevo medicamento
        </Button>
      </header>

      {mostrarFormulario && (
        <Box
          component="form"
          onSubmit={guardarMedicamento}
          sx={{ display: 'grid', gap: 2, maxWidth: 480, mb: 3 }}
        >
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Precio"
            type="number"
            value={precio}
            onChange={(event) => setPrecio(event.target.value)}
            slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
            required
            fullWidth
          />

          <TextField
            label="Stock"
            type="number"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
            required
            fullWidth
          />

          <TextField
            label="Laboratorio"
            value={laboratorio}
            onChange={(event) => setLaboratorio(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Fecha de vencimiento"
            type="date"
            value={fechaVencimiento}
            onChange={(event) => setFechaVencimiento(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />

          <TextField
            select
            label="Categoría"
            value={categoriaId}
            onChange={(event) => setCategoriaId(event.target.value)}
            required
            fullWidth
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={String(categoria.id)}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained">
              {medicamentoEditando ? 'Guardar cambios' : 'Guardar medicamento'}
            </Button>

            <Button variant="outlined" onClick={limpiarFormulario}>
              Cancelar
            </Button>
          </Box>
        </Box>
      )}

      {cargando && <Alert severity="info">Cargando medicamentos...</Alert>}

      {!cargando && medicamentos.length === 0 && (
        <Alert severity="info">Todavía no hay medicamentos para mostrar.</Alert>
      )}

      {!cargando && medicamentos.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {medicamentos.map((medicamento) => (
              <TableRow key={medicamento.id}>
                <TableCell>{medicamento.nombre}</TableCell>
                <TableCell>${medicamento.precio}</TableCell>
                <TableCell>{medicamento.stock}</TableCell>
                <TableCell>{medicamento.categoria.nombre}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => editarMedicamento(medicamento)}
                  >
                    Editar
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      eliminarMedicamento(medicamento.id, medicamento.nombre)
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