import Header from '@/components/Header'
import React from 'react'

const VehicleManagement = () => {
  return (
    <div>
        <Header title="Vehicle Management" desc="Manage vehicles for your customers" buttonText='Add New Vehicle' linkhref='/staff/vehicles/new'></Header>
    </div>
  )
}

export default VehicleManagement