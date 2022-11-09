import * as React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
dayjs.locale('es')

export default function ViewsDatePicker({ typeDate, handleDate }) {
  const [value, setValue] = React.useState(dayjs(new Date()))
  handleDate(value.format('YYYY-MM-DD'))
  let datePicker
  if (typeDate === 'mensual') {
    datePicker = (
      <DatePicker
        views={['year', 'month']}
        // label='Year and Month'
        minDate={dayjs('2012-03-01')}
        maxDate={dayjs('2030-06-01')}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          handleDate(value.format('YYYY-MM-DD'))
        }}
        renderInput={(params) => <TextField {...params} helperText={null} />}
      />
    )
  }

  if (typeDate === 'anual') {
    datePicker = (
      <DatePicker
        views={['year']}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          handleDate(value.format('YYYY-MM-DD'))
        }}
        renderInput={(params) => <TextField {...params} helperText={null} />}
      />
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>{datePicker}</LocalizationProvider>
  )
}
