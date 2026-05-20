import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Mail, Download } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const PurchaseInvoiceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  const API_BASE = 'http://localhost:5186/api'
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchInvoiceDetail()
  }, [id])

  const fetchInvoiceDetail = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }

      const response = await axios.get(
        `${API_BASE}/purchase/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Fetched invoice:', response.data.data)
      setInvoice(response.data.data)
    } catch (err) {
      console.error('Error fetching invoice:', err)
      const errorMsg = err.response?.data?.message || err.response?.statusText || err.message
      setError(`Failed to fetch invoice: ${errorMsg}`)
    }
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setSendingEmail(true)
    try {
      // Call your API to send email - adjust endpoint as needed
      await axios.post(
        `${API_BASE}/purchase/${id}/send-email`,
        { email: emailInput },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Invoice email sent successfully!')
      setShowEmailInput(false)
      setEmailInput('')
    } catch (err) {
      console.error('Error sending email:', err)
      const errorMsg = err.response?.data?.message || 'Failed to send email'
      toast.error(errorMsg)
    }
    setSendingEmail(false)
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
            <Button
              onClick={() => navigate('/admin/purchases')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold">Purchase Invoice Details</h1>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => navigate('/admin/purchases')}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={() => setShowEmailInput(!showEmailInput)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Email Input Section */}
      {showEmailInput && (
        <Card className="bg-green-50 border-green-300 print:hidden">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-900 mb-3">Send Invoice to Email</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="bg-green-600 hover:bg-green-700"
              >
                {sendingEmail ? 'Sending...' : 'Send'}
              </Button>
              <Button
                onClick={() => {
                  setShowEmailInput(false)
                  setEmailInput('')
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Details */}
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">PURCHASE INVOICE</CardTitle>
              <p className="text-slate-600 text-sm mt-2">Invoice ID: {invoice.id?.substring(0, 8)}...</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Vendor & Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">VENDOR INFORMATION</h3>
              <p className="font-bold text-lg">{invoice.vendorName}</p>
              <p className="text-slate-600 text-sm">{invoice.vendorEmail || 'N/A'}</p>
              <p className="text-slate-600 text-sm">{invoice.vendorPhone || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">INVOICE DATES</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-slate-600 text-xs">Purchase Date</p>
                  <p className="font-semibold">{new Date(invoice.purchaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs">Expected Delivery</p>
                  <p className="font-semibold">{invoice.expectedDeliveryDate ? new Date(invoice.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">PURCHASE ITEMS</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-3 px-3">Part Name</th>
                    <th className="text-right py-3 px-3">Unit Price</th>
                    <th className="text-center py-3 px-3">Quantity</th>
                    <th className="text-right py-3 px-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.purchaseItems && invoice.purchaseItems.length > 0 ? (
                    invoice.purchaseItems.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-3">{item.partName}</td>
                        <td className="py-3 px-3 text-right">Rs. {item.price?.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">{item.quantity}</td>
                        <td className="py-3 px-3 text-right font-semibold">Rs. {(item.price * item.quantity)?.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 px-3 text-center text-slate-500">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="flex justify-end pt-6 border-t">
            <div className="w-full md:w-80 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-700">Subtotal:</span>
                <span className="font-semibold">Rs. {invoice.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Discount:</span>
                <span className="font-semibold">Rs. {invoice.discount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-slate-100 p-3 rounded-lg mt-4">
                <span className="font-bold text-lg">Final Amount:</span>
                <span className="font-bold text-lg text-green-600">Rs. {invoice.finalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="pt-6 border-t">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">NOTES</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PurchaseInvoiceDetailPage
