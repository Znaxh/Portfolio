import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Database, Wifi, WifiOff } from 'lucide-react'
import { supabaseService } from '../../services/supabaseService'

/**
 * Test component to verify real-time synchronization of featured projects
 * This component can be temporarily added to test the real-time functionality
 */
const RealtimeTest = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [updateCount, setUpdateCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial fetch
    fetchFeaturedProjects()

    // Set up real-time subscription
    const subscription = supabaseService.subscribeFeaturedProjects((payload) => {
      console.log('Real-time update received:', payload)
      setLastUpdate(new Date().toLocaleTimeString())
      setUpdateCount(prev => prev + 1)
      setIsConnected(true)
      
      // Refetch data when changes occur
      fetchFeaturedProjects()
    })

    setIsConnected(true)

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe()
        setIsConnected(false)
      }
    }
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true)
      const result = await supabaseService.getFeaturedProjects()
      
      if (result.success) {
        setFeaturedProjects(result.data)
      } else {
        console.error('Failed to fetch featured projects:', result.error)
      }
    } catch (error) {
      console.error('Error fetching featured projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchFeaturedProjects()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Real-time Sync Test
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="text-green-500" size={20} />
            ) : (
              <WifiOff className="text-red-500" size={20} />
            )}
            <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Database size={20} className="text-blue-600" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Featured Projects
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {featuredProjects.length}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <RefreshCw size={20} className="text-green-600" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Updates Received
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {updateCount}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wifi size={20} className="text-purple-600" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Last Update
            </span>
          </div>
          <p className="text-sm font-mono text-purple-600">
            {lastUpdate || 'None'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Current Featured Projects
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <Database size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No featured projects found
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.description || 'No description'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Order: {project.display_order}
                  </p>
                  <p className="text-xs text-gray-400">
                    ID: {project.github_id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          Testing Instructions:
        </h4>
        <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>1. Open this page in multiple browser tabs</li>
          <li>2. Go to the admin dashboard in another tab</li>
          <li>3. Add or remove featured projects</li>
          <li>4. Watch this component update in real-time</li>
          <li>5. Check that the "Updates Received" counter increases</li>
        </ol>
      </div>
    </motion.div>
  )
}

export default RealtimeTest
