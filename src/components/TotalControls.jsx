function TotalControls({ finalTotal, onFinalTotalChange, onClear, onGeneratePdf }) {
  return (
    <div className="total-input-row">
      <label className="field">
        <span className="field-label">Final Total</span>
        <input
          type="number"
          step="0.01"
          value={finalTotal}
          onChange={(event) => onFinalTotalChange(event.target.value)}
          placeholder="Enter final total"
        />
      </label>
      <div className="total-actions">
        <button type="button" className="btn btn-muted" onClick={onClear}>
          Clear All
        </button>
        <button type="button" className="btn btn-link" onClick={onGeneratePdf}>
          Generate
        </button>
      </div>
    </div>
  )
}

export default TotalControls
