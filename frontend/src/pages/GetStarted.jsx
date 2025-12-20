/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const GetStarted = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Onboarding slides for clients
  const slides = [
    {
      title: 'Send Packages Fast',
      subtitle: 'Order deliveries in minutes from your phone',
      image: '/pic1.jpeg',
      bgColor: 'from-blue-600/20 to-cyan-600/20'
    },
    {
      title: 'Track Your Delivery',
      subtitle: 'See your package move live from pickup to delivery',
      image: '/pic2.jpeg',
      bgColor: 'from-purple-600/20 to-pink-600/20'
    },
    {
      title: 'FastCargo You Can Trust',
      subtitle: 'Professional riders, safe handling, on-time delivery',
      image: '/pic3.jpeg',
      bgColor: 'from-green-600/20 to-emerald-600/20'
    }
  ];

  // Auto-slide functionality (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - next slide
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
    if (isRightSwipe) {
      // Swipe right - previous slide
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-2"
            >
              <span className="text-white">Fast</span>
              <span className="gradient-text">Cargo</span>
            </motion.div>
          </Link>
          <p className="text-gray-400">Welcome to Nigeria's trusted logistics partner</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* LEFT SIDE: Onboarding Slider for Clients */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-2xl"
          >
            {/* Slider Container */}
            <div 
              className="relative overflow-hidden rounded-xl mb-6"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Slide Image */}
                  <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a24" width="400" height="300"/%3E%3Ctext fill="%2300d4ff" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3EFastCargo%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${slides[currentSlide].bgColor} to-transparent`}></div>
                  </div>

                  {/* Slide Content */}
                  <div className="mt-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                      {slides[currentSlide].subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows (Desktop) */}
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-dark-900/80 hover:bg-dark-900 text-white rounded-full p-2 transition-all backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-dark-900/80 hover:bg-dark-900 text-white rounded-full p-2 transition-all backdrop-blur-sm"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 bg-neon-blue' 
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Client Action Button */}
            <Link
              to="/register?role=customer"
              className="btn-primary w-full text-lg text-center block"
            >
              Get Started as a Client
            </Link>
          </motion.div>

          {/* RIGHT SIDE: Driver Registration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">50K+</div>
                <div className="text-gray-400 text-sm">Monthly Deliveries</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">98%</div>
                <div className="text-gray-400 text-sm">On-Time Rate</div>
              </div>
            </div>

            {/* Driver Registration Section */}
            <div className="glass-card p-8 rounded-2xl border-2 border-neon-cyan/30">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🚴</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Are you a Driver or Rider?
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Join our growing fleet and start earning with FastCargo. 
                  Flexible schedule, competitive rates, and full support.
                </p>
              </div>

              {/* Driver Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                  <span>Flexible working hours</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                  <span>Competitive earnings</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                  <span>Full insurance coverage</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                  <span>24/7 support team</span>
                </div>
              </div>

              {/* Driver Registration Button */}
              <Link
                to="/register?role=driver"
                className="btn-primary w-full text-lg text-center block bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                👉 Register as a Driver
              </Link>

              <p className="text-center text-gray-500 text-sm mt-4">
                Already registered? <Link to="/login" className="text-neon-blue hover:text-neon-cyan">Sign in</Link>
              </p>
            </div>

            {/* Additional Info */}
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="text-white font-semibold mb-3">Why Choose FastCargo?</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-neon-blue mt-1">✓</span>
                  <span>Real-time GPS tracking on all deliveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-blue mt-1">✓</span>
                  <span>Instant WhatsApp notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-blue mt-1">✓</span>
                  <span>Proof of delivery with photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-blue mt-1">✓</span>
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Links */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-blue hover:text-neon-cyan transition-colors font-medium">
              Sign In
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
            <Link to="/" className="hover:text-gray-400 transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;