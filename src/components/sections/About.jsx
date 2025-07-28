import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import {
  Code,
  Palette,
  Zap,
  Heart,
  Coffee,
  BookOpen,
  Target,
  Users
} from 'lucide-react'
import profileImg from '../../assets/images/profile.webp'
import { supabaseService } from '../../services/supabaseService'

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [imageLoaded, setImageLoaded] = useState(false)
  const [certificateCount, setCertificateCount] = useState(4) // Default fallback

  // Fetch certificate count from Supabase
  useEffect(() => {
    const fetchCertificateCount = async () => {
      try {
        const result = await supabaseService.getCertificates()
        if (result.success && result.data) {
          setCertificateCount(result.data.length)
        }
      } catch (error) {
        console.error('Error fetching certificates:', error)
        // Keep the default fallback value
      }
    }

    fetchCertificateCount()
  }, [])

  const highlights = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code is my passion."
    },
    {
      icon: Palette,
      title: "Design Focused",
      description: "I believe great UX/UI design is just as important as functionality."
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optimizing for speed and performance in every project I build."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "I thrive in team environments and love sharing knowledge."
    }
  ]

  const stats = [
    { number: "2026", label: "B.Tech Student" },
    { number: "10+", label: "ML Projects" },
    { number: "15+", label: "Technologies" },
    { number: `${certificateCount}+`, label: "Certifications" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="about" className="py-16 md:py-20 px-6 md:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-blue-600 dark:text-blue-400">Me</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate developer with a love for creating digital experiences that make a difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:mr-16 lg:ml-32 gap-8 md:gap-12 items-center mb-16 md:mb-20">
          {/* About Text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 px-2 md:px-4 lg:px-0 lg:pr-16 xl:pr-20"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Hi there! I'm Anurag Pratap Singh 👋
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                I'm a passionate Data Science and AI student at IIIT Raipur, specializing in machine learning
                and artificial intelligence. My journey in tech is driven by curiosity and a desire to solve
                real-world problems using intelligent systems and data-driven solutions.
              </p>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                From building ML pipelines for student performance prediction to developing AI-powered medical
                diagnosis systems, I love creating impactful solutions. I'm also passionate about cybersecurity,
                having completed a virtual internship at CDAC where I enhanced system security for 25+ applications.
              </p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Coffee size={16} />
                <span>Coffee enthusiast</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={16} />
                <span>Lifelong learner</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart size={16} className="text-red-500" />
                <span>Open source contributor</span>
              </div>
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="relative lg:mr-16 lg:ml-16"
          >
            <div className="relative mx-auto w-80 h-80 rounded-2xl overflow-hidden">
              {/* Fallback background with "A" */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <div className="text-white text-6xl font-bold">A</div>
                <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
              </div>

              {/* Actual profile image */}
              <img
                src={profileImg}
                alt="Anurag Pratap Singh"
                className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                fetchPriority="high"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <Code size={24} className="text-blue-600 dark:text-blue-400" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute -bottom-4 -left-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <Palette size={24} className="text-purple-600 dark:text-purple-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Highlights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20 px-2 md:px-0"
        >
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon
            return (
              <motion.div
                key={highlight.title}
                variants={itemVariants}
                className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
                  <IconComponent size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {highlight.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {highlight.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
