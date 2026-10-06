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
  Typography,
} from '@mui/material'


type Empleado = {
  id: number
  nombre: string
  apellido: string
  dni: string
  email: string
  telefono: string
  cargo: string
  fechaIngreso: string
}

const empleadoVacio = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  cargo: '',
  fechaIngreso: '',
}

export function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(
    null,
  )

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cargo, setCargo] = useState('')
  const [fechaIngreso, setFechaIngreso] = useState('')

  // Trae los empleados desde el backend.
  async function traerEmpleados() {
    try {
      const respuesta = await fetch(`${API_URL}/empleados`)

      if (!respuesta.ok) {
        throw new Error()
      }

      const datos = await respuesta.json()
      setEmpleados(datos)
    } catch {
      alert('No se pudieron cargar los empleados.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void traerEmpleados()
  }, [])

  // Limpia el formulario.
  function limpiarFormulario() {
    setNombre(empleadoVacio.nombre)
    setApellido(empleadoVacio.apellido)
    setDni(empleadoVacio.dni)
    setEmail(empleadoVacio.email)
    setTelefono(empleadoVacio.telefono)
    setCargo(empleadoVacio.cargo)
    setFechaIngreso(empleadoVacio.fechaIngreso)
    setEmpleadoEditando(null)
  }

  // Abre el formulario para crear.
  function nuevoEmpleado() {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  // Carga los datos del empleado seleccionado.
  function editarEmpleado(empleado: Empleado) {
    setNombre(empleado.nombre)
    setApellido(empleado.apellido)
    setDni(empleado.dni)
    setEmail(empleado.email)
    setTelefono(empleado.telefono)
    setCargo(empleado.cargo)
    setFechaIngreso(empleado.fechaIngreso.slice(0, 10))

    setEmpleadoEditando(empleado)
    setMostrarFormulario(true)
  }

  // Crea o actualiza un empleado.
  async function guardarEmpleado(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const datosEmpleado = {
      nombre,
      apellido,
      dni,
      email,
      telefono,
      cargo,
      fechaIngreso,
    }

    const url = empleadoEditando
      ? `${API_URL}/empleados/${empleadoEditando.id}`
      : `${API_URL}/empleados`

    const metodo = empleadoEditando ? 'PATCH' : 'POST'

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosEmpleado),
      })

      if (!respuesta.ok) {
        const error = await respuesta.json()
        alert(error.message)
        return
      }

      limpiarFormulario()
      setMostrarFormulario(false)
      await traerEmpleados()
    } catch {
      alert('No se pudo guardar el empleado.')
    }
  }

  // Elimina un empleado.
  async function eliminarEmpleado(id: number) {
    const confirmar = confirm('¿Querés eliminar este empleado?')

    if (!confirmar) {
      return
    }

    try {
      const respuesta = await fetch(`${API_URL}/empleados/${id}`, {
        method: 'DELETE',
      })

      if (!respuesta.ok) {
        const error = await respuesta.json()
        alert(error.message)
        return
      }

      await traerEmpleados()
    } catch {
      alert('No se pudo eliminar el empleado.')
    }
  }

    return (
    <section>
      <header className="page-header page-header--row">
        <div>
          <p className="eyebrow">Gestión</p>
          <h1>Empleados</h1>
          <p>Administrá los datos del personal de la farmacia.</p>
        </div>

        <Button variant="contained" onClick={nuevoEmpleado}>
          Nuevo empleado
        </Button>
      </header>

      {mostrarFormulario && (
        <Box
          component="form"
          onSubmit={guardarEmpleado}
          sx={{ display: 'grid', gap: 2, maxWidth: 480, mb: 3 }}
        >
          <Typography variant="h6" component="h2">
            {empleadoEditando ? 'Editar empleado' : 'Nuevo empleado'}
          </Typography>

          <TextField
            label="Nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Apellido"
            value={apellido}
            onChange={(event) => setApellido(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="DNI"
            value={dni}
            onChange={(event) => setDni(event.target.value)}
            helperText="Entre 7 y 9 dígitos, sin puntos"
            required
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Cargo"
            value={cargo}
            onChange={(event) => setCargo(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Fecha de ingreso"
            type="date"
            value={fechaIngreso}
            onChange={(event) => setFechaIngreso(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained">
              {empleadoEditando ? 'Guardar cambios' : 'Crear empleado'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                limpiarFormulario()
                setMostrarFormulario(false)
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}

      {cargando && <Alert severity="info">Cargando empleados...</Alert>}

      {!cargando && empleados.length === 0 && (
        <Alert severity="info">Todavía no hay empleados para mostrar.</Alert>
      )}

      {!cargando && empleados.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre y apellido</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Ingreso</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {empleados.map((empleado) => (
              <TableRow key={empleado.id}>
                <TableCell>
                  {empleado.nombre} {empleado.apellido}
                </TableCell>
                <TableCell>{empleado.dni}</TableCell>
                <TableCell>{empleado.email}</TableCell>
                <TableCell>{empleado.cargo}</TableCell>
                <TableCell>{empleado.fechaIngreso.slice(0, 10)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => editarEmpleado(empleado)}
                  >
                    Editar
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => eliminarEmpleado(empleado.id)}
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