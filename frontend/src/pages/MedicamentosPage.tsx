import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { API_URL } from '../api'

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

        <button
          type="button"
          onClick={() => {
            limpiarFormulario()
            setMostrarFormulario(true)
          }}
        >
          Nuevo medicamento
        </button>
      </header>

      {mostrarFormulario && (
        <form onSubmit={guardarMedicamento}>
          <p>
            <label>
              Nombre
              <br />
              <input
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Descripción
              <br />
              <input
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Precio
              <br />
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={precio}
                onChange={(event) => setPrecio(event.target.value)}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Stock
              <br />
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Laboratorio
              <br />
              <input
                value={laboratorio}
                onChange={(event) => setLaboratorio(event.target.value)}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Fecha de vencimiento
              <br />
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(event) => setFechaVencimiento(event.target.value)}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Categoría
              <br />
              <select
                value={categoriaId}
                onChange={(event) => setCategoriaId(event.target.value)}
                required
              >
                <option value="">Elegí una categoría</option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </label>
          </p>

          <button type="submit">
            {medicamentoEditando ? 'Guardar cambios' : 'Guardar medicamento'}
          </button>

          <button
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar
          </button>
        </form>
      )}

      {cargando && (
        <div className="empty-state">Cargando medicamentos...</div>
      )}

      {!cargando && medicamentos.length === 0 && (
        <div className="empty-state">
          Todavía no hay medicamentos para mostrar.
        </div>
      )}

      {!cargando && medicamentos.length > 0 && (
        <ul>
          {medicamentos.map((medicamento) => (
            <li key={medicamento.id}>
              <strong>{medicamento.nombre}</strong>
              {' — '}
              ${medicamento.precio}
              {' — '}
              Stock: {medicamento.stock}
              {' — '}
              Categoría: {medicamento.categoria.nombre}
              <button
                type="button"
                onClick={() => editarMedicamento(medicamento)}
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  eliminarMedicamento(medicamento.id, medicamento.nombre)
                }
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}