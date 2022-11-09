import axios from 'axios'

export async function obtenerGananciasMensuales(date) {
  try {
    const url = 'https://siglo-xxi-reports.azurewebsites.net/Reports/v1/earnings/monthly'
    const headers = { 'Content-Type': 'application/json' }
    const body = { date }
    const { data } = await axios.post(url, body, { headers })
    return data
  } catch (error) {
    console.log(error)
  }
}
