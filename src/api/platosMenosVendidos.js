import axios from 'axios'

export async function obtenerPlatosMenosVendidos(body, limit) {
  try {

    const url = `https://siglo-xxi-reports.azurewebsites.net/Reports/v1/menu/least-sold?limit=${limit ?? '5'}`
    const headers = { 'Content-Type': 'application/json' }
    const { data } = await axios.post(url, body, { headers })
    return data
  } catch (error) {
    console.log(error)
  }
}
