import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'
import axios from 'axios'
import { useEffect } from 'react'

const AdminReportsPage = () => {
  const [reportType, setReportType] = useState('daily')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [lowStockData, setLowStockData] = useState(null)

  const API_BASE = 'http://localhost:5186/api'


  const token = localStorage.getItem('token')

  useEffect(()=>{
    console.log('Report Data Updated:', reportData)
  },[reportData])

  const fetchDailyReport = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const response = await axios.get(
        `${API_BASE}/report/financial/daily?date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReportData(response.data)
    } catch (error) {
      console.error('Error fetching daily report:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch daily report: ${errorMsg}`)
    }
    setLoading(false)
  }

  const fetchMonthlyReport = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const response = await axios.get(
        `${API_BASE}/report/financial/monthly?year=${selectedYear}&month=${selectedMonth}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReportData(response.data)
    } catch (error) {
      console.error('Error fetching monthly report:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch monthly report: ${errorMsg}`)
    }
    setLoading(false)
  }

  const fetchYearlyReport = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const response = await axios.get(
        `${API_BASE}/report/financial/yearly?year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReportData(response.data)
    } catch (error) {
      console.error('Error fetching yearly report:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch yearly report: ${errorMsg}`)
    }
    setLoading(false)
  }

  const fetchLowStockReport = async () => {
    setLoading(true)
    try {
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      const response = await axios.get(
        `${API_BASE}/report/inventory/low-stock?threshold=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLowStockData(response.data)
    } catch (error) {
      console.error('Error fetching low stock report:', error)
      const errorMsg = error.response?.data?.message || error.response?.statusText || error.message
      alert(`Failed to fetch low stock report: ${errorMsg}`)
    }
    setLoading(false)
  }

  const handleGenerateReport = () => {
    if (reportType === 'daily') {
      fetchDailyReport()
    } else if (reportType === 'monthly') {
      fetchMonthlyReport()
    } else if (reportType === 'yearly') {
      fetchYearlyReport()
    } else if (reportType === 'lowstock') {
      fetchLowStockReport()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Financial Reports</h1>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
              <option value="lowstock">Low Stock Alert</option>
            </select>

            {reportType === 'daily' && (
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}

            {reportType === 'monthly' && (
              <>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  min="2020"
                  max="2030"
                />
              </>
            )}

            {reportType === 'yearly' && (
              <Input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                min="2020"
                max="2030"
              />
            )}

            <Button onClick={handleGenerateReport} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Loading...' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Report Display */}
      {reportData && reportType !== 'lowstock' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Rs. {reportData.data?.totalSales?.toLocaleString() || 0}</div>
                <p className="text-xs text-gray-500 mt-1">{reportData.data?.salesCount || 0} transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">Rs. {reportData.data?.totalPurchases?.toLocaleString() || 0}</div>
                <p className="text-xs text-gray-500 mt-1">{reportData.data?.purchaseCount || 0} transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">Rs. {reportData.data?.totalDiscount?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${(reportData.data?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rs. {reportData.data?.netProfit?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Transactions */}
          {reportData.data?.salesTransactions && reportData.data.salesTransactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sales Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.data.salesTransactions.map((sale, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-lg">{sale.customerName || 'Customer'}</p>
                          <p className="text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">Rs. {sale.finalAmount?.toLocaleString()}</p>
                          {sale.discount > 0 && <p className="text-sm text-orange-600">Discount: Rs. {sale.discount?.toLocaleString()}</p>}
                        </div>
                      </div>
                      
                      {/* Items in this transaction */}
                      {sale.items && sale.items.length > 0 && (
                        <table className="w-full text-sm mt-2">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left py-2 px-2">Item</th>
                              <th className="text-center py-2 px-2">Qty</th>
                              <th className="text-right py-2 px-2">Unit Price</th>
                              <th className="text-right py-2 px-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sale.items.map((item, itemIdx) => (
                              <tr key={itemIdx} className="border-t">
                                <td className="py-2 px-2">{item.partName || 'N/A'}</td>
                                <td className="py-2 px-2 text-center font-semibold">{item.quantity}</td>
                                <td className="py-2 px-2 text-right">Rs. {item.unitPrice?.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right font-semibold">Rs. {item.total?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purchase Transactions */}
          {reportData.data?.purchaseTransactions && reportData.data.purchaseTransactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Purchase Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.data.purchaseTransactions.map((purchase, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-lg">{purchase.vendorName || 'Vendor'}</p>
                          <p className="text-sm text-gray-500">{new Date(purchase.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">Rs. {purchase.finalAmount?.toLocaleString()}</p>
                          {purchase.discount > 0 && <p className="text-sm text-orange-600">Discount: Rs. {purchase.discount?.toLocaleString()}</p>}
                        </div>
                      </div>
                      
                      {/* Items in this transaction */}
                      {purchase.items && purchase.items.length > 0 && (
                        <table className="w-full text-sm mt-2">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left py-2 px-2">Part</th>
                              <th className="text-center py-2 px-2">Qty</th>
                              <th className="text-right py-2 px-2">Unit Price</th>
                              <th className="text-right py-2 px-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchase.items.map((item, itemIdx) => (
                              <tr key={itemIdx} className="border-t">
                                <td className="py-2 px-2">{item.partName || 'N/A'}</td>
                                <td className="py-2 px-2 text-center font-semibold">{item.quantity}</td>
                                <td className="py-2 px-2 text-right">Rs. {item.unitPrice?.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right font-semibold">Rs. {item.total?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Low Stock Report Display */}
      {lowStockData && (
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Parts (Stock &lt; 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Part Name</th>
                    <th className="text-left py-2 px-4">SKU</th>
                    <th className="text-center py-2 px-4">Current Stock</th>
                    <th className="text-right py-2 px-4">Unit Price</th>
                    <th className="text-right py-2 px-4">Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockData?.map((part, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{part.partName}</td>
                      <td className="py-2 px-4">{part.sku}</td>
                      <td className="py-2 px-4 text-center">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                          {part.currentStock} units
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">Rs. {part.unitPrice?.toLocaleString() || 0}</td>
                      <td className="py-2 px-4 text-right">{part.vendorName}</td>
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

export default AdminReportsPage
