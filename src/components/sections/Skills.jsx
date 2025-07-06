import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Code,
  Database,
  Palette,
  Server,
  Smartphone,
  Globe,
  GitBranch,
  Terminal,
  Layers,
  Zap,
  Cloud,
  Settings
} from 'lucide-react'

const Skills = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "Python", level: 95, icon: "🐍" },
        { name: "JavaScript", level: 85, icon: "🟨" },
        { name: "C/C++", level: 80, icon: "⚙️" },
        { name: "SQL", level: 85, icon: "🗃️" },
        { name: "HTML/CSS", level: 90, icon: "🎨" }
      ]
    },
    {
      title: "ML & AI Frameworks",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "TensorFlow", level: 85, icon: "🧠" },
        { name: "Scikit-learn", level: 90, icon: "📊" },
        { name: "CatBoost", level: 80, icon: "🐱" },
        { name: "XGBoost", level: 80, icon: "🚀" },
        { name: "OpenCV", level: 75, icon: "👁️" },
        { name: "Hugging Face", level: 70, icon: "🤗" }
      ]
    },
    {
      title: "Web & Tools",
      icon: Settings,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "React.js", level: 85, icon: "⚛️" },
        { name: "Node.js", level: 80, icon: "🟢" },
        { name: "FastAPI", level: 85, icon: "⚡" },
        { name: "Streamlit", level: 90, icon: "🎯" },
        { name: "Docker", level: 75, icon: "🐳" },
        { name: "Git", level: 90, icon: "📝" }
      ]
    },
    {
      title: "Data & Databases",
      icon: Database,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "MongoDB", level: 80, icon: "🍃" },
        { name: "MySQL", level: 85, icon: "🐬" },
        { name: "MLflow", level: 75, icon: "📈" },
        { name: "DVC", level: 70, icon: "🔄" },
        { name: "Pandas", level: 90, icon: "🐼" },
        { name: "NumPy", level: 85, icon: "🔢" }
      ]
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

  const categoryVariants = {
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

  const skillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="skills" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Skills & <span className="text-blue-600 dark:text-blue-400">Expertise</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels across different technologies and tools.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.title}
                variants={categoryVariants}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${category.color} mb-4`}>
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      variants={skillVariants}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{skill.icon}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{
                            duration: 1,
                            delay: categoryIndex * 0.2 + skillIndex * 0.1,
                            ease: "easeOut"
                          }}
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
