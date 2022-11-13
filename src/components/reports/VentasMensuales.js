import React, { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import LineChart from './LineChart'
import { requestVentasMensuales } from '../../converters/ventasMensuales'
import { obtenerVentasMensuales } from '../../api/ventasMensuales'

const chartOptions = {
  labels: [],
  datasets: [
    {
      fill: true,
      label: 'Ventas diarias',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      pointRadius: 6,
      pointBackgroundColor: 'rgb(53, 162, 235)',
    }
  ]
}

const defaultDatosMensuales = [
  { fecha: '', montoTotal: 0 }
]

const GananciasMensuales = () => {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [dataChart, setDataChart] = useState(chartOptions)
  const [totalMensual, setTotalMensual] = useState(0)
  const [datosMensuales, setDatosMensuales] = useState(defaultDatosMensuales)

  useEffect( () =>{
    procesarReporte()
  }, [dataChart.labels[0], totalMensual])

  const procesarReporte = async(e) => {
    e?.preventDefault()
    await callApiVentasMensuales()
    loadDataChart()
  }

  const callApiVentasMensuales = async () => {
    const body = requestVentasMensuales(date)
    const {monthly_sales} = await obtenerVentasMensuales(body)
    if(!monthly_sales.details) {
      setTotalMensual(0)
      setDatosMensuales(defaultDatosMensuales)
      return
    }
    const datos = monthly_sales.details.map(detail => {
      return {fecha: detail.date, montoTotal: detail.amount.total_amount}
    })
    setTotalMensual(monthly_sales.amount)
    setDatosMensuales(datos)    
  }

  const loadDataChart = () => {
    const dias = datosMensuales.map(dato => dato.fecha)
    const data = dias.map(fecha => {
      const datoMensual = datosMensuales.find(datoMensual => {
        if(datoMensual.fecha === fecha) return datoMensual
      })
      return datoMensual.montoTotal
    })
    setDataChart({labels: dias, datasets:[{...dataChart.datasets[0], data}]})
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

      <div style={{ width: 700, margin: 'auto', marginTop: 30 }}>
        <LineChart chartData={dataChart} title={`Total ventas mensual $${totalMensual.toLocaleString('es-CL')}`} />
      </div>
    </div>
  )
}

export default GananciasMensuales
