import axios from 'axios'
import { toast } from 'react-toastify'

const baseURL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers:{
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

/* Request Interceptor */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* Response Interceptor */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      toast.error('Session expired. Please login again.')
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      window.location.href = '/login'
    }

    if (status === 403) {
      toast.error('You are not authorized for this action.')
    }

    if (status === 500) {
      toast.error('Server error occurred.')
    }

    return Promise.reject(error)
  }
)

export default api