export const requestGananciasAnuales = (date) =>{
  return {
    year: date.split('-')[0]
  }
}