export const requestVentasAnuales = (date) =>{
  return {
    year: date.split('-')[0]
  }
}