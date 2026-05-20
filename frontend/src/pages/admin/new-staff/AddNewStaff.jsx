import React, { useState } from 'react'
import Header from '@/components/Header'

import {toast} from 'react-toastify'
import useRegisterStaff from '@/hooks/UserRegisterStaff'
import Spinner from '@/components/ui/Spinner'
const AddNewStaff = () => {


  const { mutate,isPending } = useRegisterStaff();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  })

  // const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // if (errors[name]) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     [name]: '',
    //   }))
    // }
  }

  const validateForm = () => {
    // const newErrors = {}f

    if (!formData.name.trim()) {
      // newErrors.name = 'Name is required'
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      // newErrors.email = 'Email is required'
      toast.error("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // newErrors.email = 'Invalid email format'
      toast.error("Invalid email format")
      return;
    }

    if (!formData.password.trim()) {
      // newErrors.password = 'Password is required'
      toast.error("Password is required");
      return;
    } else if (formData.password.length < 6) {
      // newErrors.password = 'Minimum 6 characters required'
      toast.error("Minimum 6 characters required");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    } else if (!/^(98|97)\d{8}$/.test(formData.phoneNumber)) {
      toast.error("Phone number must starts with 98 or 97 with 10 digit");
      return;
    }
    return true;

    // setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSuccessMessage('')

    if (!validateForm()){
      console.log("Hey I am here")
      return;
    } 

    try {
      



      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // setSuccessMessage('Staff created successfully.')
      mutate(formData);

      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-blue-500 `

  return (
    <div className="space-y-6">
      <Header
        title="Add New Staff"
        desc="Create staff accounts for operational access."
        backLink="/admin/users"
      />

      <div className="rounded-2xl border border-gray-100 bg-white flex  items-center p-6 shadow-sm w-full justify-center">
        {successMessage && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 border w-full">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={inputClass('name')}
            />

            {/* {errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            )} */}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="staff@example.com"
              className={inputClass('email')}
            />

            {/* {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )} */}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={inputClass('password')}
            />

            {/* {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password}
              </p>
            )} */}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="98XXXXXXXX"
              className={inputClass('phoneNumber')}
            />

            {/* {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-600">
                {errors.phoneNumber}
              </p>
            )} */}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isPending?<><Spinner size="h-4 w-4" /></>:'Create Staff'}
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  phoneNumber: '',
                })
              }
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNewStaff