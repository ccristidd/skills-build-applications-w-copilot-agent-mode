function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  if (typeof value === 'object') {
    return value.name ?? value.email ?? value._id ?? value.id ?? JSON.stringify(value)
  }
  return String(value)
}

function ResourceTable({ title, description, columns, records, loading, error }) {
  return (
    <section aria-labelledby="resource-title">
      <div className="mb-4">
        <p className="text-uppercase fw-semibold small text-primary mb-1">OctoFit Tracker</p>
        <h1 className="h2 mb-2" id="resource-title">{title}</h1>
        <p className="text-body-secondary">{description}</p>
      </div>

      {loading && (
        <div className="alert alert-info" role="status">
          Loading {title.toLowerCase()}…
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          Could not load {title.toLowerCase()}: {error}
        </div>
      )}
      {!loading && !error && records.length === 0 && (
        <div className="alert alert-light border" role="status">
          No {title.toLowerCase()} to show yet.
        </div>
      )}
      {!loading && !error && records.length > 0 && (
        <div className="table-responsive rounded-3 border bg-white">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record._id ?? record.id ?? index}>
                  {columns.map((column) => (
                    <td key={column.key}>{displayValue(record[column.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ResourceTable
