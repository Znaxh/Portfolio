import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LogOut,
  Github,
  Award,
  GraduationCap,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Database
} from 'lucide-react'
import { githubService } from '../../services/githubService'
import { supabaseService } from '../../services/supabaseService'
import { firebaseAuthService } from '../../services/firebaseAuthService'
import { FeaturedProjectsMigration } from '../../utils/migrationUtils'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects')
  const [repositories, setRepositories] = useState([])
  const [featuredRepos, setFeaturedRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState(null)
  const [notification, setNotification] = useState(null)
  
  // Supabase data states
  const [certificates, setCertificates] = useState([])
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState(null)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'add' or 'edit'
  const [modalCategory, setModalCategory] = useState('') // 'certificates', 'education', 'experience'
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  
  const navigate = useNavigate()

  useEffect(() => {
    // Check Firebase authentication
    const unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
      if (user && firebaseAuthService.isAuthenticated()) {
        // User is authenticated and authorized
        const adminData = {
          email: user.email,
          displayName: user.displayName || 'Admin',
          uid: user.uid,
          role: 'admin',
          provider: 'firebase'
        }
        setAdminUser(adminData)
        localStorage.setItem('admin_user', JSON.stringify(adminData))

        // Load data
        fetchRepositories()
        loadFeaturedRepos()
        fetchSupabaseData()

        // Perform migration if needed
        performMigration()
      } else {
        // User is not authenticated or not authorized
        localStorage.removeItem('admin_user')
        navigate('/admin/login')
      }
    })

    return () => unsubscribe()
  }, [navigate])

  // Migration function
  const performMigration = async () => {
    try {
      if (!FeaturedProjectsMigration.isMigrationCompleted()) {
        console.log('Starting featured projects migration...')
        const result = await FeaturedProjectsMigration.performFullMigration()
        setMigrationStatus(result)

        if (result.success) {
          showNotification('success', `Migration completed: ${result.migrated} projects migrated`)
          // Reload featured projects from Supabase
          loadFeaturedRepos()
        } else {
          showNotification('error', `Migration failed: ${result.message}`)
        }
      }
    } catch (error) {
      console.error('Migration error:', error)
      showNotification('error', 'Migration failed')
    }
  }

  // Function to clear all featured repos
  const clearFeaturedRepos = async () => {
    if (!confirm('Are you sure you want to clear all featured projects?')) return

    try {
      // Get all featured projects and mark them as unfeatured
      const result = await supabaseService.getFeaturedProjects()
      if (result.success && result.data.length > 0) {
        // Update all to unfeatured instead of deleting
        const updates = result.data.map(project =>
          supabaseService.updateFeaturedProject(project.id, { is_featured: false })
        )
        await Promise.all(updates)

        setFeaturedRepos([])
        showNotification('success', 'All featured projects cleared')
      }
    } catch (error) {
      console.error('Error clearing featured repos:', error)
      showNotification('error', 'Failed to clear featured projects')
    }
  }

  // Logout function
  const handleLogout = async () => {
    try {
      await firebaseAuthService.signOut()
      localStorage.removeItem('admin_user')
      localStorage.removeItem('featured_repos')
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      showNotification('error', 'Logout failed')
    }
  }

  const fetchRepositories = async () => {
    setLoading(true)
    try {
      const repos = await githubService.getRepositories()
      setRepositories(repos)
    } catch (error) {
      console.error('Error fetching repositories:', error)
      showNotification('error', 'Failed to fetch repositories')
    } finally {
      setLoading(false)
    }
  }

  const loadFeaturedRepos = async () => {
    try {
      const result = await supabaseService.getFeaturedProjects()
      if (result.success) {
        // Transform Supabase data to match the expected format
        const transformedRepos = result.data.map(project => ({
          id: project.github_id,
          name: project.name,
          description: project.description,
          html_url: project.html_url,
          homepage: project.homepage,
          language: project.language,
          stargazers_count: project.stargazers_count,
          forks_count: project.forks_count,
          created_at: project.created_at_github,
          updated_at: project.updated_at_github,
          topics: project.topics || [],
          size: project.size,
          default_branch: project.default_branch,
          private: project.is_private
        }))

        // console.log('Loaded featured repos from Supabase:', transformedRepos.map(repo => repo.name))
        setFeaturedRepos(transformedRepos)
      } else {
        console.error('Failed to load featured repos:', result.error)
        setFeaturedRepos([])
      }
    } catch (error) {
      console.error('Error loading featured repos:', error)
      setFeaturedRepos([])
    }
  }

  const fetchSupabaseData = async () => {
    setSupabaseLoading(true)
    try {
      const result = await supabaseService.getAllData()
      if (result.success) {
        setCertificates(result.data.certificates)
        setEducation(result.data.education)
        setExperience(result.data.experience)
        // Featured projects are loaded separately in loadFeaturedRepos
      } else {
        showNotification('error', 'Failed to fetch data from database')
      }
    } catch (error) {
      console.error('Error fetching Supabase data:', error)
      showNotification('error', 'Database connection error')
    } finally {
      setSupabaseLoading(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Modal handlers
  const openAddModal = (category) => {
    setModalType('add')
    setModalCategory(category)
    setEditingItem(null)
    setFormData({})
    setShowModal(true)
  }

  const openEditModal = (category, item) => {
    setModalType('edit')
    setModalCategory(category)
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setModalCategory('')
    setEditingItem(null)
    setFormData({})
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (modalType === 'add') {
        if (modalCategory === 'certificates') {
          const result = await supabaseService.createCertificate(formData)
          if (result.success) {
            setCertificates(prev => [result.data, ...prev])
            showNotification('success', 'Certificate added successfully')
          } else {
            showNotification('error', 'Failed to add certificate')
          }
        } else if (modalCategory === 'education') {
          const result = await supabaseService.createEducation(formData)
          if (result.success) {
            setEducation(prev => [result.data, ...prev])
            showNotification('success', 'Education added successfully')
          } else {
            showNotification('error', 'Failed to add education')
          }
        } else if (modalCategory === 'experience') {
          const result = await supabaseService.createExperience(formData)
          if (result.success) {
            setExperience(prev => [result.data, ...prev])
            showNotification('success', 'Experience added successfully')
          } else {
            showNotification('error', 'Failed to add experience')
          }
        }
      } else if (modalType === 'edit') {
        if (modalCategory === 'certificates') {
          const result = await supabaseService.updateCertificate(editingItem.id, formData)
          if (result.success) {
            setCertificates(prev => prev.map(cert => cert.id === editingItem.id ? result.data : cert))
            showNotification('success', 'Certificate updated successfully')
          } else {
            showNotification('error', 'Failed to update certificate')
          }
        } else if (modalCategory === 'education') {
          const result = await supabaseService.updateEducation(editingItem.id, formData)
          if (result.success) {
            setEducation(prev => prev.map(edu => edu.id === editingItem.id ? result.data : edu))
            showNotification('success', 'Education updated successfully')
          } else {
            showNotification('error', 'Failed to update education')
          }
        } else if (modalCategory === 'experience') {
          const result = await supabaseService.updateExperience(editingItem.id, formData)
          if (result.success) {
            setExperience(prev => prev.map(exp => exp.id === editingItem.id ? result.data : exp))
            showNotification('success', 'Experience updated successfully')
          } else {
            showNotification('error', 'Failed to update experience')
          }
        }
      }
      closeModal()
    } catch (error) {
      console.error('Error submitting form:', error)
      showNotification('error', 'An error occurred')
    }
  }

  const handleDelete = async (category, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      if (category === 'certificates') {
        const result = await supabaseService.deleteCertificate(id)
        if (result.success) {
          setCertificates(prev => prev.filter(cert => cert.id !== id))
          showNotification('success', 'Certificate deleted successfully')
        } else {
          showNotification('error', 'Failed to delete certificate')
        }
      } else if (category === 'education') {
        const result = await supabaseService.deleteEducation(id)
        if (result.success) {
          setEducation(prev => prev.filter(edu => edu.id !== id))
          showNotification('success', 'Education deleted successfully')
        } else {
          showNotification('error', 'Failed to delete education')
        }
      } else if (category === 'experience') {
        const result = await supabaseService.deleteExperience(id)
        if (result.success) {
          setExperience(prev => prev.filter(exp => exp.id !== id))
          showNotification('success', 'Experience deleted successfully')
        } else {
          showNotification('error', 'Failed to delete experience')
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      showNotification('error', 'An error occurred while deleting')
    }
  }

  // Featured projects management
  const toggleFeaturedRepo = async (repo) => {
    // Validate repo object
    if (!repo || !repo.id || !repo.name) {
      showNotification('error', 'Invalid repository data')
      return
    }

    try {
      const isFeatured = featuredRepos.find(f => f && f.id === repo.id)

      if (isFeatured) {
        // Remove from featured - toggle to unfeatured in Supabase
        const result = await supabaseService.toggleFeaturedProject(repo.id, {
          github_id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stargazers_count: repo.stargazers_count || 0,
          forks_count: repo.forks_count || 0,
          created_at_github: repo.created_at ? new Date(repo.created_at).toISOString() : null,
          updated_at_github: repo.updated_at ? new Date(repo.updated_at).toISOString() : null,
          topics: repo.topics || [],
          size: repo.size,
          default_branch: repo.default_branch,
          is_private: repo.private || false
        })

        if (result.success) {
          // Update local state
          const updatedFeatured = featuredRepos.filter(f => f && f.id !== repo.id)
          setFeaturedRepos(updatedFeatured)
          showNotification('success', `${repo.name} removed from featured projects`)
        } else {
          showNotification('error', `Failed to remove ${repo.name}: ${result.error}`)
        }
      } else {
        // Add to featured (limit to 6 projects)
        if (featuredRepos.length >= 6) {
          showNotification('error', 'You can only feature up to 6 projects')
          return
        }

        // Add to featured in Supabase
        const result = await supabaseService.toggleFeaturedProject(repo.id, {
          github_id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stargazers_count: repo.stargazers_count || 0,
          forks_count: repo.forks_count || 0,
          created_at_github: repo.created_at ? new Date(repo.created_at).toISOString() : null,
          updated_at_github: repo.updated_at ? new Date(repo.updated_at).toISOString() : null,
          topics: repo.topics || [],
          size: repo.size,
          default_branch: repo.default_branch,
          is_private: repo.private || false,
          display_order: featuredRepos.length
        })

        if (result.success) {
          // Update local state
          const repoToAdd = {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stargazers_count: repo.stargazers_count || 0,
            forks_count: repo.forks_count || 0,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            topics: repo.topics || [],
            size: repo.size,
            default_branch: repo.default_branch,
            private: repo.private || false
          }

          const updatedFeatured = [...featuredRepos, repoToAdd]
          setFeaturedRepos(updatedFeatured)
          showNotification('success', `${repo.name} added to featured projects`)
        } else {
          showNotification('error', `Failed to add ${repo.name}: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('Error toggling featured repo:', error)
      showNotification('error', 'An error occurred while updating featured projects')
    }
  }

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Github },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase }
  ]

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {adminUser?.displayName || adminUser?.email}! Manage your portfolio content.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Manage Featured Projects
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select which repositories to feature on your portfolio. Featured projects will appear on your main portfolio page.
              </p>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading repositories...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Featured Projects Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Currently Featured ({featuredRepos.length})
                      </h3>
                      {featuredRepos.length > 0 && (
                        <button
                          onClick={clearFeaturedRepos}
                          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {featuredRepos.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <Github size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          No projects are currently featured
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Select projects from the "Available Repositories" section below to feature them
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {featuredRepos
                          .filter(repo => repo && repo.id && repo.name) // Filter out invalid repos
                          .map((repo) => (
                            <div key={repo.id} className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Github size={16} className="text-green-600" />
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">{repo.name}</h4>
                                    {repo.private && (
                                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Private</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {repo.description || 'No description available'}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    {repo.language && (
                                      <span className="flex items-center space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>{repo.language}</span>
                                      </span>
                                    )}
                                    <span>⭐ {repo.stargazers_count || 0}</span>
                                    <span>🍴 {repo.forks_count || 0}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleFeaturedRepo(repo)}
                                  className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Available Repositories Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Available Repositories ({repositories.filter(repo => !featuredRepos.find(f => f.id === repo.id)).length})
                    </h3>

                    {repositories.length === 0 ? (
                      <div className="text-center py-8">
                        <Github size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          No repositories found. Make sure your GitHub token is configured correctly.
                        </p>
                        <button
                          onClick={fetchRepositories}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Retry Loading
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {repositories
                          .filter(repo => !featuredRepos.find(f => f.id === repo.id))
                          .map((repo) => (
                            <div key={repo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Github size={16} className="text-gray-600" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{repo.name}</h4>
                                    {repo.private && (
                                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Private</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {repo.description || 'No description available'}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    {repo.language && (
                                      <span className="flex items-center space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>{repo.language}</span>
                                      </span>
                                    )}
                                    <span>⭐ {repo.stargazers_count}</span>
                                    <span>🍴 {repo.forks_count}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleFeaturedRepo(repo)}
                                  className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                  Feature
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Manage Certificates
                </h2>
                <button
                  onClick={() => openAddModal('certificates')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Certificate</span>
                </button>
              </div>

              {supabaseLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading certificates...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.length === 0 ? (
                    <div className="text-center py-8">
                      <Award size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No certificates found. Add your first certificate to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{cert.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                {new Date(cert.issue_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal('certificates', cert)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete('certificates', cert.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Manage Education
                </h2>
                <button
                  onClick={() => openAddModal('education')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Education</span>
                </button>
              </div>

              {supabaseLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading education...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {education.length === 0 ? (
                    <div className="text-center py-8">
                      <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No education records found. Add your educational background!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                              <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                {edu.start_year} - {edu.end_year || 'Present'}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal('education', edu)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete('education', edu.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Manage Experience
                </h2>
                <button
                  onClick={() => openAddModal('experience')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Experience</span>
                </button>
              </div>

              {supabaseLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading experience...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experience.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No experience records found. Add your work experience!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                              <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal('experience', exp)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete('experience', exp.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {modalType === 'add' ? 'Add' : 'Edit'} {modalCategory.charAt(0).toUpperCase() + modalCategory.slice(1, -1)}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {modalCategory === 'certificates' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Issuer *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.issuer || ''}
                        onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={formData.issue_date || ''}
                        onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Credential URL
                      </label>
                      <input
                        type="url"
                        value={formData.credential_url || ''}
                        onChange={(e) => setFormData({...formData, credential_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {modalCategory === 'education' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.institution || ''}
                        onChange={(e) => setFormData({...formData, institution: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Degree *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.degree || ''}
                        onChange={(e) => setFormData({...formData, degree: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={formData.field_of_study || ''}
                        onChange={(e) => setFormData({...formData, field_of_study: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Year *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.start_year || ''}
                          onChange={(e) => setFormData({...formData, start_year: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Year
                        </label>
                        <input
                          type="number"
                          value={formData.end_year || ''}
                          onChange={(e) => setFormData({...formData, end_year: e.target.value ? parseInt(e.target.value) : null})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {modalCategory === 'experience' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company || ''}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.position || ''}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Employment Type
                      </label>
                      <select
                        value={formData.employment_type || ''}
                        onChange={(e) => setFormData({...formData, employment_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.start_date || ''}
                          onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formData.end_date || ''}
                          onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {modalType === 'add' ? 'Add' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
