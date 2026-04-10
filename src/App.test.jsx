import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('CostShare Studio', () => {
  it('renders production-ready heading and subtitle', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'CostShare Studio' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Add each participant and amount, then enter the final total to calculate proportional settlement instantly.',
      ),
    ).toBeInTheDocument()
  })

  it('shows validation when generating PDF with no rows', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    expect(screen.getByText('Add at least one item before generating a PDF.')).toBeInTheDocument()
  })
})
