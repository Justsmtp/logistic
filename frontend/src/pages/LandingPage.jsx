/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    alert('Thank you! We will get back to you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setShowContactForm(false);
  };

  const features = [
    {
      icon: '📦',
      title: 'Real-Time Tracking',
      description: 'Track your deliveries in real-time with GPS accuracy'
    },
    {
      icon: '🚚',
      title: 'Professional Drivers',
      description: 'Verified and experienced drivers for safe delivery'
    },
    {
      icon: '📱',
      title: 'WhatsApp Updates',
      description: 'Get instant notifications via WhatsApp'
    },
    {
      icon: '📸',
      title: 'Proof of Delivery',
      description: 'Photo and GPS proof for every delivery'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'Clear pricing with no hidden charges'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Your packages are in safe hands'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Deliveries Completed' },
    { value: '500+', label: 'Active Drivers' },
    { value: '5,000+', label: 'Happy Customers' },
    { value: '50+', label: 'Cities Covered' }
  ];

  const team = [
    {
      name: 'John Adebayo',
      role: 'CEO & Founder',
      image: '👨‍💼',
      bio: '10+ years in logistics management'
    },
    {
      name: 'Sarah Okonkwo',
      role: 'CTO',
      image: '👩‍💻',
      bio: 'Tech innovator in delivery solutions'
    },
    {
      name: 'Michael Eze',
      role: 'Operations Manager',
      image: '👨‍💼',
      bio: 'Expert in fleet management'
    },
    {
      name: 'Blessing Chukwu',
      role: 'Customer Success',
      image: '👩‍💼',
      bio: 'Dedicated to customer satisfaction'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid">
      {/* Navigation */}
      <nav className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                🚚
              </motion.div>
              <h1 className="text-2xl font-bold gradient-text">LogiTrack</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('home')}
                className="text-gray-300 hover:text-neon-blue transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-300 hover:text-neon-blue transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-neon-blue transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className="text-gray-300 hover:text-neon-blue transition-colors"
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-neon-blue transition-colors"
              >
                Contact
              </button>
              <Link to="/login" className="btn-secondary text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">Logistics</span>
                <br />
                Made Simple
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Track your deliveries in real-time with complete transparency. 
                Professional drivers, instant notifications, and proof of delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary">
                  🚀 Start Shipping
                </Link>
                <Link to="/track" className="btn-secondary">
                  📍 Track Package
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="text-9xl animate-float">🚚</div>
              <div className="absolute top-0 right-0 text-6xl animate-float animation-delay-200">📦</div>
              <div className="absolute bottom-0 left-0 text-6xl animate-float animation-delay-400">📱</div>
            </motion.div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-purple rounded-full blur-3xl"></div>
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

      {/* About Us Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">About LogiTrack</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're revolutionizing logistics in Nigeria with technology-driven solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="text-3xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 mb-6">
                To provide transparent, reliable, and efficient logistics solutions that connect 
                businesses and individuals across Nigeria. We believe in leveraging technology 
                to make delivery tracking seamless and trustworthy.
              </p>
              <p className="text-gray-400">
                Founded in 2024, LogiTrack has quickly become a trusted name in the logistics 
                industry, serving thousands of customers with our innovative platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="text-3xl font-bold text-white mb-4">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  'Real-time GPS tracking',
                  'Professional & verified drivers',
                  'Instant WhatsApp notifications',
                  'Photo proof of delivery',
                  'Transparent pricing',
                  '24/7 customer support'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <span className="text-neon-blue text-xl">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Team Section */}
          <div>
            <h3 className="text-3xl font-bold text-center text-white mb-12">Meet Our Team</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center card-hover"
                >
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                  <p className="text-neon-blue text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need for seamless delivery management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 card-hover"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience/Reports Section */}
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Customer Experience
            </h2>
            <p className="text-xl text-gray-400">
              What our customers say about us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Chinedu Okoro',
                role: 'E-commerce Owner',
                rating: 5,
                text: 'LogiTrack has transformed how we handle deliveries. The real-time tracking gives our customers confidence!'
              },
              {
                name: 'Amina Bello',
                role: 'Small Business',
                rating: 5,
                text: 'Professional drivers and transparent pricing. I can focus on my business knowing deliveries are handled well.'
              },
              {
                name: 'Tunde Williams',
                role: 'Regular Customer',
                rating: 5,
                text: 'The WhatsApp updates are amazing! I always know exactly where my package is. Highly recommended!'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-400">We'd love to hear from you</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📧</div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">support@logitrack.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">+234 800 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white">123 Logistics Avenue, Ikeja, Lagos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🕒</div>
                  <div>
                    <p className="text-gray-400 text-sm">Business Hours</p>
                    <p className="text-white">Mon - Sat: 8AM - 6PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🚚</span>
                <h3 className="text-xl font-bold gradient-text">LogiTrack</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Making logistics simple, transparent, and reliable across Nigeria.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-neon-blue">About Us</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-neon-blue">Features</button></li>
                <li><Link to="/track" className="hover:text-neon-blue">Track Package</Link></li>
                <li><Link to="/register" className="hover:text-neon-blue">Register</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Express Delivery</li>
                <li>Bulk Shipping</li>
                <li>E-commerce Integration</li>
                <li>Business Solutions</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 LogiTrack. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                <span className="text-2xl">📷</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                <span className="text-2xl">💼</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;