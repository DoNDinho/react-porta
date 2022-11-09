import React, { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { obtenerGananciasAnuales } from '../../api/gananciasAnuales'
import { requestGananciasAnuales } from '../../converters/gananciasAnuales'
import LineChart from './LineChart'

const chartOptions = {
  labels: [],
  datasets: [
    {
      fill: true,
      label: 'Ganancias mensuales',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
}

const GananciasAnuales = () => {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [dataChart, setDataChart] = useState(chartOptions)
  const [totalAnual, setTotalAnual] = useState(0)
  const [datosAnuales, setDatosAnuales] = useState([{
    mes: '',
    montoTotal: 0
  }])

  useEffect( () =>{
    procesarReporte()
  }, [dataChart.labels[0], totalAnual])

  const procesarReporte = async(e) => {
    e?.preventDefault()
    await callApiGananciasAnuales()
    loadDataChart()
  }

  const callApiGananciasAnuales = async () => {
    const body = requestGananciasAnuales(date)
    const {annual_sales} = await obtenerGananciasAnuales(body)
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
        <label>
          Selecciona año:
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker
                views={['year']}
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
        <LineChart chartData={dataChart} title={`Total ganancias anuales $${totalAnual}`} />
      </div>
    </div>
  )
}

export default GananciasAnuales
