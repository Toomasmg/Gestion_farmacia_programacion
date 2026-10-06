import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

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
        const respuesta = await fetch('http://localhost:3000/categorias')
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

        <button
          type="button"
          onClick={() => {
            setCategoriaEditando(null)
            setNombre('')
            setDescripcion('')
            setMostrarFormulario(true)
          }}
        >
          Nueva categoría
        </button>
      </header>

      {mostrarFormulario && (
        <form onSubmit={guardarCategoria}>
          <p>
            <label>
              Nombre
              <br />
              <input
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                maxLength={100}
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
              />
            </label>
          </p>

          <button type="submit">
            {categoriaEditando ? 'Guardar cambios' : 'Guardar categoría'}
          </button>

          <button
            type="button"
            onClick={() => setMostrarFormulario(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      {cargando && (
        <div className="empty-state">Cargando categorías...</div>
      )}

      {!cargando && categorias.length === 0 && (
        <div className="empty-state">
          Todavía no hay categorías para mostrar.
        </div>
      )}

      {!cargando && categorias.length > 0 && (
        <ul>
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <strong>{categoria.nombre}</strong>
              {' — '}
              {categoria.descripcion || 'Sin descripción'}

            <button
              type="button"
              onClick={() => editarCategoria(categoria)}
            >
              Editar
            </button>

              <button
                type="button"
                onClick={() => eliminarCategoria(categoria.id, categoria.nombre)}
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
