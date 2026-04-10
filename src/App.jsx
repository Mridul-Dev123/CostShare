import { useEffect, useState } from 'react'
import ItemForm from './components/ItemForm'
import ResultsTable from './components/ResultsTable'
import TotalControls from './components/TotalControls'
import { calculateDistribution } from './utils/splitter'
import { evaluateExpression } from './utils/expression'
import { exportResultsPdf } from './utils/pdf'
import './App.css'

const STORAGE_KEY = 'cost-share-studio-data-v1'

function getInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { items: [], finalTotal: '', loadError: '' }
    }

    const parsed = JSON.parse(stored)
    const storedItems = Array.isArray(parsed?.items)
      ? parsed.items.filter(
          (item) => item && typeof item.name === 'string' && Number.isFinite(Number(item.price)),
        )
      : []

    return {
      items: storedItems.map((item) => ({ name: item.name, price: Number(item.price) })),
      finalTotal: typeof parsed?.finalTotal === 'string' ? parsed.finalTotal : '',
      loadError: '',
    }
  } catch {
    return { items: [], finalTotal: '', loadError: 'Could not load saved data from localStorage.' }
  }
}

function App() {
  const [initialState] = useState(() => getInitialState())
  const [items, setItems] = useState(initialState.items)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [finalTotal, setFinalTotal] = useState(initialState.finalTotal)
  const [error, setError] = useState(initialState.loadError)
  const [editingIndex, setEditingIndex] = useState(null)

  useEffect(() => {
    const payload = {
      items,
      finalTotal,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [items, finalTotal])

  const { baseTotal, rows } = calculateDistribution(items, finalTotal)

  const handleAddItem = (event) => {
    event.preventDefault()
    let parsedPrice = 0

    if (!name.trim()) {
      setError('Please enter a person name.')
      return
    }

    try {
      parsedPrice = evaluateExpression(price)
    } catch (expressionError) {
      setError(expressionError.message)
      return
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a valid number greater than or equal to 0.')
      return
    }

    setItems((previous) => {
      if (editingIndex === null) {
        return [...previous, { name: name.trim(), price: parsedPrice }]
      }

      return previous.map((item, index) => {
        if (index !== editingIndex) return item
        return { name: name.trim(), price: parsedPrice }
      })
    })

    setEditingIndex(null)
    setName('')
    setPrice('')
    setError('')
  }

  const handleEdit = (index) => {
    const selected = items[index]
    if (!selected) return

    setEditingIndex(index)
    setName(selected.name)
    setPrice(String(selected.price))
    setError('')
  }

  const handleDelete = (index) => {
    setItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index))

    if (editingIndex === null) {
      return
    }

    if (editingIndex === index) {
      setEditingIndex(null)
      setName('')
      setPrice('')
      return
    }

    if (editingIndex > index) {
      setEditingIndex((prev) => prev - 1)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setName('')
    setPrice('')
    setError('')
  }

  const handleClear = () => {
    setItems([])
    setFinalTotal('')
    setName('')
    setPrice('')
    setEditingIndex(null)
    setError('')
  }

  const handleGeneratePdf = () => {
    if (rows.length === 0) {
      setError('Add at least one item before generating a PDF.')
      return
    }

    try {
      exportResultsPdf({ rows, baseTotal, finalTotal })
      setError('')
    } catch {
      setError('Could not generate PDF.')
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <header className="title-wrap">
          <p className="eyebrow">Production Expense Allocation</p>
          <h1>CostShare Studio</h1>
          <p className="subtitle">Add each participant and amount, then enter the final total to calculate proportional settlement instantly.</p>
        </header>

        <ItemForm
          name={name}
          price={price}
          onNameChange={setName}
          onPriceChange={setPrice}
          onSubmit={handleAddItem}
          isEditing={editingIndex !== null}
          onCancelEdit={handleCancelEdit}
        />

        {error && <p className="error">{error}</p>}

        <TotalControls
          finalTotal={finalTotal}
          onFinalTotalChange={setFinalTotal}
          onClear={handleClear}
          onGeneratePdf={handleGeneratePdf}
        />

        <section className="results">
          <h2>Items</h2>
          <ResultsTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} />
        </section>

        <p className="summary">Base Total: {baseTotal.toFixed(2)}</p>
      </section>
    </main>
  )
}

export default App
