import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/', section: 'home' },
    { name: 'About', href: '/#about', section: 'about' },
    { name: 'Skills', href: '/#skills', section: 'skills' },
    { name: 'Projects', href: '/#projects', section: 'projects' },
    { name: 'Resume', href: '/resume', section: 'resume' },
    { name: 'Contact', href: '/#contact', section: 'contact' }
  ]

  const handleNavClick = (href, section) => {
    setIsOpen(false)
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        // Navigate to home page first, then scroll to section
        navigate('/')
        // Use setTimeout to ensure the page has loaded before scrolling
        setTimeout(() => {
          const element = document.getElementById(section)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      } else {
        // Already on home page, just scroll to section
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-container ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm md:bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="flex justify-between items-center h-14 md:h-20">
          {/* Logo */}
          <Link to="/" className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400 truncate flex-shrink-0">
            <span className="hidden sm:inline">Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleNavClick(item.href, item.section)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Navigation - Outside container for full width */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`md:hidden overflow-hidden mobile-nav-full-width ${
            scrolled
              ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md'
              : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
          }`}
        >
          <div className="border-t border-gray-200/30 dark:border-gray-700/30">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => {
                      handleNavClick(item.href, item.section)
                      setIsOpen(false)
                    }}
                    className="block w-full px-3 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium text-base"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
