import React, { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { requestPlatosVendidos } from '../../converters/platosVendidos'
import { obtenerPlatosMasVendidos } from '../../api/platosMasVendidos'
import { PieChart } from './PieChart'

export const chartOptions = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const defaultMasVendidos = [
  { menu: '', cantidad: 0 }
]

// TODO continua en este componente
const PlatosMasVendidos = () => {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [dataChart, setDataChart] = useState(chartOptions)
  const [mes, setMes] = useState('')
  const [platosVendidos, setPlatosVendidos] = useState(defaultMasVendidos)

  const procesarReporte = async (e) => {
    e?.preventDefault()
    await callApiPlatosMasVendidos()
    loadDataChart()
  }

  const callApiPlatosMasVendidos = async () => {
    const dataBody = { date: date, categoryCode: 1 }
    const body = requestPlatosVendidos(dataBody)
    const { best_seller_menu } = await obtenerPlatosMasVendidos(body, null)
    if(!best_seller_menu.details) {
      setMes('')
      setPlatosVendidos(defaultMasVendidos)
      return
    }
    const datos = best_seller_menu.details.map(detail => {
      return { menu: detail.menu.name, cantidad: detail.quantity }
    })
    setMes(best_seller_menu.month)
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

  return (
    <div style={{ marginTop: 30 }}>
      <form style={{ width: 700, margin: 'auto' }}>
        <label>
          Selecciona mes:
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker
              views={['year', 'month']}
              // label='Year and Month'
              minDate={dayjs('2012-03-01')}
              maxDate={dayjs('2030-06-01')}
              value={date}
              onChange={(newValue) => {
                setDate(newValue.format('YYYY-MM-DD'))
              }}
              renderInput={(params) => <TextField {...params} helperText={null} />}
            />
          </LocalizationProvider>
        </label>

        <input
          type='submit'
          value='Generar'
          onClick={procesarReporte}
          disabled={false}
        />
      </form>

      <div style={{ width: 700, margin: 'auto' }}>
        <PieChart chartData={dataChart} title={`Platos más vendidos en el mes ${mes}`} />
      </div>
    </div>
    
  )
}

export default PlatosMasVendidos