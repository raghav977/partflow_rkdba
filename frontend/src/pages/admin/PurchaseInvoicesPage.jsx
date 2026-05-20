import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Plus } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminPurchaseInvoicesPage = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [searchVendor, setSearchVendor] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const navigate = useNavigate()

  const API_BASE = 'http://localhost:5186/api'
  const token = localStorage.getItem('token')

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const params = new URLSearchParams({
        page: page,
        pageSize: 10
      })
      if (searchVendor) params.append('vendorName', searchVendor)
      if (filterStatus) params.append('status', filterStatus)

      const response = await axios.get(
        `${API_BASE}/purchase?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Fetched invoices:', response.data.data.data)
      setInvoices(response.data.data.data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch invoices: ${errorMsg}`)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInvoices()
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchInvoices()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase Invoices</h1>
        <Button onClick={() => navigate('/admin/purchases/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Purchase Invoice
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by vendor name..."
              value={searchVendor}
              onChange={(e) => setSearchVendor(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Invoices List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Invoice ID</th>
                  <th className="text-left py-3 px-4">Vendor</th>
                  <th className="text-center py-3 px-4">Purchase Date</th>
                  <th className="text-right py-3 px-4">Total Amount</th>
                  <th className="text-right py-3 px-4">Discount</th>
                  <th className="text-right py-3 px-4">Final Amount</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs">{invoice.id?.substring(0, 8)}...</td>
                      <td className="py-3 px-4">{invoice.vendorName}</td>
                      <td className="py-3 px-4 text-center">{new Date(invoice.purchaseDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">Rs. {invoice.totalAmount?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">Rs. {invoice.discount?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold">Rs. {invoice.finalAmount?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/admin/purchases/${invoice.id}`)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                      No purchase invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Page <span className="font-bold">{page}</span>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={invoices.length < 10}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPurchaseInvoicesPage
