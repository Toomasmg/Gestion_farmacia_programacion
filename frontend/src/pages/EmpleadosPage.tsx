import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { API_URL } from '../api'

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

        <button type="button" onClick={nuevoEmpleado}>
          Nuevo empleado
        </button>
      </header>

      {mostrarFormulario && (
        <form className="formulario" onSubmit={guardarEmpleado}>
          <h2>
            {empleadoEditando ? 'Editar empleado' : 'Nuevo empleado'}
          </h2>

          <label>
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
            />
          </label>

          <label>
            Apellido
            <input
              type="text"
              value={apellido}
              onChange={(event) => setApellido(event.target.value)}
              required
            />
          </label>

          <label>
            DNI
            <input
              type="text"
              value={dni}
              onChange={(event) => setDni(event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Teléfono
            <input
              type="text"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              required
            />
          </label>

          <label>
            Cargo
            <input
              type="text"
              value={cargo}
              onChange={(event) => setCargo(event.target.value)}
              required
            />
          </label>

          <label>
            Fecha de ingreso
            <input
              type="date"
              value={fechaIngreso}
              onChange={(event) => setFechaIngreso(event.target.value)}
              required
            />
          </label>

          <div className="formulario__acciones">
            <button type="submit">
              {empleadoEditando ? 'Guardar cambios' : 'Crear empleado'}
            </button>

            <button
              type="button"
              onClick={() => {
                limpiarFormulario()
                setMostrarFormulario(false)
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {cargando && (
        <div className="empty-state">Cargando empleados...</div>
      )}

      {!cargando && empleados.length === 0 && (
        <div className="empty-state">
          Todavía no hay empleados para mostrar.
        </div>
      )}

      {!cargando && empleados.length > 0 && (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre y apellido</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>
                    {empleado.nombre} {empleado.apellido}
                  </td>
                  <td>{empleado.dni}</td>
                  <td>{empleado.email}</td>
                  <td>{empleado.cargo}</td>
                  <td>{empleado.fechaIngreso.slice(0, 10)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => editarEmpleado(empleado)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarEmpleado(empleado.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}