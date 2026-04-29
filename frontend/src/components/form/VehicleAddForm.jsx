import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const VehicleAddForm = ({ customerId, onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    customerId: customerId,
    vehicleNumber: '',
    chassisNumber: '',
    engineNumber: '',
    brand: '',
    model: '',
    year: '',
    fuelType: 0,
    color: 0,
    mileageKm: '',
    status: 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      year: formData.year ? Number(formData.year) : null,
      mileageKm: formData.mileageKm ? Number(formData.mileageKm) : null,
      fuelType: Number(formData.fuelType),
      color: Number(formData.color),
      status: Number(formData.status),
    }

    onSubmit(payload)
  }

  const fuelOptions = [
    { label: 'Petrol', value: 0 },
    { label: 'Diesel', value: 1 },
    { label: 'Electric', value: 2 },
  ]

  const colorOptions = [
    { label: 'Red', value: 0 },
    { label: 'Blue', value: 1 },
    { label: 'Green', value: 2 },
    { label: 'Black', value: 3 },
    { label: 'White', value: 4 },
    { label: 'Silver', value: 5 },
    { label: 'Gray', value: 6 },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Vehicle Number */}
      <div className="space-y-2">
        <Label>Vehicle Number</Label>
        <Input
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          placeholder="BA12PA1234"
        />
      </div>

      {/* Chassis */}
      <div className="space-y-2">
        <Label>Chassis Number</Label>
        <Input
          name="chassisNumber"
          value={formData.chassisNumber}
          onChange={handleChange}
        />
      </div>

      {/* Engine */}
      <div className="space-y-2">
        <Label>Engine Number</Label>
        <Input
          name="engineNumber"
          value={formData.engineNumber}
          onChange={handleChange}
        />
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label>Brand</Label>
        <Input
          name="brand"
          value={formData.brand}
          onChange={handleChange}
        />
      </div>

      {/* Model */}
      <div className="space-y-2">
        <Label>Model</Label>
        <Input
          name="model"
          value={formData.model}
          onChange={handleChange}
        />
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label>Year</Label>
        <Input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
      </div>

      {/* Fuel */}
      <div className="space-y-2">
        <Label>Fuel Type</Label>
        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        >
          {fuelOptions.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Color</Label>
        <select
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        >
          {colorOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mileage */}
      <div className="space-y-2">
        <Label>Mileage (KM)</Label>
        <Input
          type="number"
          name="mileageKm"
          value={formData.mileageKm}
          onChange={handleChange}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-xl"
      >
        {isPending ? 'Adding...' : 'Add Vehicle'}
      </button>
    </form>
  )
}

export default VehicleAddForm