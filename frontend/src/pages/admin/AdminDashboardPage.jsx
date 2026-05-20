import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../store/slices/authSlice";
import Header from '@/components/Header';
import reportApi from '@/apis/reportApi';
import { userApi } from '@/services/userApi';
import { salesApi } from '@/apis/salesApi';
import { AlertCircle, TrendingUp, TrendingDown, Users, Briefcase, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // State for dashboard metrics
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStaff: 0,
    totalCustomers: 0,
    totalSales: 0,
    lowStockParts: 0,
    pendingCredits: 0
  });

  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    revenueChange: 0
  });

  const [lowStockData, setLowStockData] = useState([]);
  const [pendingCreditsData, setPendingCreditsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch financial data (today)
        const financialToday = await reportApi.getDailyFinancialReport();
        if (financialToday.success && financialToday.data) {
          setFinancialData({
            totalRevenue: financialToday.data.totalSales || 0,
            totalExpenses: financialToday.data.totalPurchases || 0,
            netProfit: financialToday.data.netProfit || 0,
            revenueChange: 5.2 // Demo value
          });
        }

        // Fetch user counts - API returns wrapped response with data.data
        const usersResponse = await userApi.getUsers({ page: 1, pageSize: 100 });
        if (usersResponse && usersResponse.data) {
          const allUsers = Array.isArray(usersResponse.data) ? usersResponse.data : [];
          const staffCount = allUsers.filter(u => u.role === 'Staff').length;
          const customerCount = allUsers.filter(u => u.role === 'Customer').length;
          setStats(prev => ({
            ...prev,
            totalUsers: usersResponse.totalUsers || allUsers.length,
            totalStaff: staffCount,
            totalCustomers: customerCount
          }));
        }

        // Fetch sales count - API returns wrapped response
        const salesResponse = await salesApi.getSales({ page: 1, pageSize: 100 });
        if (salesResponse && salesResponse.length > 0) {
          setStats(prev => ({
            ...prev,
            totalSales: salesResponse.length
          }));
        }

        // Fetch low stock parts
        const lowStockResponse = await reportApi.getLowStockParts(10);
        if (lowStockResponse.success && lowStockResponse.data) {
          const lowStockList = Array.isArray(lowStockResponse.data) ? lowStockResponse.data.slice(0, 5) : [];
          setLowStockData(lowStockList);
          setStats(prev => ({
            ...prev,
            lowStockParts: Array.isArray(lowStockResponse.data) ? lowStockResponse.data.length : 0
          }));
        }

        // Fetch pending credits
        const pendingCreditsResponse = await reportApi.getPendingCredits(30);
        if (pendingCreditsResponse.success && pendingCreditsResponse.data) {
          const pendingList = Array.isArray(pendingCreditsResponse.data) ? pendingCreditsResponse.data.slice(0, 5) : [];
          setPendingCreditsData(pendingList);
          setStats(prev => ({
            ...prev,
            pendingCredits: Array.isArray(pendingCreditsResponse.data) ? pendingCreditsResponse.data.length : 0
          }));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Admin Dashboard"
        desc="Monitor business metrics and performance"
        isAdmin={true}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-red-900">Error loading dashboard</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 bg-white rounded-lg shadow p-6 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Welcome Back, {user?.name || 'Admin'}</h2>
          <p className="text-slate-600">Here's what's happening in your business today</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Revenue (Today)</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">Rs. {financialData.totalRevenue.toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-600">+{financialData.revenueChange.toFixed(1)}% from yesterday</p>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Users</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
            <p className="text-sm text-slate-500 mt-2">
              {stats.totalStaff} staff • {stats.totalCustomers} customers
            </p>
          </div>

          {/* Total Sales */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Sales</h3>
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalSales}</p>
            <p className="text-sm text-slate-500 mt-2">Invoices generated</p>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Low Stock Parts</h3>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.lowStockParts}</p>
            <p className="text-sm text-orange-600 mt-2">Needs attention</p>
          </div>
        </div>

        {/* Second Row - Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Low Stock Parts List */}
          <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Low Stock Parts (Top 5)
              </h3>
            </div>
            <div className="divide-y divide-slate-200">
              {isLoading ? (
                <div className="p-6 text-center text-slate-500">Loading...</div>
              ) : lowStockData.length > 0 ? (
                lowStockData.map((part, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{part.partName || 'Unknown Part'}</p>
                      <p className="text-sm text-slate-500">Stock: {part.quantity || 0} units</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      Critical
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500">No low stock parts</div>
              )}
            </div>
          </div>

          {/* Pending Credits List */}
          <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Pending Credits (Top 5)
              </h3>
            </div>
            <div className="divide-y divide-slate-200">
              {isLoading ? (
                <div className="p-6 text-center text-slate-500">Loading...</div>
              ) : pendingCreditsData.length > 0 ? (
                pendingCreditsData.map((credit, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{credit.customerName || 'Unknown Customer'}</p>
                      <p className="text-sm text-slate-500">Due: Rs. {(credit.amountDue || 0).toFixed(2)}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {credit.daysOverdue || 0}d Overdue
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500">No pending credits</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-4 bg-white rounded-lg shadow border border-slate-200 hover:shadow-md hover:border-blue-300 transition text-left"
          >
            <Users className="w-5 h-5 text-blue-600 mb-2" />
            <p className="font-medium text-slate-900">Manage Users</p>
            <p className="text-sm text-slate-500">View all users</p>
          </button>

          <button
            onClick={() => navigate('/admin/parts')}
            className="p-4 bg-white rounded-lg shadow border border-slate-200 hover:shadow-md hover:border-orange-300 transition text-left"
          >
            <AlertTriangle className="w-5 h-5 text-orange-600 mb-2" />
            <p className="font-medium text-slate-900">Low Stock Alert</p>
            <p className="text-sm text-slate-500">{stats.lowStockParts} parts</p>
          </button>

          <button
            onClick={() => navigate('/staff/credits')}
            className="p-4 bg-white rounded-lg shadow border border-slate-200 hover:shadow-md hover:border-red-300 transition text-left"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
            <p className="font-medium text-slate-900">Pending Credits</p>
            <p className="text-sm text-slate-500">{stats.pendingCredits} customers</p>
          </button>

          <button
            onClick={() => navigate('/admin/sales')}
            className="p-4 bg-white rounded-lg shadow border border-slate-200 hover:shadow-md hover:border-green-300 transition text-left"
          >
            <ShoppingCart className="w-5 h-5 text-green-600 mb-2" />
            <p className="font-medium text-slate-900">View Sales</p>
            <p className="text-sm text-slate-500">{stats.totalSales} total</p>
          </button>
        </div>
      </main>
    </div>
  );
}
