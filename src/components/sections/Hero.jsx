import { motion } from 'framer-motion'
import { Download, Mail, Github, Linkedin, ChevronDown } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const Hero = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden w-full max-w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center relative z-10 max-w-4xl mx-auto w-full px-2"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 break-words">
            Hello, I'm{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Anurag Pratap Singh
            </span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-4">
            Data Science & AI Student | ML Engineer
          </p>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate about leveraging AI and machine learning to solve real-world problems.
            Building intelligent systems that make a difference.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://drive.google.com/uc?export=download&id=1Md7dMGyj3YX1Ny7HP3xdeuEPczrjK_Zi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Download size={20} className="mr-2" />
              Download Resume
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToContact}
              className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              <Mail size={20} className="mr-2" />
              Contact Me
            </motion.button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <motion.a
              whileHover={{ scale: 1.2, y: -2 }}
              href="https://github.com/Znaxh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, y: -2 }}
              href="https://linkedin.com/in/znaxh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Linkedin size={24} />
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            onClick={handleScrollToAbout}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <ChevronDown size={32} />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
