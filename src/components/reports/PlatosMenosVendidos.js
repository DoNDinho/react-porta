import React, { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { requestPlatosVendidos } from '../../converters/platosVendidos'
import { obtenerPlatosMenosVendidos } from '../../api/platosMenosVendidos'
import { PieChart } from './PieChart'
import { listarCategorias } from '../../api/listarCategorias'

export const chartOptions = {
  labels: [],
  datasets: [
    {
      label: '# of Votes',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(200, 60, 132, 0.2)',
        'rgba(170, 162, 235, 0.2)',
        'rgba(90, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(200, 60, 132, 1)',
        'rgba(170, 162, 235, 1)',
        'rgba(90, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1,
    },
  ],
};

const defaultMasVendidos = [
  { menu: '', cantidad: 0 }
]

const PlatosMenosVendidos = () => {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [categorias, setCategorias] = useState([{ code: 0, name: '' }])
  const [idCategoria, setIdCategoria] = useState(1)
  const [dataChart, setDataChart] = useState(chartOptions)
  const [mes, setMes] = useState('')
  const [platosVendidos, setPlatosVendidos] = useState(defaultMasVendidos)

  useEffect( () =>{
    callApiListarCategorias()
    procesarReporte()
  }, [dataChart.labels[0], mes, idCategoria])

  const callApiListarCategorias = async () => {
    const { categories } = await listarCategorias()
    setCategorias(categories)
  }
  
  const procesarReporte = async (e) => {
    e?.preventDefault()
    await callApiPlatosMenosVendidos()
    loadDataChart()
  }
  
  const callApiPlatosMenosVendidos = async () => {
    const dataBody = { date: date, categoryCode: idCategoria }
    const body = requestPlatosVendidos(dataBody)
    const { least_sold_menu } = await obtenerPlatosMenosVendidos(body, null)
    if(!least_sold_menu.details) {
      setMes('')
      setPlatosVendidos(defaultMasVendidos)
      return
    }
    const datos = least_sold_menu.details.map(detail => {
      return { menu: detail.menu.name, cantidad: detail.quantity }
    })
    setMes(least_sold_menu.month)
    setPlatosVendidos(datos)
  }

  const loadDataChart = () => {
    const platos = platosVendidos.map(plato => plato.menu)
    const data = platos.map(plato => {
      const platoVendido = platosVendidos.find(platoVendido => {
        if(platoVendido.menu === plato) return platoVendido
      })
      return platoVendido.cantidad
    })
    setDataChart({labels: platos, datasets:[{...dataChart.datasets[0], data}]})
  }

  const changeSelect = (e) => {
    setIdCategoria(+e.target.value)
  }

  return (
    <div style={{ marginTop: 30 }}>
      <form style={{ width: 700, margin: 'auto' }}>
        <select onChange={changeSelect} style={{marginLeft: 50}}>
          {categorias.map(categoria => <option value={categoria.code} title={categoria.name}>{categoria.name}</option>)}
        </select>

          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker
              views={['year', 'month']}
              label='Seleccione mes y año'
              minDate={dayjs('2012-03-01')}
              maxDate={dayjs('2030-06-01')}
              value={date}
              onChange={(newValue) => {
                setDate(newValue.format('YYYY-MM-DD'))
              }}
              renderInput={(params) => <TextField {...params} helperText={null} />}
            />
          </LocalizationProvider>

        <input
          type='submit'
          value='Generar'
          onClick={procesarReporte}
          disabled={false}
        />
      </form>

      <div style={{ width: 500, margin: 'auto', marginTop: 30 }}>
        <PieChart chartData={dataChart} title={`Menos vendidos en el mes de ${mes}`} />
      </div>
    </div>
    
  )
}

export default PlatosMenosVendidos