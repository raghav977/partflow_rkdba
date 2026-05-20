import { useParams, useNavigate } from 'react-router-dom';
import { useSaleInvoiceDetail, useSendInvoiceEmail } from '@/hooks/useSales';
import { ArrowLeft, Mail, Printer, Download } from 'lucide-react';
import Header from '@/components/Header';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SalesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError } = useSaleInvoiceDetail(id);
  const sendEmailMutation = useSendInvoiceEmail();
  const [emailInput, setEmailInput] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await sendEmailMutation.mutateAsync({ invoiceId: id, email: emailInput });
      toast.success('Invoice email sent successfully!');
      setShowEmailInput(false);
      setEmailInput('');
    } catch (error) {
      toast.error(error.message || 'Failed to send email');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Invoice Details" desc="" buttonText="" linkhref="" />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Invoice Details" desc="" buttonText="" linkhref="" />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">Invoice not found or error loading data</p>
            <button
              onClick={() => navigate('/staff/sales')}
              className="text-blue-600 hover:underline flex items-center gap-2 justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Invoices
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Invoice Details"
        desc={`Invoice #${invoice.id?.substring(0, 8)}...`}
        buttonText=""
        linkhref=""
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6 print:hidden flex-wrap">
          <button
            onClick={() => navigate('/staff/sales')}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => setShowEmailInput(!showEmailInput)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </button>
        </div>

        {/* Email Input Section */}
        {showEmailInput && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg print:hidden">
            <p className="text-sm font-medium text-slate-900 mb-3">Send Invoice to Email</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendEmail}
                disabled={sendEmailMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors"
              >
                {sendEmailMutation.isPending ? 'Sending...' : 'Send'}
              </button>
              <button
                onClick={() => {
                  setShowEmailInput(false);
                  setEmailInput('');
                }}
                className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Invoice Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none print:p-0">
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">INVOICE</h1>
                <p className="text-slate-600 mt-1">Invoice #: {invoice.id?.substring(0, 8)}...</p>
              </div>
              <div className="text-right text-sm text-slate-600">
                <p className="font-semibold">Created On:</p>
                <p>{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Customer Details</h3>
              <p className="text-slate-700 font-medium">{invoice.customerName}</p>
              {invoice.customerPhone && (
                <p className="text-slate-600">Phone: {invoice.customerPhone}</p>
              )}
              {invoice.customerAddress && (
                <p className="text-slate-600">Address: {invoice.customerAddress}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Vehicle Details</h3>
              <p className="text-slate-700 font-medium">{invoice.vehicleNumber}</p>
              <p className="text-slate-600">
                {invoice.vehicleBrand} {invoice.vehicleModel}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Item Description</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-900">Quantity</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900">Unit Price (Rs.)</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900">Total (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.saleItems?.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="py-3 px-4 text-slate-700">{item.partName}</td>
                    <td className="text-center py-3 px-4 text-slate-700">{item.quantity}</td>
                    <td className="text-right py-3 px-4 text-slate-700">{item.price.toFixed(2)}</td>
                    <td className="text-right py-3 px-4 font-medium text-slate-900">{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal:</span>
                  <span>Rs. {invoice.totalAmount?.toFixed(2)}</span>
                </div>

                {invoice.discount > 0 && (
                  <div className="flex justify-between text-green-700 bg-green-50 px-3 py-2 rounded">
                    <span>Discount ({invoice.discountPercentage}%):</span>
                    <span>-Rs. {invoice.discount?.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-blue-600">
                  <span>Final Total:</span>
                  <span>Rs. {invoice.finalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-xs text-slate-500 print:text-xs">
            <p>Thank you for your business!</p>
            <p className="mt-1">Vehicle Service System - Invoice Generated On {new Date().toLocaleString()}</p>
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          main {
            padding: 0;
            max-width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
