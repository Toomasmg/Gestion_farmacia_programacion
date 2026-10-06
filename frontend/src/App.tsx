import { NavLink, Route, Routes } from 'react-router'
import './App.css'
import { DashboardPage } from './pages/DashboardPage'
import { MedicamentosPage } from './pages/MedicamentosPage'
import { CategoriasPage } from './pages/CategoriasPage'
import { EmpleadosPage } from './pages/EmpleadosPage'

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">+</span>
          <div>
            <strong>Farmacia</strong>
            <span>Gestión</span>
          </div>
        </div>

        <nav className="menu" aria-label="Navegación principal">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/medicamentos">Medicamentos</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
          <NavLink to="/empleados">Empleados</NavLink>
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/medicamentos" element={<MedicamentosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/empleados" element={<EmpleadosPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App