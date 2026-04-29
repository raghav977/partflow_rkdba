import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const StaffLayout = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('StaffLayout - User:', user)

    const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
    };

const sideBarItems = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: '📊' },

  { name: 'Customers', path: '/staff/customers', icon: '👥' },

  { name: 'Vehicles', path: '/staff/vehicles', icon: '🚗' },

  { name: 'Sales', path: '/staff/sales', icon: '🧾' },
  { name: 'Create Invoice', path: '/staff/invoices/create', icon: '💳' },

  { name: 'Parts Search', path: '/staff/parts', icon: '🛠️' },

  { name: 'Pending Credits', path: '/staff/credits', icon: '💰' },

  { name: 'Appointments', path: '/staff/appointments', icon: '📅' },

  { name: 'Part Requests', path: '/staff/requests', icon: '📦' },

  { name: 'Settings', path: '/staff/settings', icon: '⚙️' },
]

  const sidebarWidth = isOpen ? 'w-64' : 'w-20'
  const contentMargin = isOpen ? 'ml-64' : 'ml-20'

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen ${sidebarWidth} bg-gray-900 text-white transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {isOpen && (
            <h1 className="font-bold text-lg tracking-wide">
              PartFlow
            </h1>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl hover:text-blue-400 transition"
          >
            ☰
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-72px)]">
          {sideBarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Right Side Content */}
      <div
        className={`${contentMargin} transition-all duration-300 min-h-screen flex flex-col`}
      >
        {/* Fixed Top Header */}
        <header className="sticky top-0 z-30 bg-white shadow px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            staff Dashboard
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name}
              <br></br>
              Email: {user?.email}
            </span>

            <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Main Page Area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StaffLayout