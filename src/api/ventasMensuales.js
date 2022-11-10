import axios from 'axios'

export async function obtenerVentasMensuales(body) {
  try {
    const url = 'https://siglo-xxi-reports.azurewebsites.net/Reports/v1/sales/monthly'
    const headers = { 'Content-Type': 'application/json' }
    const { data } = await axios.post(url, body, { headers })
    return data
  } catch (error) {
    console.log(error)
  }
}
