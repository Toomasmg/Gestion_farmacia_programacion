export function DashboardPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h1>Bienvenido a Farmacia Gestión</h1>
          <p>Administrá medicamentos, categorías y empleados desde un solo lugar.</p>
        </div>
      </header>

      <section className="dashboard-cards">
        <article className="summary-card">
          <span>Medicamentos</span>
          <strong>—</strong>
          <p>Disponible al conectar la API.</p>
        </article>

        <article className="summary-card">
          <span>Categorías</span>
          <strong>—</strong>
          <p>Disponible al conectar la API.</p>
        </article>

        <article className="summary-card">
          <span>Empleados</span>
          <strong>—</strong>
          <p>Disponible al conectar la API.</p>
        </article>
      </section>
    </>
  )
}