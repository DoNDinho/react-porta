import React, { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { obtenerVentasAnuales } from '../../api/ventasAnuales'
import { requestVentasAnuales } from '../../converters/ventasAnuales'
import LineChart from './LineChart'

const chartOptions = {
  labels: [],
  datasets: [
    {
      fill: true,
      label: 'Ventas mensuales',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      pointRadius: 6,
      pointBackgroundColor: 'rgb(53, 162, 235)',
    }
  ]
}

const defaultDatosAnuales = [
  { mes: '', montoTotal: 0 }
]

const GananciasAnuales = () => {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [dataChart, setDataChart] = useState(chartOptions)
  const [totalAnual, setTotalAnual] = useState(0)
  const [datosAnuales, setDatosAnuales] = useState(defaultDatosAnuales)

  useEffect( () =>{
    procesarReporte()
  }, [dataChart.labels[0], totalAnual])

  const procesarReporte = async(e) => {
    e?.preventDefault()
    await callApiVentasAnuales()
    loadDataChart()
  }

  const callApiVentasAnuales = async () => {
    const body = requestVentasAnuales(date)
    const {annual_sales} = await obtenerVentasAnuales(body)
    if(!annual_sales.details) {
      setTotalAnual(0)
      setDatosAnuales(defaultDatosAnuales)
      return
    }
    const datos = annual_sales.details.map(detail => {
      return {mes: detail.month, montoTotal: detail.amount.total_amount}
    })
    setTotalAnual(annual_sales.amount)
    setDatosAnuales(datos)
  }

  const loadDataChart = () => {
    const meses = datosAnuales.map(dato => dato.mes)
    const data = meses.map(mes => {
      const datoAnual = datosAnuales.find(datoAnual => {
        if(datoAnual.mes === mes) return datoAnual
      })
      return datoAnual.montoTotal
    })
    setDataChart({labels: meses, datasets:[{...dataChart.datasets[0], data}]})
  }

  return (
    <div style={{ marginTop: 30 }}>
      <form style={{ width: 700, margin: 'auto' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker
                views={['year']}
                label='Seleccione año'
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

      <div style={{ width: 700, margin: 'auto', marginTop: 30 }}>
        <LineChart chartData={dataChart} title={`Total ventas anuales $${totalAnual.toLocaleString('es-CL')}`} />
      </div>
    </div>
  )
}

export default GananciasAnuales
