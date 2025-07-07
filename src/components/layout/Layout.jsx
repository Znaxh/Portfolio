import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden max-w-full">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-14 md:pt-20 overflow-x-hidden max-w-full"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  )
}

export default Layout
