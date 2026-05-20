import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import { loginUser, clearError } from '../../store/slices/authSlice'
import {loginUser,clearError} from "../../../store/slices/authSlice"


export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, error, isAuthenticated, role } = useSelector(
    (state) => state.auth
  )

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [validationErrors, setValidationErrors] = useState({})

  // Redirect if already logged in
  useEffect(() => {
    if (!isAuthenticated) return

    if (role === 'Admin') {
      navigate('/admin/dashboard')
    } else if (role === 'Staff') {
      navigate('/staff/dashboard')
    } else if (role === 'Customer') {
      navigate('/customer/dashboard')
    } else {
      navigate('/')
    }
  }, [isAuthenticated, role, navigate])

  const validateForm = () => {
    const errors = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    }

    setValidationErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    dispatch(clearError())

    if (!validateForm()) return

    try {
      const result = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap()

      setFormData({
        email: '',
        password: '',
      })

      const userRole = result.role

      if (userRole === 'Admin') {
        navigate('/admin/dashboard')
      } else if (userRole === 'Staff') {
        navigate('/staff/dashboard')
      } else if (userRole === 'Customer') {
        navigate('/customer/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            PartFlow
          </h1>
          <p className="text-sm text-slate-600">
            Sign in to your account
          </p>
        </div>

        {/* API Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2 focus:ring-blue-500 ${
                validationErrors.email
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-300'
              }`}
            />

            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter password"
              className={`w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2 focus:ring-blue-500 ${
                validationErrors.password
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-300'
              }`}
            />

            {validationErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Secure access for Admin, Staff, and Customers
        </div>
      </div>
    </div>
  )
}