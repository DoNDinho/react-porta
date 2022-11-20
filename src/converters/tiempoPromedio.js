export const requestTiempoPromedio = (data) => {
  return {
    date: data.date,
    category: {
      code: data.categoryCode
    }
  }
}