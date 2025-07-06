// Quick test to verify Supabase connection
import { supabase } from './src/lib/supabase.js'

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('certificates')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Database accessible')
    return true
    
  } catch (err) {
    console.error('❌ Connection error:', err.message)
    return false
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection()
}
