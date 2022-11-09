import React, { useState } from 'react'
import ViewsDatePicker from './Datex'
import LineChart from './LineChart'

const dates = [
  { date: '2022-10-01', total_amount: 100000 },
  { date: '2022-10-02', total_amount: 200000 },
  { date: '2022-10-03', total_amount: 600000 },
  { date: '2022-10-04', total_amount: 50000 },
  { date: '2022-10-05', total_amount: 130000 },
  { date: '2022-10-01', total_amount: 100000 }
]

const labels = dates.map((dia) => dia.date)

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Ventas por día',
      data: labels.map((label) => {
        const date = dates.find((date) => {
          if (date.date == label) return date
        })
        return date.total_amount
      }),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
}

const Report = () => {
  const [typeDate, setTypeDate] = useState('')
  const [date, setDate] = useState('')

  const callApiGanancias = async (e) => {
    // TODO condicion y llamado de API
    e.preventDefault()
  }

  return (
    <div style={{ marginTop: 30 }}>
      <form style={{ width: 700, margin: 'auto' }}>
        <label>
          Ganancias:
          <select onChange={(e) => setTypeDate(e.target.value)}>
            <option value='' disabled selected>
              Seleccione una opción
            </option>
            <option value='mensual'>Mensuales</option>
            <option value='anual'>anuales</option>
          </select>
        </label>
        <ViewsDatePicker typeDate={typeDate} handleDate={setDate} />
        <input
          type='submit'
          value='Generar'
          onClick={callApiGanancias}
          disabled={false}
        />
      </form>

      <div style={{ width: 700, margin: 'auto' }}>
        <LineChart chartData={data} title={'Ganancias Mensuales'} />
      </div>
    </div>
  )
}

export default Report
