import React from 'react'
import { PieChart } from './reports/PieChart'
import PlatosMasVendidos from './reports/PlatosMasVendidos'
import VentasAnuales from './reports/VentasAnuales'
import VentasMensuales from './reports/VentasMensuales'

const Report = () => {
 
  return (
    <div style={{ marginTop: 30 }}>
      <VentasAnuales />
      <hr />
      <VentasMensuales/>

      <hr />
      <hr />
      <PlatosMasVendidos />
    </div>
  )
}

export default Report
