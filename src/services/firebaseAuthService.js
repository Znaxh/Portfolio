import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../config/firebase'

class FirebaseAuthService {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Check if user is authorized admin (you can customize this logic)
      const authorizedEmails = [
        import.meta.env.VITE_ADMIN_EMAIL, // Your email from environment variables
        // Add more authorized emails here if needed
      ]
      
      if (!authorizedEmails.includes(user.email)) {
        await this.signOut()
        throw new Error('Unauthorized: You are not authorized to access the admin panel')
      }
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Admin'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  }

  // Check if user is authenticated and authorized
  isAuthenticated() {
    const user = this.getCurrentUser()
    if (!user) return false
    
    const authorizedEmails = [
      import.meta.env.VITE_ADMIN_EMAIL,
      // Add more authorized emails here if needed
    ]
    
    return authorizedEmails.includes(user.email)
  }

  // Create admin user (only use this once to set up your admin account)
  async createAdminUser(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return {
        success: true,
        user: userCredential.user
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService()
