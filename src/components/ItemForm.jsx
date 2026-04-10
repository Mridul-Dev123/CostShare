function ItemForm({ name, price, onNameChange, onPriceChange, onSubmit, isEditing, onCancelEdit }) {
  return (
    <form className="entry-form" onSubmit={onSubmit}>
      <label className="field">
        <span className="field-label">Person</span>
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g. Alice"
        />
      </label>

      <label className="field">
        <span className="field-label">Price or Expression</span>
        <input
          type="text"
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          placeholder="e.g. 120 or 7+45-54+12/3"
        />
      </label>

      <div className="action-stack">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Item' : 'Add Item'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-muted" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ItemForm
