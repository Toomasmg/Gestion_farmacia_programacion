export function MedicamentosPage() {
  return (
    <section>
      <header className="page-header page-header--row">
        <div>
          <p className="eyebrow">Gestión</p>
          <h1>Medicamentos</h1>
          <p>Consultá y administrá el stock de la farmacia.</p>
        </div>

        <button type="button">Nuevo medicamento</button>
      </header>

      <div className="empty-state">
        Todavía no hay medicamentos para mostrar.
      </div>
    </section>
  )
}