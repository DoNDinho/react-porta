export const requestPlatosVendidos = (data) => {
  return {
    date: data.date,
    category: {
      code: data.categoryCode
    }
  }
}