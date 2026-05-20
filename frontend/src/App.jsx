import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'
import AdminLayout from './layouts/admin/AdminLayout'
import LoginPage from './pages/auth/login/Login'
import CustomerRegister from './pages/auth/CustomerRegister'
import StaffLayout from './layouts/staff/StaffLayout'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffCustomer from './pages/staff/StaffCustomer'

import AddNewStaff from './pages/admin/new-staff/AddNewStaff'
import UsersPage from './pages/admin/UsersPage'
import VendorsPage from './pages/admin/VendorsPage'
import PartsPage from './pages/admin/PartsPage'
import AddVendorPage from './pages/admin/new-vendor/AddVendor'
import EditVendorPage from './pages/admin/edit-vendor/EditVendor'
import AddPartPage from './pages/admin/new-part/AddPart'
import EditPartPage from './pages/admin/edit-part/EditPart'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminCustomerPage from './pages/admin/AdminCustomerPage'
import AddNewCustomer from './pages/admin/new-customer/AddNewCustomer'
import AddNewCustomerStaff from './pages/staff/new-customer/AddNewCustomerStaff'
import VehicleListPage from './pages/staff/VehicleListPage'
import AddNewVehicle from './pages/staff/vehicle/new-vehicle/AddNewVehicle'
import SalesListPage from './pages/staff/sales/SalesListPage'
import NewSaleInvoicePage from './pages/staff/sales/NewSaleInvoicePage'
import SalesDetailPage from './pages/staff/sales/SalesDetailPage'
import StaffAppointments from './pages/staff/StaffAppointments'
import CustomerDashboard from './pages/customer/dashboard/CustomerDashboard'
import CustomerLayout from './layouts/customer/CustomerLayout'
import AppointmentsPage from './pages/customer/AppointmentsPage'
import PartRequestsPage from './pages/customer/PartRequestsPage'
import ReviewsPage from './pages/customer/ReviewsPage'
import CustomerVehiclesPage from './pages/customer/CustomerVehiclesPage'
import PurchaseHistoryPage from './pages/customer/PurchaseHistoryPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import StaffReportsPage from './pages/staff/StaffReportsPage'
import AdminPurchaseInvoicesPage from './pages/admin/PurchaseInvoicesPage'
import NewPurchaseInvoicePage from './pages/admin/NewPurchaseInvoicePage'
import PurchaseInvoiceDetailPage from './pages/admin/PurchaseInvoiceDetailPage'
import LowStockPage from './pages/admin/LowStockPage'
import StaffPartsPage from './pages/staff/StaffPartsPage'
import StaffCreditsPage from './pages/staff/StaffCreditsPage'
import StaffRequestsPage from './pages/staff/StaffRequestsPage'


function App() {
  return (
    <>
    <ToastContainer position='top-right' autoClose={3000} newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"/>
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<CustomerRegister />} />

        {/* Admin Dashboard Route */}
       <Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="Admin">
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboardPage />} />
  <Route path="users" element={<UsersPage />} />
  <Route path="users/staff/new" element={<AddNewStaff/>}/>
  <Route path="customers" element={<AdminCustomerPage/>}/>
  <Route path="customers/new" element={<AddNewCustomer/>}/>
  <Route path="vendors" element={<VendorsPage/>}/>
  <Route path="vendors/new" element={<AddVendorPage/>}/>
  <Route path="vendors/edit/:id" element={<EditVendorPage/>}/>
  <Route path="parts" element={<PartsPage/>}/>
  <Route path="parts/new" element={<AddPartPage/>}/>
  <Route path="parts/edit/:id" element={<EditPartPage/>}/>
  <Route path="reports" element={<AdminReportsPage />} />
  <Route path="purchases" element={<AdminPurchaseInvoicesPage />} />
  <Route path="purchases/new" element={<NewPurchaseInvoicePage />} />
  <Route path="purchases/:id" element={<PurchaseInvoiceDetailPage />} />
  <Route path="low-stock" element={<LowStockPage />} />
  {/* <Route path="settings" element={<AdminSettingsPage />} /> */}
</Route>
<Route path='/staff' element={
  <ProtectedRoute requiredRole="Staff">
    <StaffLayout></StaffLayout>
  </ProtectedRoute>
}>
  <Route path='dashboard' element={<StaffDashboard />} />
  <Route path='customers' element={<StaffCustomer/>}/>
  <Route path="customers/new" element={<AddNewCustomerStaff/>}/>
  <Route path="vehicles" element={<VehicleListPage/>}/>
  <Route path="customers/:customerId/add-vehicle" element={<AddNewVehicle/>}/>
  <Route path="sales" element={<SalesListPage/>}/>
  <Route path="sales/new" element={<NewSaleInvoicePage/>}/>
  <Route path="sales/:id" element={<SalesDetailPage/>}/>
  <Route path="appointments" element={<StaffAppointments/>}/>
  <Route path="reports" element={<StaffReportsPage/>}/>
  <Route path="parts" element={<StaffPartsPage/>}/>
  <Route path="credits" element={<StaffCreditsPage/>}/>
  <Route path="requests" element={<StaffRequestsPage/>}/>
</Route>

{/* customer walaa */}
<Route path='/customer' element={
  <ProtectedRoute requiredRole="Customer">
    <CustomerLayout/>
  </ProtectedRoute>
}>
  <Route path='dashboard' element={<CustomerDashboard />} />
  <Route path='appointments' element={<AppointmentsPage />} />
  <Route path='vehicles' element={<CustomerVehiclesPage />} />
  <Route path='requests' element={<PartRequestsPage />} />
  <Route path='reviews' element={<ReviewsPage />} />
  <Route path='history' element={<PurchaseHistoryPage />} />
  </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
