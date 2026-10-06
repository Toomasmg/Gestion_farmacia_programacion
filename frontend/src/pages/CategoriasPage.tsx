export function CategoriasPage() {
  return (
    <section>
      <header className="page-header page-header--row">
        <div>
          <p className="eyebrow">Gestión</p>
          <h1>Categorías</h1>
          <p>Organizá los medicamentos por categoría.</p>
        </div>

        <button type="button">Nueva categoría</button>
      </header>

      <div className="empty-state">
        Todavía no hay categorías para mostrar.
      </div>
    </section>
  )
}