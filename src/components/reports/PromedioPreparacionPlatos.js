import React, { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import HorizontalBarChart from './HorizontalBarChart'
import { listarCategorias } from '../../api/listarCategorias'
import { requestTiempoPromedio } from '../../converters/tiempoPromedio'
import { obtenerPromedioPreparacionPlatos } from '../../api/tiempoPromedioPreparacion'

const chartOptions = {
  labels: [],
  datasets: [
    {
      label: 'Tiempo preparación (min)',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Tiempo promedio preparación (min)',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const defaultTiempoPreparacionPlatos = [
  { menu: '', tiempoPreparacion: 0, tiempoPromedio: 0 }
]

const PromedioPreparacionPlatos = () => {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [categorias, setCategorias] = useState([{ code: 0, name: '' }])
  const [idCategoria, setIdCategoria] = useState(1)
  const [dataChart, setDataChart] = useState(chartOptions)
  const [tiempoPreparacionPlatos, setTiempoPreparacionPlatos] = useState(defaultTiempoPreparacionPlatos)

  useEffect(() => {
    callApiListarCategorias()
    procesarReporte()
  }, [ dataChart.labels[0], dataChart.labels[1], idCategoria ])

  const callApiListarCategorias = async () => {
    const { categories } = await listarCategorias()
    setCategorias(categories)
  }

  const changeSelect = (e) => {
    setIdCategoria(+e.target.value)
  }

  const procesarReporte = async (e) => {
    e?.preventDefault()
    await callAPiTiempoPromedio()
    loadDataChart()
  }

  const callAPiTiempoPromedio = async () => {
    const dataBody = { date, categoryCode: idCategoria }
    const body = requestTiempoPromedio(dataBody)
    const { average_preparation_time } = await obtenerPromedioPreparacionPlatos(body)
    if(!average_preparation_time.details) {
      setTiempoPreparacionPlatos(defaultTiempoPreparacionPlatos)
      return
    }
    const datos = average_preparation_time.details.map(detail => {
      return { 
        menu: detail.menu.name,
        tiempoPreparacion: detail.preparation_time,
        tiempoPromedio: detail.delay_time
      }
    })
    setTiempoPreparacionPlatos(datos)
  }
  
  const loadDataChart = () => {
    const platos = tiempoPreparacionPlatos.map(plato => plato.menu)
    const tiempoPreparacion = platos.map(plato => {
      const platoVendido = tiempoPreparacionPlatos.find(platoVendido => {
        if(platoVendido.menu === plato) return platoVendido
      })
      return platoVendido.tiempoPreparacion
    })
    const tiempoPromedio = platos.map(plato => {
      const platoVendido = tiempoPreparacionPlatos.find(platoVendido => {
        if(platoVendido.menu === plato) return platoVendido
      })
      return platoVendido.tiempoPromedio
    })
    setDataChart({ labels: platos, datasets: [
      { ...dataChart.datasets[0], data: tiempoPreparacion},
      { ...dataChart.datasets[1], data: tiempoPromedio}
    ]})
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

      <div style={{ width: 1000, margin: 'auto', marginTop: 30 }}>
        <HorizontalBarChart chartData={dataChart} title={`Tiempo promedio preparación platos`} />
      </div>
    </div>
  )
}

export default PromedioPreparacionPlatos