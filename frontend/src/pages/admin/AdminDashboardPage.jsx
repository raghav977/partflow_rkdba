import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logout} from "../../store/slices/authSlice";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-3 bg-white rounded-lg shadow p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Welcome to PartFlow Admin</h2>
            <p className="text-slate-600">You are successfully authenticated as an Admin. More features coming soon!</p>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Users</h3>
            <p className="text-3xl font-bold text-slate-900">-</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Staff</h3>
            <p className="text-3xl font-bold text-slate-900">-</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Customers</h3>
            <p className="text-3xl font-bold text-slate-900">-</p>
          </div>
        </div>
      </main>
    </div>
  );
}
