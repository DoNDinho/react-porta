import React from 'react'
import GananciasAnuales from './reports/GananciasAnuales'
import GananciasMensuales from './reports/GananciasMensuales'

const Report = () => {
 
  return (
    <div style={{ marginTop: 30 }}>
      <GananciasAnuales />
      <GananciasMensuales/>
    </div>
  )
}

export default Report
