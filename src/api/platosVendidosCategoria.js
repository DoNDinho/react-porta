import axios from 'axios'

export async function obtenerPlatosVendidosCategoria(body) {
  try {
    const url = 'https://siglo-xxi-reports.azurewebsites.net/Reports/v1/menu/sold'
    const headers = { 'Content-Type': 'application/json' }
    const { data } = await axios.post(url, body, { headers })
    return data
  } catch (error) {
    console.log(error)
  }
}
