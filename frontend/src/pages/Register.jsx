/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { USER_ROLES, VEHICLE_TYPES, NIGERIAN_STATES } from '../utils/constants';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Get role from URL params if present
  const roleParam = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: roleParam || 'customer',
    // Driver specific fields
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    nin: '',
    address: '',
    city: '',
    state: '',
    // Vehicle images
    vehicleImages: {
      front: null,
      back: null,
      leftSide: null,
      rightSide: null,
      inside: null,
      engine: null
    }
  });

  const [imagePreviews, setImagePreviews] = useState({
    front: null,
    back: null,
    leftSide: null,
    rightSide: null,
    inside: null,
    engine: null
  });

  // Set role from URL params on mount
  useEffect(() => {
    if (roleParam && ['customer', 'driver', 'admin'].includes(roleParam)) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [roleParam]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (position, file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should not exceed 5MB');
        return;
      }

      setFormData({
        ...formData,
        vehicleImages: {
          ...formData.vehicleImages,
          [position]: file
        }
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews({
          ...imagePreviews,
          [position]: reader.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const removeImage = (position) => {
    setFormData({
      ...formData,
      vehicleImages: {
        ...formData.vehicleImages,
        [position]: null
      }
    });
    setImagePreviews({
      ...imagePreviews,
      [position]: null
    });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all basic information');
      return false;
    }
    
    const phoneRegex = /^(\+234|234|0)[789]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Nigerian phone number');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (formData.role !== 'driver') return true;

    if (!formData.vehicleType || !formData.vehicleNumber || !formData.licenseNumber || !formData.nin) {
      toast.error('Please fill all driver information');
      return false;
    }

    if (!formData.address || !formData.city || !formData.state) {
      toast.error('Please fill address information');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (formData.role !== 'driver') return true;

    const requiredImages = ['front', 'back', 'leftSide', 'rightSide', 'inside', 'engine'];
    const missingImages = requiredImages.filter(pos => !formData.vehicleImages[pos]);

    if (missingImages.length > 0) {
      toast.error(`Please upload all vehicle images. Missing: ${missingImages.join(', ')}`);
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role === 'driver' && !validateStep3()) return;

    setLoading(true);

    const { confirmPassword, vehicleImages, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const isDriver = formData.role === 'driver';
  const totalSteps = isDriver ? 3 : 1;

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements - Matching Login Page */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-pink rounded-full blur-3xl animate-pulse-slow animation-delay-400"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* FastCargo Logo/Brand - Matching Login Page */}
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
            Create Your FastCargo Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Send and track deliveries with ease
          </motion.p>
        </div>

        {/* Progress Bar for Drivers */}
        {isDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              {['Basic Info', 'Driver Details', 'Vehicle Photos'].map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep > index + 1 ? 'bg-neon-blue text-white' :
                    currentStep === index + 1 ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/50' :
                    'bg-dark-700 text-gray-500'
                  }`}>
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      currentStep > index + 1 ? 'bg-neon-blue' : 'bg-dark-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Step 1</span>
              <span>Step 2</span>
              <span>Step 3</span>
            </div>
          </motion.div>
        )}

        {/* Registration Form Card - Matching Login Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 rounded-2xl shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Role Selection - Only show if no role param */}
                {!roleParam && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      I want to register as
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {USER_ROLES.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: role.value })}
                          className={`glass-card p-4 rounded-xl transition-all ${
                            formData.role === role.value
                              ? 'neon-border bg-neon-blue/10'
                              : 'border border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-3xl mb-2">{role.icon}</div>
                          <div className="text-sm font-medium">{role.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+234 801 234 5678"
                      required
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      minLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Driver Details */}
            {currentStep === 2 && isDriver && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-neon-blue mb-4">Driver Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select vehicle type</option>
                      {VEHICLE_TYPES.map((vehicle) => (
                        <option key={vehicle.value} value={vehicle.value}>
                          {vehicle.icon} {vehicle.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="ABC-123-XY"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Driver's License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="ABC12345678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      National Identity Number (NIN)
                    </label>
                    <input
                      type="text"
                      name="nin"
                      value={formData.nin}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="12345678901"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Lagos"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Vehicle Photos */}
            {currentStep === 3 && isDriver && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-neon-blue mb-2">Vehicle Photos</h3>
                  <p className="text-gray-400 text-sm">
                    Please upload clear photos of your vehicle from all angles
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { key: 'front', label: 'Front View', icon: '🚗' },
                    { key: 'back', label: 'Back View', icon: '🚙' },
                    { key: 'leftSide', label: 'Left Side', icon: '🚐' },
                    { key: 'rightSide', label: 'Right Side', icon: '🚕' },
                    { key: 'inside', label: 'Inside/Dashboard', icon: '🎛️' },
                    { key: 'engine', label: 'Engine', icon: '⚙️' }
                  ].map((position) => (
                    <div key={position.key} className="glass-card p-4">
                      <div className="text-3xl mb-2 text-center">{position.icon}</div>
                      <p className="text-sm font-medium text-gray-300 mb-3 text-center">
                        {position.label}
                      </p>
                      
                      {imagePreviews[position.key] ? (
                        <div className="relative">
                          <img
                            src={imagePreviews[position.key]}
                            alt={position.label}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(position.key)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <div className="border-2 border-dashed border-white/20 rounded-lg h-32 flex items-center justify-center hover:border-neon-blue transition-colors">
                            <span className="text-gray-500 text-sm">Click to upload</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(position.key, e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ <strong>Important:</strong> All photos must be clear and well-lit. 
                    Vehicle plate numbers should be visible. Images will be verified before approval.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary flex-1"
                >
                  ← Previous
                </button>
              )}

              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex-1"
                >
                  Next →
                </button>
              )}

              {currentStep === totalSteps && (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>{isDriver ? 'Submit for Review' : 'Create Account'}</span>
                  )}
                </button>
              )}
            </div>
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-neon-blue hover:text-neon-cyan transition-colors font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
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

export default Register;