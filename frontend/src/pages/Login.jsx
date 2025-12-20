/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan rounded-full blur-3xl animate-pulse-slow animation-delay-400"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* FastCargo Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="text-5xl font-bold">
                <span className="text-white">Fast</span>
                <span className="gradient-text">Cargo</span>
              </div>
            </motion.div>
          </Link>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Sign in to track and manage your deliveries
          </motion.p>
        </div>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 rounded-2xl shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email / Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com or +234..."
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-neon-blue hover:text-neon-cyan transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-800 text-gray-500">or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/get-started"
                className="text-neon-blue hover:text-neon-cyan transition-colors font-semibold"
              >
                Get Started
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Track Package Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <Link
            to="/track"
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            Track a package without signing in →
          </Link>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-4"
        >
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;