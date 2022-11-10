import axios from 'axios'

export async function obtenerVentasAnuales(body) {
  try {
    const url = 'https://siglo-xxi-reports.azurewebsites.net/Reports/v1/sales/annual'
    const headers = { 'Content-Type': 'application/json' }
    const { data } = await axios.post(url, body, { headers })
    return data
  } catch (error) {
    console.log(error)
  }
}
