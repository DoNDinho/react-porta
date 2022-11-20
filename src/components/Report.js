import React from 'react'
import PlatosMasVendidos from './reports/PlatosMasVendidos'
import PlatosMenosVendidos from './reports/PlatosMenosVendidos'
import VentasAnuales from './reports/VentasAnuales'
import VentasMensuales from './reports/VentasMensuales'
import PromedioPreparacionPlatos from './reports/PromedioPreparacionPlatos'

const Report = () => {
 
  return (
    <div style={{ marginTop: 30 }}>
      <VentasAnuales />
      <hr />
      <VentasMensuales/>

      <hr />
      <hr />
      <PlatosMasVendidos />

      <hr />
      <PlatosMenosVendidos />

      <hr />
      <PromedioPreparacionPlatos />
    </div>
  )
}

export default Report
