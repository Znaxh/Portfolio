import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  ExternalLink,
  Github,
  Globe,
  Zap,
  Shield,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

const Deployments = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  // Your actual projects from resume
  const deployments = [
    {
      id: 1,
      title: "Student Performance Prediction System",
      description: "Built an ML solution to predict student math performance, enabling early identification of at-risk students using demographics, parental education, and test scores. Features model comparison (CatBoost, XGBoost, RF), automated tuning, async FastAPI services, and a responsive React frontend.",
      image: "/api/placeholder/400/250",
      liveUrl: "https://github.com/Znaxh/Student-Performance-Prediction-System",
      githubUrl: "https://github.com/Znaxh/Student-Performance-Prediction-System",
      technologies: ["Python", "FastAPI", "Scikit-learn", "React", "Tailwind CSS"],
      status: "Live",
      category: "ML/AI"
    },
    {
      id: 2,
      title: "Supply Chain GHG Emissions Prediction",
      description: "Developed a Streamlit app to instantly predict supply chain emissions, replacing manual estimates and supporting ESG reporting for manufacturers. Built ML pipeline using Linear Regression, Random Forest, preprocessing, encoding, scaling, and GridSearchCV.",
      image: "/api/placeholder/400/250",
      liveUrl: "https://github.com/Znaxh/ghg",
      githubUrl: "https://github.com/Znaxh/ghg",
      technologies: ["Python", "Scikit-learn", "Streamlit", "Pandas", "NumPy"],
      status: "Live",
      category: "ML/AI"
    },
    {
      id: 3,
      title: "Kidney Disease Classification System",
      description: "Developed an AI tool for kidney tumor detection from CT scans, reducing diagnosis time and improving accuracy. Built an MLOps pipeline with CNN (VGG16), MLflow, DVC, real-time image processing, and a React + Flask interface with drag-and-drop support.",
      image: "/api/placeholder/400/250",
      liveUrl: "https://github.com/Znaxh/Kidney-Disease-Classification-System",
      githubUrl: "https://github.com/Znaxh/Kidney-Disease-Classification-System",
      technologies: ["Python", "TensorFlow", "Flask", "React", "Docker", "CNN"],
      status: "Live",
      category: "ML/AI"
    },
    {
      id: 4,
      title: "Security Chatbot (Hack-A-Sol Winner)",
      description: "Built an interactive chatbot integrated with Ollama Mistral for real-time security scanning, enabling early detection and resolution of high-risk code vulnerabilities, reducing late-stage fixes by 30%. Won Second Runner-up in Hack-A-Sol Open Track.",
      image: "/api/placeholder/400/250",
      liveUrl: "#",
      githubUrl: "#",
      technologies: ["Python", "Ollama", "Mistral", "Security Scanning", "Chatbot"],
      status: "Development",
      category: "Security"
    }
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Development':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <section id="deployments" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Live <span className="text-blue-600 dark:text-blue-400">Deployments</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore my deployed applications and see them in action. Each project showcases different
            technologies and approaches to solving real-world problems.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {deployments.map((deployment) => (
            <motion.div
              key={deployment.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-4xl font-bold">
                  {deployment.title.split(' ').map(word => word[0]).join('')}
                </div>
                {/* Replace with actual project screenshots */}
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                      <span>{deployment.status}</span>
                    </div>
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                    {deployment.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {deployment.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-gray-400" />
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {deployment.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {deployment.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <a
                    href={deployment.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Live Demo
                  </a>

                  <a
                    href={deployment.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Github size={16} className="mr-2" />
                    Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3">
                <Zap size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fast & Optimized</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                All deployments are optimized for performance and speed
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-3">
                <Shield size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Built with security best practices and reliable hosting
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-3">
                <Smartphone size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Responsive Design</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Fully responsive and mobile-friendly interfaces
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Deployments
