function ResultsTable({ rows, onEdit, onDelete }) {
  if (rows.length === 0) {
    return <p className="empty-state">No items added yet.</p>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Person</th>
            <th>Price</th>
            <th>Final Product</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.name}-${index}`}>
              <td data-label="Person">{row.name}</td>
              <td data-label="Price">{row.price.toFixed(2)}</td>
              <td data-label="Final Product">{row.finalShare === null ? '-' : row.finalShare.toFixed(2)}</td>
              <td data-label="Actions" className="actions-cell">
                <button type="button" className="btn btn-link" onClick={() => onEdit(index)}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={() => onDelete(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultsTable
