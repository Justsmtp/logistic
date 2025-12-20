import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setShowMobileMenu(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrackingClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will get back to you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setShowContactForm(false);
  };

  const services = [
    {
      title: 'Express Delivery',
      description: 'Same-day and next-day nationwide delivery service. Get your packages delivered quickly and efficiently across all major cities.',
      image: '/pic1.jpeg'
    },
    {
      title: 'Freight & Haulage',
      description: 'Heavy goods and long-distance transportation. We handle bulk shipments and oversized cargo with specialized equipment.',
      image: '/pic2.jpeg'
    },
    {
      title: 'Warehouse & Fulfillment',
      description: 'Secure storage and order processing facilities. Climate-controlled warehouses with 24/7 security and inventory management.',
      image: '/pic3.jpeg'
    },
    {
      title: 'E-commerce Logistics',
      description: 'Online store deliveries and returns handling. Seamless integration with your e-commerce platform for automated order fulfillment.',
      image: '/pic4.jpeg'
    },
    {
      title: 'Real-Time Tracking',
      description: 'Live shipment tracking with status updates. Monitor your deliveries with GPS accuracy and receive instant notifications.',
      image: '/pic5.jpeg'
    },
    {
      title: 'International Shipping',
      description: 'Cross-border logistics and customs handling. We manage documentation, duties, and international regulations for smooth deliveries.',
      image: '/pic1.jpeg'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Deliveries Monthly' },
    { value: '1,200+', label: 'Active Fleet' },
    { value: '15,000+', label: 'Business Clients' },
    { value: '98%', label: 'On-Time Delivery' }
  ];

  const testimonials = [
    {
      name: 'Adebayo Enterprises',
      role: 'Manufacturing Company',
      text: 'FastCargo has revolutionized our distribution network. Their freight services are reliable and their tracking system gives us complete visibility.'
    },
    {
      name: 'ShopNow Nigeria',
      role: 'E-commerce Platform',
      text: 'Partnering with FastCargo for our fulfillment needs was the best decision. Same-day delivery has increased our customer satisfaction by 40%.'
    },
    {
      name: 'TechHub Ltd',
      role: 'Electronics Distributor',
      text: 'International shipping made easy. FastCargo handles all customs documentation and ensures our products arrive safely across borders.'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <nav className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="text-3xl font-bold">
                <span className="text-white">Fast</span>
                <span className="gradient-text">Cargo</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('orders')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Orders
              </button>
              <button
                onClick={() => scrollToSection('schedules')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Schedules
              </button>
              <button
                onClick={handleTrackingClick}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Tracking
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Contact
              </button>
              <Link to="/login" className="btn-secondary text-sm px-6">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm px-6">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/10 py-4 space-y-2"
              >
                <button
                  onClick={() => scrollToSection('orders')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 rounded-lg"
                >
                  Orders
                </button>
                <button
                  onClick={() => scrollToSection('schedules')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 rounded-lg"
                >
                  Schedules
                </button>
                <button
                  onClick={handleTrackingClick}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 rounded-lg"
                >
                  Tracking
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 rounded-lg"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 rounded-lg"
                >
                  Contact
                </button>
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link to="/login" className="btn-secondary text-sm text-center">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm text-center">
                    Get Started
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden py-20 md:py-32 cyber-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Fast, Reliable</span>
                <br />
                <span className="gradient-text">Logistics Solutions</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Nigeria's most trusted logistics partner. From express delivery to international shipping, 
                we handle your cargo with speed, care, and complete transparency.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary text-lg px-8">
                  Start Shipping
                </Link>
                <button 
                  onClick={handleTrackingClick}
                  className="btn-secondary text-lg px-8"
                >
                  Track Shipment
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img 
                src="/pic1.jpeg" 
                alt="FastCargo Logistics" 
                className="rounded-2xl shadow-2xl w-full h-64 md:h-80 lg:h-96 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-cyan rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Our </span>
              <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive logistics solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a24" width="400" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">See </span>
              <span className="gradient-text">FastCargo in Action</span>
            </h2>
            <p className="text-xl text-gray-400">
              Watch how we deliver excellence across Nigeria
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card overflow-hidden rounded-2xl max-w-5xl mx-auto"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            >
              <source src="/vid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Our </span>
              <span className="gradient-text">Operations</span>
            </h2>
            <p className="text-xl text-gray-400">
              From highways to warehouses, we're always moving
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['/pic1.jpeg', '/pic2.jpeg', '/pic3.jpeg', '/pic4.jpeg', '/pic5.jpeg', '/pic1.jpeg'].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden card-hover aspect-video"
              >
                <img 
                  src={img} 
                  alt={`FastCargo Operations ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a24" width="400" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EGallery%3C/text%3E%3C/svg%3E';
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="schedules" className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Coverage </span>
              <span className="gradient-text">Across Nigeria</span>
            </h2>
            <p className="text-xl text-gray-400">
              We deliver to every corner of the nation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-4 rounded-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4044014.6939964434!2d5.0!3d9.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0baf7da48d0d%3A0x99a8fe4168c50bc8!2sNigeria!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { region: 'Lagos & South-West', coverage: '100%' },
              { region: 'Abuja & North-Central', coverage: '95%' },
              { region: 'Port Harcourt & South-South', coverage: '98%' }
            ].map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <div className="text-3xl font-bold gradient-text mb-2">{area.coverage}</div>
                <div className="text-white font-medium mb-1">{area.region}</div>
                <div className="text-gray-400 text-sm">Coverage Area</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Orders/Testimonials Section */}
      <section id="orders" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Trusted by </span>
              <span className="gradient-text">Businesses</span>
            </h2>
            <p className="text-xl text-gray-400">
              See what our clients say about our services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Get in </span>
              <span className="gradient-text">Touch</span>
            </h2>
            <p className="text-xl text-gray-400">We're here to help with your logistics needs</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white text-lg">support@fastcargo.ng</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <p className="text-white text-lg">+234 800 FAST CARGO</p>
                  <p className="text-gray-400 text-sm">+234 800 3278 2274</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Address</p>
                  <p className="text-white">Plot 123, Logistics Drive</p>
                  <p className="text-white">Ikeja, Lagos State, Nigeria</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Business Hours</p>
                  <p className="text-white">24/7 Operations</p>
                  <p className="text-gray-400 text-sm">Customer Service: Mon - Sat, 8AM - 8PM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="input-field"
                />
                <textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="input-field min-h-32"
                  required
                ></textarea>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-white">Fast</span>
                <span className="gradient-text">Cargo</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nigeria's leading logistics provider. Fast, reliable, and trusted nationwide delivery services.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection('orders')} className="hover:text-white transition-colors">Orders</button></li>
                <li><button onClick={() => scrollToSection('schedules')} className="hover:text-white transition-colors">Schedules</button></li>
                <li><button onClick={handleTrackingClick} className="hover:text-white transition-colors">Tracking</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Services</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Express Delivery</li>
                <li>Freight & Haulage</li>
                <li>Warehousing</li>
                <li>International Shipping</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Shipping Policy</li>
                <li>Insurance Claims</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 FastCargo. All rights reserved. Delivering excellence across Nigeria.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;