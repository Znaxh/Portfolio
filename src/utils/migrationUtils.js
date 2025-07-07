import { supabaseService } from '../services/supabaseService'

/**
 * Migration utility to move featured projects from localStorage to Supabase
 */
export class FeaturedProjectsMigration {
  static MIGRATION_KEY = 'featured_projects_migrated'
  static LOCALSTORAGE_KEY = 'featured_repos'

  /**
   * Check if migration has already been completed
   */
  static isMigrationCompleted() {
    return localStorage.getItem(this.MIGRATION_KEY) === 'true'
  }

  /**
   * Mark migration as completed
   */
  static markMigrationCompleted() {
    localStorage.setItem(this.MIGRATION_KEY, 'true')
  }

  /**
   * Get featured projects from localStorage
   */
  static getLocalStorageProjects() {
    try {
      const saved = localStorage.getItem(this.LOCALSTORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.filter(repo => repo && repo.id && repo.name)
      }
      return []
    } catch (error) {
      return []
    }
  }

  /**
   * Transform localStorage project data to Supabase format
   */
  static transformProjectData(localProject, index = 0) {
    return {
      github_id: localProject.id,
      name: localProject.name,
      description: localProject.description || null,
      html_url: localProject.html_url,
      homepage: localProject.homepage || null,
      language: localProject.language || null,
      stargazers_count: localProject.stargazers_count || 0,
      forks_count: localProject.forks_count || 0,
      created_at_github: localProject.created_at ? new Date(localProject.created_at).toISOString() : null,
      updated_at_github: localProject.updated_at ? new Date(localProject.updated_at).toISOString() : null,
      topics: localProject.topics || [],
      size: localProject.size || 0,
      default_branch: localProject.default_branch || 'main',
      is_private: localProject.private || false,
      display_order: index,
      is_featured: true
    }
  }

  /**
   * Migrate featured projects from localStorage to Supabase
   */
  static async migrateToSupabase() {
    try {
      // Check if migration already completed
      if (this.isMigrationCompleted()) {
        return { success: true, message: 'Migration already completed', migrated: 0 }
      }

      // Get projects from localStorage
      const localProjects = this.getLocalStorageProjects()

      if (localProjects.length === 0) {
        this.markMigrationCompleted()
        return { success: true, message: 'No projects to migrate', migrated: 0 }
      }

      // Transform and migrate each project
      const migrationResults = []
      for (let i = 0; i < localProjects.length; i++) {
        const project = localProjects[i]
        const transformedProject = this.transformProjectData(project, i)

        const result = await supabaseService.createFeaturedProject(transformedProject)
        
        migrationResults.push({
          project: project.name,
          success: result.success,
          error: result.error
        })
      }

      // Check migration results
      const successful = migrationResults.filter(r => r.success).length
      const failed = migrationResults.filter(r => !r.success).length

      if (failed === 0) {
        // All migrations successful
        this.markMigrationCompleted()
        return {
          success: true,
          message: `Successfully migrated ${successful} projects`,
          migrated: successful,
          results: migrationResults
        }
      } else {
        // Some migrations failed
        return {
          success: false,
          message: `Migration completed with ${failed} failures`,
          migrated: successful,
          failed: failed,
          results: migrationResults
        }
      }

    } catch (error) {
      return {
        success: false,
        message: 'Migration failed',
        error: error.message
      }
    }
  }

  /**
   * Clean up localStorage after successful migration
   */
  static cleanupLocalStorage() {
    try {
      if (this.isMigrationCompleted()) {
        localStorage.removeItem(this.LOCALSTORAGE_KEY)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  /**
   * Reset migration (for testing purposes)
   */
  static resetMigration() {
    localStorage.removeItem(this.MIGRATION_KEY)
  }

  /**
   * Full migration process with cleanup
   */
  static async performFullMigration() {
    const result = await this.migrateToSupabase()
    
    if (result.success && result.migrated > 0) {
      // Only cleanup if migration was successful and projects were migrated
      this.cleanupLocalStorage()
    }
    
    return result
  }
}

export default FeaturedProjectsMigration
