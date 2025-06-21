
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://evfxcdzwmmiguzxdxktl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZnhjZHp3bW1pZ3V6eGR4a3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODkxNjksImV4cCI6MjA1ODI2NTE2OX0.AN7JVRiz4aFANJPliLpyIfWYC3JxYBeVTYkyZm1sBPo'

// Add some debugging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...')

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error)
  } else {
    console.log('Supabase connection test successful')
  }
}).catch(err => {
  console.error('Supabase connection test error:', err)
})
