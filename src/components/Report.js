import React from 'react'
import VentasAnuales from './reports/VentasAnuales'
import VentasMensuales from './reports/VentasMensuales'

const Report = () => {
 
  return (
    <div style={{ marginTop: 30 }}>
      <VentasAnuales />
      <hr />
      <VentasMensuales/>
    </div>
  )
}

export default Report
