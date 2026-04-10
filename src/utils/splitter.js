export function calculateBaseTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

export function calculateDistribution(items, finalTotal) {
  const baseTotal = calculateBaseTotal(items)
  const finalAmount = Number(finalTotal)
  const canCalculate = items.length > 0 && baseTotal > 0 && Number.isFinite(finalAmount)

  const rows = items.map((item) => {
    const finalShare = canCalculate ? (item.price / baseTotal) * finalAmount : null
    return {
      ...item,
      finalShare,
    }
  })

  return {
    baseTotal,
    canCalculate,
    rows,
  }
}
