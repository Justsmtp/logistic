import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import DriverDashboard from '../components/DriverDashboard';
import CustomerDashboard from '../components/CustomerDashboard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  // Render dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'driver':
      return <DriverDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Invalid User Role</h2>
            <p className="text-gray-400">Please contact support.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;