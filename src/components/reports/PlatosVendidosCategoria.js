import React, { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { StackedBarChart } from './StackedBarChart'
import { obtenerPlatosVendidosCategoria } from '../../api/platosVendidosCategoria'

const chartOptions = {
  labels: [],
  datasets: [
    {
      label: 'Almuerzo',
      data: [],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'Ensalada',
      data: [],
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'Bebestibles',
      data: [],
      backgroundColor: 'rgb(53, 162, 235)',
    },
    {
      label: 'Postres',
      data: [],
      backgroundColor: 'rgb(250, 250, 0)',
    },
  ],
}

const defaultPlatosVendidos = [
  { fecha: '', categoriasVendidas: [{ categoria: '', cantidad: 0 }] }
]

const PlatosVendidosCategoria = () => {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [dataChart, setDataChart] = useState(chartOptions)
  const [mes, setMes] = useState('')
  const [platosVendidos, setPlatosVendidos] = useState(defaultPlatosVendidos)

  useEffect(() => {
    callApiPlatosVendidos()
    procesarReporte()
  }, [mes])

  const procesarReporte = async (e) => {
    e?.preventDefault()
    await callApiPlatosVendidos()
    await loadDataChart()
  }

  const callApiPlatosVendidos = async () => {
    const body = { date }
    const { menus_sold } = await obtenerPlatosVendidosCategoria(body)
    if(!menus_sold.details) {
      setMes('')
      setPlatosVendidos(defaultPlatosVendidos)
      return
    }
    const datos = menus_sold.details.map(detail => {
      const categoriesSold = detail.categories_sold.map(category => {
        return { categoria: category.category.name , cantidad: category.sales_quantity }
      })
      return { fecha: detail.date, categoriasVendidas: categoriesSold }
    })
    setMes(menus_sold.month)
    setPlatosVendidos(datos)
  }

  const loadDataChart = async () => {
    const fechas = platosVendidos.map(data => data.fecha)
    const [almuerzos, ensaladas, bebestibles, postres] = await Promise.all([
      mapPlatos(platosVendidos, 'ALMUERZO'),
      mapPlatos(platosVendidos, 'ENSALADA'),
      mapPlatos(platosVendidos, 'BEBESTIBLE'),
      mapPlatos(platosVendidos, 'POSTRE'),
    ])
    
    setDataChart({ labels: fechas, datasets: [
      { ...dataChart.datasets[0], data: almuerzos },
      { ...dataChart.datasets[1], data: ensaladas },
      { ...dataChart.datasets[2], data: bebestibles },
      { ...dataChart.datasets[3], data: postres },
    ]})

  }

  const mapPlatos = (platosVendidos, category) => {
    return platosVendidos.map(data => {
      const x = data.categoriasVendidas.find(data => {
        if(data.categoria === category) return data
      })
      return x.cantidad
    })
  }

  return (
    <div style={{ marginTop: 30 }}>
      <form style={{ width: 700, margin: 'auto' }}>
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

      <div style={{ width: 1100, margin: 'auto', marginTop: 30 }}>
        <StackedBarChart chartData={dataChart} title={`Platos vendidos en el mes ${mes}`} />
      </div>
    </div>
  )
}

export default PlatosVendidosCategoria