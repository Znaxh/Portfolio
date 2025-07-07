const GITHUB_USERNAME = 'Znaxh' // Replace with your GitHub username
const GITHUB_API_BASE = 'https://api.github.com'

export const githubService = {
  // Fetch user's public repositories
  async getRepositories() {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        },
        credentials: 'omit', // Don't send cookies
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      const repos = await response.json()
      
      // Filter and format repositories
      return repos
        .filter(repo => !repo.fork) // Only original repos (include both public and private)
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          topics: repo.topics || [],
          size: repo.size,
          default_branch: repo.default_branch,
          private: repo.private
        }))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by most recently updated
    } catch (error) {
      throw error
    }
  },

  // Fetch repository languages
  async getRepositoryLanguages(repoName) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/languages`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        },
        credentials: 'omit',
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      return {}
    }
  },

  // Fetch repository README
  async getRepositoryReadme(repoName) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`)
      
      if (!response.ok) {
        return null
      }
      
      const readme = await response.json()
      return {
        content: atob(readme.content), // Decode base64 content
        download_url: readme.download_url
      }
    } catch (error) {
      return null
    }
  },

  // Get user profile information
  async getUserProfile() {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Website'
        },
        credentials: 'omit',
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      const profile = await response.json()
      return {
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    } catch (error) {
      throw error
    }
  },

  // Get featured repositories (now uses Supabase as primary source)
  async getFeaturedRepositories() {
    try {
      // Import supabaseService dynamically to avoid circular imports
      const { supabaseService } = await import('./supabaseService')

      // Try to get featured repos from Supabase first
      const result = await supabaseService.getFeaturedProjects()

      if (result.success && result.data.length > 0) {
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

        return transformedRepos.filter(repo => !repo.private) // Only return public repos for portfolio
      }

      // Fallback: check localStorage for migration purposes
      const featuredRepos = JSON.parse(localStorage.getItem('featured_repos') || '[]')
      if (featuredRepos.length > 0) {
        return featuredRepos.filter(repo => !repo.private)
      }

      // Default: return top 6 public repositories by stars and recent activity
      const allRepos = await this.getRepositories()
      return allRepos
        .filter(repo => !repo.private && (repo.stargazers_count > 0 || repo.description))
        .slice(0, 6)
    } catch (error) {
      return []
    }
  }
}

// Helper function to get language color (GitHub's language colors)
export const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    SCSS: '#c6538c',
    Vue: '#2c3e50',
    React: '#61dafb',
    Angular: '#dd0031',
    Svelte: '#ff3e00'
  }
  
  return colors[language] || '#6b7280'
}
