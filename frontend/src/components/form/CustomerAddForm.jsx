import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Spinner from '../ui/Spinner'

const CustomerAddForm = ({ onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputClass =
    "w-full rounded-xl border px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-blue-500"

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter customer name"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter customer email"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter customer password"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="98XXXXXXXX"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? <><Spinner/></> : 'Create Customer'}
      </button>
    </form>
  )
}

export default CustomerAddForm