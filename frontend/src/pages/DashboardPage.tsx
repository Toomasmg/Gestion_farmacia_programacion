import { useEffect, useState } from 'react'
import { API_URL } from '../api'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material'


type Categoria = {
  id: number
  nombre: string
}

type Medicamento = {
  id: number
  nombre: string
  stock: number
  fechaVencimiento: string // Llega como "YYYY-MM-DD".
  categoria: Categoria | null
}

type Empleado = {
  id: number
}

// Convierte "YYYY-MM-DD" en una fecha a medianoche local.
// Evita el corrimiento de un día que produce new Date("YYYY-MM-DD").
function crearFecha(texto: string) {
  const [anio, mes, dia] = texto.split('-').map(Number)
  return new Date(anio, mes - 1, dia)
}

export function DashboardPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function traerDatos() {
      try {
        // Pedimos las tres listas juntas.
        const [resCategorias, resMedicamentos, resEmpleados] = await Promise.all([
          fetch(`${API_URL}/categorias`),
          fetch(`${API_URL}/medicamentos`),
          fetch(`${API_URL}/empleados`),
        ])

        if (!resCategorias.ok || !resMedicamentos.ok || !resEmpleados.ok) {
          throw new Error('Respuesta incorrecta de la API')
        }

        setCategorias(await resCategorias.json())
        setMedicamentos(await resMedicamentos.json())
        setEmpleados(await resEmpleados.json())
      } catch {
        setError('No se pudo conectar con el servidor.')
      } finally {
        setCargando(false)
      }
    }
    void traerDatos()
  }, [])

  // Hoy a medianoche y el límite de 30 días.
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const limite = new Date(hoy)
  limite.setDate(limite.getDate() + 30)

  // Vencidos y los que vencen dentro de 30 días, los más urgentes primero.
  const proximos = medicamentos
    .map((medicamento) => ({
      medicamento,
      fecha: crearFecha(medicamento.fechaVencimiento),
    }))
    .filter((item) => item.fecha <= limite)
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())

    if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h1>Bienvenido a Farmacia Gestión</h1>
          <p>Administrá medicamentos, categorías y empleados desde un solo lugar.</p>
        </div>
      </header>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          mb: 4,
        }}
      >
        <Card sx={{ flex: '1 1 180px' }}>
          <CardContent>
            <Typography color="text.secondary">Medicamentos</Typography>
            <Typography variant="h3">{medicamentos.length}</Typography>
            <Typography variant="body2">
              Registrados en el sistema.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 180px' }}>
          <CardContent>
            <Typography color="text.secondary">Categorías</Typography>
            <Typography variant="h3">{categorias.length}</Typography>
            <Typography variant="body2">
              Registradas en el sistema.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 180px' }}>
          <CardContent>
            <Typography color="text.secondary">Empleados</Typography>
            <Typography variant="h3">{empleados.length}</Typography>
            <Typography variant="body2">
              Registrados en el sistema.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <section>
        <h2>Próximos vencimientos</h2>

        {proximos.length === 0 ? (
          <p>No hay medicamentos próximos a vencer.</p>
        ) : (
          <ul>
            {proximos.map(({ medicamento, fecha }) => (
              <li key={medicamento.id}>
                <strong>{medicamento.nombre}</strong>
                {' · '}
                {medicamento.fechaVencimiento}
                {fecha < hoy && ' · Vencido'}
                {' · Stock: '}
                {medicamento.stock}
                {' · '}
                {medicamento.categoria?.nombre ?? 'Sin categoría'}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}