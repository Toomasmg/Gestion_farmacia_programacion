export function EmpleadosPage() {
  return (
    <section>
      <header className="page-header page-header--row">
        <div>
          <p className="eyebrow">Gestión</p>
          <h1>Empleados</h1>
          <p>Administrá los datos del personal de la farmacia.</p>
        </div>

        <button type="button">Nuevo empleado</button>
      </header>

      <div className="empty-state">
        Todavía no hay empleados para mostrar.
      </div>
    </section>
  )
}