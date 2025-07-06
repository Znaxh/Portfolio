import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Filter,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  ExternalLink,
  Github,
  Linkedin,
  Trophy,
  Loader2
} from 'lucide-react'
import { supabaseService } from '../services/supabaseService'

const Resume = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [loading, setLoading] = useState(true)
  const [supabaseData, setSupabaseData] = useState({
    certificates: [],
    education: [],
    experience: []
  })

  useEffect(() => {
    fetchResumeData()
  }, [])

  const fetchResumeData = async () => {
    setLoading(true)
    try {
      const result = await supabaseService.getAllData()
      if (result.success) {
        setSupabaseData(result.data)
      } else {
        console.error('Failed to fetch resume data:', result.error)
        // Fallback to static data if Supabase fails
        setSupabaseData({
          certificates: staticCertifications,
          education: staticEducation,
          experience: staticExperiences
        })
      }
    } catch (error) {
      console.error('Error fetching resume data:', error)
      // Fallback to static data
      setSupabaseData({
        certificates: staticCertifications,
        education: staticEducation,
        experience: staticExperiences
      })
    } finally {
      setLoading(false)
    }
  }

  const personalInfo = {
    name: "Anurag Pratap Singh",
    title: "Data Science & AI Student",
    email: "znaxxh@gmail.com",
    phone: "+91-7974398795",
    location: "Raipur, Chhattisgarh",
    website: "https://your-portfolio.com",
    github: "https://github.com/Znaxh",
    linkedin: "https://linkedin.com/in/znaxh",
    kaggle: "https://www.kaggle.com/znaxxh"
  }

  // Static fallback data
  const staticExperiences = [
    {
      id: 1,
      type: "experience",
      company: "CDAC",
      position: "Virtual Cybersecurity Intern",
      location: "Remote",
      startDate: "June 2024",
      endDate: "Aug 2024",
      year: 2024,
      description: [
        "Performed network monitoring and vulnerability scans using Wireshark, NMAP, and Nuclei, identifying and resolving 150+ security issues",
        "Utilized Google Dorks and DNS enumeration to enhance web security",
        "Led a six-week assessment uncovering RDP and SMB vulnerabilities",
        "Implemented layered defenses, improving system resilience and ensuring compliance for 25+ applications"
      ],
      technologies: ["Wireshark", "NMAP", "Nuclei", "DNS Enumeration", "Network Security", "Vulnerability Assessment"]
    }
  ]

  const staticEducation = [
    {
      id: 2,
      type: "education",
      institution: "International Institute Of Information Technology",
      degree: "B-tech in Data Science And Artificial Intelligence",
      location: "Raipur, Chhattisgarh",
      startDate: "2022",
      endDate: "2026",
      year: 2022,
      description: [
        "Currently pursuing B.Tech in Data Science and Artificial Intelligence",
        "Relevant coursework: Machine Learning, Deep Learning, Data Structures, Algorithms",
        "Active in technical clubs and hackathons",
        "Focus on AI/ML applications and research"
      ],
      technologies: ["Python", "Machine Learning", "Deep Learning", "Data Science", "AI"]
    },
    {
      id: 3,
      type: "education",
      institution: "Dronacharya Public School",
      degree: "Senior Secondary (XII) in Science",
      location: "Raipur, Chhattisgarh",
      startDate: "2019",
      endDate: "2021",
      year: 2019,
      description: [
        "Completed Senior Secondary education with Science stream",
        "Strong foundation in Mathematics, Physics, and Chemistry",
        "Developed early interest in computer science and programming"
      ],
      technologies: ["Mathematics", "Physics", "Chemistry", "Computer Science"]
    }
  ]

  const staticCertifications = [
    {
      id: 4,
      type: "certification",
      name: "Intermediate Machine Learning",
      issuer: "Kaggle",
      date: "2025",
      year: 2025,
      description: ["Advanced machine learning techniques and model optimization"],
      technologies: ["Machine Learning", "Python", "Data Science"],
      credentialUrl: "https://www.kaggle.com/learn/certification/znaxxh/intermediate-machine-learning"
    },
    {
      id: 5,
      type: "certification",
      name: "AI Text Summarizer App",
      issuer: "Postman",
      date: "2024",
      year: 2024,
      description: ["Building AI-powered applications using APIs"],
      technologies: ["AI", "APIs", "Postman"],
      credentialUrl: "https://verify.skilljar.com/c/3svykujgu5xd"
    },
    {
      id: 6,
      type: "certification",
      name: "Implement Load Balancing on Compute Engine (Skill Badge)",
      issuer: "Google Cloud",
      date: "2024",
      year: 2024,
      description: ["Google Cloud Platform skills and load balancing techniques"],
      technologies: ["Google Cloud", "Load Balancing", "Cloud Computing"],
      credentialUrl: "https://www.credly.com/badges/70b06b21-8548-442d-8591-ae8c6390af64/linked_in_profile"
    },
    {
      id: 7,
      type: "certification",
      name: "API Fundamentals Student Expert",
      issuer: "Postman",
      date: "2024",
      year: 2024,
      description: ["API development and testing fundamentals"],
      technologies: ["APIs", "Postman", "Web Development"],
      credentialUrl: "https://badgr.com/public/assertions/7enItB4nQwOmHzcxukO6lA?identity__email=anurag22102%40iiitnr.edu.in"
    },
    // Add more LinkedIn certificates here
    {
      id: 8,
      type: "certification",
      name: "Python for Data Science",
      issuer: "LinkedIn Learning",
      date: "2024",
      year: 2024,
      description: ["Python programming fundamentals for data science applications"],
      technologies: ["Python", "Data Science", "Programming"],
      credentialUrl: "#" // Replace with actual LinkedIn certificate URL
    },
    {
      id: 9,
      type: "certification",
      name: "Machine Learning Foundations",
      issuer: "LinkedIn Learning",
      date: "2024",
      year: 2024,
      description: ["Core concepts and algorithms in machine learning"],
      technologies: ["Machine Learning", "Algorithms", "Data Analysis"],
      credentialUrl: "#" // Replace with actual LinkedIn certificate URL
    }
  ]

  // Process Supabase data to match expected format
  const processSupabaseData = () => {
    const processedExperience = supabaseData.experience.map(exp => ({
      ...exp,
      type: 'experience',
      year: new Date(exp.start_date).getFullYear(),
      startDate: new Date(exp.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      endDate: exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present',
      description: exp.responsibilities || [exp.description],
      technologies: exp.technologies || []
    }))

    const processedEducation = supabaseData.education.map(edu => ({
      ...edu,
      type: 'education',
      year: edu.start_year,
      startDate: edu.start_year.toString(),
      endDate: edu.end_year ? edu.end_year.toString() : 'Present',
      description: edu.achievements || [edu.description],
      technologies: []
    }))

    const processedCertificates = supabaseData.certificates.map(cert => ({
      ...cert,
      type: 'certification',
      name: cert.title,
      issuer: cert.issuer,
      year: new Date(cert.issue_date).getFullYear(),
      date: new Date(cert.issue_date).getFullYear().toString(),
      description: [cert.description],
      technologies: cert.skills || [],
      credentialUrl: cert.credential_url
    }))

    return [...processedExperience, ...processedEducation, ...processedCertificates]
  }

  const allItems = processSupabaseData()
  const years = [...new Set(allItems.map(item => item.year))].sort((a, b) => b - a)

  const filteredItems = allItems.filter(item => {
    const typeMatch = activeFilter === 'all' || item.type === activeFilter
    const yearMatch = selectedYear === 'all' || item.year.toString() === selectedYear
    return typeMatch && yearMatch
  })

  const filterOptions = [
    { value: 'all', label: 'All', icon: Filter },
    { value: 'experience', label: 'Experience', icon: Briefcase },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'certification', label: 'Certifications', icon: Award }
  ]

  const handleDownloadResume = () => {
    // Open Google Drive direct download link
    window.open('https://drive.google.com/uc?export=download&id=1Md7dMGyj3YX1Ny7HP3xdeuEPczrjK_Zi', '_blank')
  }

  const getItemIcon = (type) => {
    switch (type) {
      case 'experience':
        return Briefcase
      case 'education':
        return GraduationCap
      case 'certification':
        return Award
      default:
        return Briefcase
    }
  }

  const getItemColor = (type) => {
    switch (type) {
      case 'experience':
        return 'from-blue-500 to-cyan-500'
      case 'education':
        return 'from-green-500 to-emerald-500'
      case 'certification':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 pb-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading resume data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive <span className="text-blue-600 dark:text-blue-400">Resume</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Explore my professional journey, education, and achievements
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadResume}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            <Download size={20} className="mr-2" />
            Download PDF Resume
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Personal Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">A</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{personalInfo.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{personalInfo.title}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{personalInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{personalInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{personalInfo.location}</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href={personalInfo.kaggle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Trophy size={20} />
                </a>
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Filter by Type</h4>
              <div className="space-y-2">
                {filterOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => setActiveFilter(option.value)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        activeFilter === option.value
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{option.label}</span>
                    </button>
                  )
                })}
              </div>

              <h4 className="font-bold text-gray-900 dark:text-white mb-4 mt-6">Filter by Year</h4>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6">
              {filteredItems.map((item, index) => {
                const IconComponent = getItemIcon(item.type)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 p-3 bg-gradient-to-r ${getItemColor(item.type)} rounded-lg`}>
                        <IconComponent size={24} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {item.position || item.degree || item.name}
                            </h3>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                              {item.company || item.institution || item.issuer}
                            </p>
                          </div>
                          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>
                                {item.startDate} - {item.endDate || item.date}
                              </span>
                            </div>
                            {item.location && (
                              <div className="flex items-center space-x-1 mt-1">
                                <MapPin size={14} />
                                <span>{item.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <ul className="space-y-2 mb-4">
                          {item.description.map((desc, idx) => (
                            <li key={idx} className="text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                              {desc}
                            </li>
                          ))}
                        </ul>

                        {item.technologies && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* View Credential Button for Certifications */}
                        {item.type === 'certification' && item.credentialUrl && item.credentialUrl !== '#' && (
                          <div className="mt-4">
                            <a
                              href={item.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                            >
                              <ExternalLink size={14} className="mr-2" />
                              View Credential
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No items found for the selected filters.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Resume
