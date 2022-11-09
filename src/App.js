import './App.css'

import { useState } from 'react'
import Report from './components/Report'
import Datex from './components/Datex'

function App() {
  const [monthlyEagnins, setMonthlyEagnins] = useState(0)
  const [annualEagnins, setAnnualEagnins] = useState(0)
  const [monthlySales, setMonthlySales] = useState({ monthlySales: [] })
  const [annualSales, setAnnualSales] = useState({ annualSales: [] })

  return (
    <div>
      <Report />
    </div>
  )
}

export default App
