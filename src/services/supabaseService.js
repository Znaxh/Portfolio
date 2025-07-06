import { supabase, TABLES } from '../lib/supabase'

// Generic CRUD operations
class SupabaseService {
  // CREATE operations
  async create(table, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data: result }
    } catch (error) {
      console.error(`Error creating ${table}:`, error)
      return { success: false, error: error.message }
    }
  }

  // READ operations
  async getAll(table, orderBy = 'created_at') {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(orderBy, { ascending: false })
      
      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error(`Error fetching ${table}:`, error)
      return { success: false, error: error.message, data: [] }
    }
  }

  async getById(table, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error(`Error fetching ${table} by id:`, error)
      return { success: false, error: error.message }
    }
  }

  // UPDATE operations
  async update(table, id, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data: result }
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      return { success: false, error: error.message }
    }
  }

  // DELETE operations
  async delete(table, id) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error(`Error deleting ${table}:`, error)
      return { success: false, error: error.message }
    }
  }

  // Specific methods for each table
  
  // CERTIFICATES
  async getCertificates() {
    return this.getAll(TABLES.CERTIFICATES, 'issue_date')
  }

  async createCertificate(certificateData) {
    return this.create(TABLES.CERTIFICATES, {
      ...certificateData,
      created_at: new Date().toISOString()
    })
  }

  async updateCertificate(id, certificateData) {
    return this.update(TABLES.CERTIFICATES, id, certificateData)
  }

  async deleteCertificate(id) {
    return this.delete(TABLES.CERTIFICATES, id)
  }

  // EDUCATION
  async getEducation() {
    return this.getAll(TABLES.EDUCATION, 'start_year')
  }

  async createEducation(educationData) {
    return this.create(TABLES.EDUCATION, {
      ...educationData,
      created_at: new Date().toISOString()
    })
  }

  async updateEducation(id, educationData) {
    return this.update(TABLES.EDUCATION, id, educationData)
  }

  async deleteEducation(id) {
    return this.delete(TABLES.EDUCATION, id)
  }

  // EXPERIENCE
  async getExperience() {
    return this.getAll(TABLES.EXPERIENCE, 'start_date')
  }

  async createExperience(experienceData) {
    return this.create(TABLES.EXPERIENCE, {
      ...experienceData,
      created_at: new Date().toISOString()
    })
  }

  async updateExperience(id, experienceData) {
    return this.update(TABLES.EXPERIENCE, id, experienceData)
  }

  async deleteExperience(id) {
    return this.delete(TABLES.EXPERIENCE, id)
  }

  // FEATURED PROJECTS
  async getFeaturedProjects() {
    try {
      const { data, error } = await supabase
        .from(TABLES.FEATURED_PROJECTS)
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('updated_at_github', { ascending: false })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  async createFeaturedProject(projectData) {
    try {
      // Check if project already exists
      const { data: existing, error: queryError } = await supabase
        .from(TABLES.FEATURED_PROJECTS)
        .select('id')
        .eq('github_id', String(projectData.github_id))
        .maybeSingle()

      if (queryError) {
        console.error('Error checking existing project:', queryError)
        return { success: false, error: queryError.message }
      }

      if (existing) {
        // Update existing project to featured
        return this.updateFeaturedProject(existing.id, {
          ...projectData,
          github_id: String(projectData.github_id),
          is_featured: true,
          updated_at: new Date().toISOString()
        })
      }

      // Create new featured project
      return this.create(TABLES.FEATURED_PROJECTS, {
        ...projectData,
        github_id: String(projectData.github_id),
        is_featured: true,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error creating featured project:', error)
      return { success: false, error: error.message }
    }
  }

  async updateFeaturedProject(id, projectData) {
    return this.update(TABLES.FEATURED_PROJECTS, id, projectData)
  }

  async deleteFeaturedProject(id) {
    return this.delete(TABLES.FEATURED_PROJECTS, id)
  }

  async toggleFeaturedProject(githubId, projectData) {
    try {
      // Check if project exists
      const { data: existing, error: queryError } = await supabase
        .from(TABLES.FEATURED_PROJECTS)
        .select('*')
        .eq('github_id', String(githubId))
        .maybeSingle()

      if (queryError) {
        console.error('Error checking existing project:', queryError)
        return { success: false, error: queryError.message }
      }

      if (existing) {
        // Toggle featured status
        const newStatus = !existing.is_featured
        const result = await this.updateFeaturedProject(existing.id, {
          is_featured: newStatus,
          github_id: String(githubId),
          ...projectData // Update with latest GitHub data
        })
        return { ...result, action: newStatus ? 'featured' : 'unfeatured' }
      } else {
        // Create new featured project
        const result = await this.createFeaturedProject({
          github_id: String(githubId),
          ...projectData
        })
        return { ...result, action: 'featured' }
      }
    } catch (error) {
      console.error('Error toggling featured project:', error)
      return { success: false, error: error.message }
    }
  }

  async updateProjectOrder(projectUpdates) {
    try {
      const updates = projectUpdates.map(({ id, display_order }) =>
        this.updateFeaturedProject(id, { display_order })
      )

      await Promise.all(updates)
      return { success: true }
    } catch (error) {
      console.error('Error updating project order:', error)
      return { success: false, error: error.message }
    }
  }

  // Real-time subscription for featured projects
  subscribeFeaturedProjects(callback) {
    return supabase
      .channel('featured_projects_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.FEATURED_PROJECTS
        },
        callback
      )
      .subscribe()
  }

  // Batch operations
  async getAllData() {
    try {
      const [certificates, education, experience, featuredProjects] = await Promise.all([
        this.getCertificates(),
        this.getEducation(),
        this.getExperience(),
        this.getFeaturedProjects()
      ])

      return {
        success: true,
        data: {
          certificates: certificates.data,
          education: education.data,
          experience: experience.data,
          featuredProjects: featuredProjects.data
        }
      }
    } catch (error) {
      console.error('Error fetching all data:', error)
      return { success: false, error: error.message }
    }
  }
}

export const supabaseService = new SupabaseService()
export default supabaseService
