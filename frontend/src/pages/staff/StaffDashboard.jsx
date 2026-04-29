import QuickAction from '@/components/QuickAction'
import StatCard from '@/components/StatCard'
import React from 'react'



const StaffDashboard = () => {

    const dummyCustomer =[
        
                {
                  customer: 'Ram Sharma',
                  item: 'Brake Pad Set',
                  amount: 'Rs. 4,500',
                },
                {
                  customer: 'Hari Thapa',
                  item: 'Engine Oil',
                  amount: 'Rs. 2,200',
                },
                {
                  customer: 'Sita Lama',
                  item: 'Battery',
                  amount: 'Rs. 11,000',
                },
              ]
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Staff Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage customers, invoices, parts sales, and daily operations.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value="Rs. 24,500"
          icon="💰"
          color="bg-green-100"
        />

        <StatCard
          title="Invoices Created"
          value="18"
          icon="🧾"
          color="bg-blue-100"
        />

        <StatCard
          title="Pending Credits"
          value="7"
          icon="📌"
          color="bg-yellow-100"
        />

        <StatCard
          title="Appointments Today"
          value="5"
          icon="📅"
          color="bg-purple-100"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <QuickAction title="Add Customer" icon="➕" />
              <QuickAction title="Create Invoice" icon="🧾" />
              <QuickAction title="Search Parts" icon="🛠️" />
              <QuickAction title="View Credits" icon="💰" />
              <QuickAction title="Book Appointment" icon="📅" />
              <QuickAction title="Add Vehicle" icon="🚗" />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Sales
              </h2>

              <button className="text-sm text-blue-600 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {dummyCustomer?.map((sale, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {sale.customer}
                    </p>
                    <p className="text-sm text-gray-500">
                      {sale.item}
                    </p>
                  </div>

                  <p className="font-semibold text-green-600">
                    {sale.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Alerts
            </h2>

            <div className="space-y-3">
              <div className="rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                3 customers have pending credit payments.
              </div>

              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                2 urgent part requests waiting.
              </div>

              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
                5 appointments scheduled today.
              </div>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Today's Progress
            </h2>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Sales Target</span>
                  <span>72%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 w-[72%] rounded-full bg-green-500"></div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Invoices Completed</span>
                  <span>60%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 w-[60%] rounded-full bg-blue-500"></div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Customer Follow-ups</span>
                  <span>40%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 w-[40%] rounded-full bg-yellow-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard