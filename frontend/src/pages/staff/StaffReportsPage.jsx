import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'

const StaffReportsPage = () => {
  const [reportType, setReportType] = useState('regular')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [minPurchases, setMinPurchases] = useState(5)
  const [minSpent, setMinSpent] = useState(50000)
  const [daysOverdue, setDaysOverdue] = useState(30)

  const API_BASE = 'http://localhost:5186/api'
  const token = localStorage.getItem('token')

  const fetchRegularCustomers = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const response = await axios.get(
        `${API_BASE}/Report/customers/regular?minPurchases=${minPurchases}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReportData(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching regular customers:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch regular customers: ${errorMsg}`)
    }
    setLoading(false)
  }

  const fetchHighSpenders = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const response = await axios.get(
        `${API_BASE}/Report/customers/high-spenders?minSpent=${minSpent}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReportData(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching high spenders:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch high spenders: ${errorMsg}`)
    }
    setLoading(false)
  }

  const fetchPendingCredits = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const response = await axios.get(
        `${API_BASE}/Report/customers/pending-credits?daysOverdue=${daysOverdue}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReportData(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching pending credits:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch pending credits: ${errorMsg}`)
    }
    setLoading(false)
  }

  const handleGenerateReport = () => {
    if (reportType === 'regular') {
      fetchRegularCustomers()
    } else if (reportType === 'high-spenders') {
      fetchHighSpenders()
    } else if (reportType === 'pending-credits') {
      fetchPendingCredits()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Customer Reports</h1>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Customer Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="regular">Regular Customers</option>
              <option value="high-spenders">High Spenders</option>
              <option value="pending-credits">Pending Credits</option>
            </select>

            {reportType === 'regular' && (
              <Input
                type="number"
                value={minPurchases}
                onChange={(e) => setMinPurchases(parseInt(e.target.value))}
                min="1"
                placeholder="Min purchases"
              />
            )}

            {reportType === 'high-spenders' && (
              <Input
                type="number"
                value={minSpent}
                onChange={(e) => setMinSpent(parseInt(e.target.value))}
                min="1000"
                placeholder="Min amount spent"
              />
            )}

            {reportType === 'pending-credits' && (
              <Input
                type="number"
                value={daysOverdue}
                onChange={(e) => setDaysOverdue(parseInt(e.target.value))}
                min="1"
                placeholder="Days overdue"
              />
            )}

            <Button onClick={handleGenerateReport} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Loading...' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regular Customers Report */}
      {reportType === 'regular' && reportData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regular Customers (5+ Purchases)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Customers</div>
                  <div className="text-2xl font-bold">{reportData.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-2xl font-bold">Rs. {reportData?.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Avg Spending</div>
                  <div className="text-2xl font-bold">Rs. {(reportData?.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / (reportData.length || 1)).toLocaleString()}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Customer Name</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-center py-2 px-4">Phone</th>
                      <th className="text-center py-2 px-4">Purchases</th>
                      <th className="text-right py-2 px-4">Total Spent</th>
                      <th className="text-right py-2 px-4">Last Purchase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((customer, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{customer.name}</td>
                        <td className="py-2 px-4">{customer.email}</td>
                        <td className="py-2 px-4 text-center">{customer.phoneNumber}</td>
                        <td className="py-2 px-4 text-center font-bold">{customer.purchaseCount}</td>
                        <td className="py-2 px-4 text-right">Rs. {customer.totalSpent?.toLocaleString() || 0}</td>
                        <td className="py-2 px-4 text-right text-gray-600">
                          {customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* High Spenders Report */}
      {reportType === 'high-spenders' && reportData && (
        <Card>
          <CardHeader>
            <CardTitle>High Spenders (Spent &gt; Rs. {minSpent.toLocaleString()})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Customers</div>
                <div className="text-2xl font-bold">{reportData.length}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold">Rs. {reportData?.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Avg Per Transaction</div>
                <div className="text-2xl font-bold">Rs. {(reportData?.reduce((sum, c) => sum + (c.averagePerTransaction || 0), 0) / (reportData.length || 1)).toLocaleString()}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Customer Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-center py-2 px-4">Purchases</th>
                    <th className="text-right py-2 px-4">Total Spent</th>
                    <th className="text-right py-2 px-4">Avg Per Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((customer, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{customer.name}</td>
                      <td className="py-2 px-4">{customer.email}</td>
                      <td className="py-2 px-4 text-center">{customer.purchaseCount}</td>
                      <td className="py-2 px-4 text-right font-bold">Rs. {customer.totalSpent?.toLocaleString() || 0}</td>
                      <td className="py-2 px-4 text-right">Rs. {customer.averagePerTransaction?.toLocaleString() || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Credits Report */}
      {reportType === 'pending-credits' && reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Customers with Pending Credits (&gt; {daysOverdue} days overdue)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Customers</div>
                <div className="text-2xl font-bold text-red-600">{reportData.length}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Pending Amount</div>
                <div className="text-2xl font-bold text-orange-600">Rs. {reportData?.reduce((sum, c) => sum + (c.pendingAmount || 0), 0).toLocaleString()}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Avg Days Overdue</div>
                <div className="text-2xl font-bold text-yellow-600">{(reportData?.reduce((sum, c) => sum + (c.daysOverdue || 0), 0) / (reportData.length || 1)).toFixed(1)}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Customer Name</th>
                    <th className="text-left py-2 px-4">Phone</th>
                    <th className="text-center py-2 px-4">Last Invoice Date</th>
                    <th className="text-right py-2 px-4">Pending Amount</th>
                    <th className="text-center py-2 px-4">Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((customer, idx) => (
                    <tr key={idx} className="border-b hover:bg-red-50">
                      <td className="py-2 px-4">{customer.name}</td>
                      <td className="py-2 px-4">{customer.phoneNumber}</td>
                      <td className="py-2 px-4 text-center">{new Date(customer.lastInvoiceDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4 text-right font-bold text-red-600">Rs. {customer.pendingAmount?.toLocaleString() || 0}</td>
                      <td className="py-2 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-white text-xs ${customer.daysOverdue > 60 ? 'bg-red-600' : 'bg-orange-500'}`}>
                          {customer.daysOverdue} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StaffReportsPage
