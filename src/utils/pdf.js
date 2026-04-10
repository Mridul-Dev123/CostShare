import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportResultsPdf({ rows, baseTotal, finalTotal }) {
  const doc = new jsPDF()
  const generatedAt = new Date().toLocaleString()
  const normalizedFinalTotal = Number(finalTotal)

  doc.setFontSize(16)
  doc.text('Final Product Splitter - Results', 14, 18)

  doc.setFontSize(10)
  doc.text(`Generated: ${generatedAt}`, 14, 25)
  doc.text(`Base Total: ${Number(baseTotal).toFixed(2)}`, 14, 31)

  if (Number.isFinite(normalizedFinalTotal)) {
    doc.text(`Final Total: ${normalizedFinalTotal.toFixed(2)}`, 14, 37)
  }

  autoTable(doc, {
    startY: Number.isFinite(normalizedFinalTotal) ? 44 : 38,
    head: [['Person', 'Price', 'Final Product']],
    body: rows.map((row) => [
      String(row.name),
      Number(row.price).toFixed(2),
      row.finalShare === null ? '-' : Number(row.finalShare).toFixed(2),
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [15, 118, 110],
    },
  })

  doc.save('result-table.pdf')
}
