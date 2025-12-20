import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TrackDelivery from './pages/TrackDelivery';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a24',
                color: '#fff',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Routes */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<TrackDelivery />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-dark-900 cyber-grid flex items-center justify-center px-4">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🚫</div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-400 mb-8">
                      The page you're looking for doesn't exist.
                    </p>
                    <a href="/" className="btn-primary">
                      Go to Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;