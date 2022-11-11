import axios from 'axios'

export async function listarCategorias() {
  try {
    const url = 'https://siglo-xxi-products.azurewebsites.net/Products/v1/categories'
    const headers = { 'Content-Type': 'application/json' }
    const { data } = await axios.get(url, { headers })
    return data
  } catch (error) {
    console.log(error)
  }
}
