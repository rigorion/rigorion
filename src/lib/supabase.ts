
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://evfxcdzwmmiguzxdxktl.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZnhjZHp3bW1pZ3V6eGR4a3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODkxNjksImV4cCI6MjA1ODI2NTE2OX0.AN7JVRiz4aFANJPliLpyIfWYC3JxYBeVTYkyZm1sBPo'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...')

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false, // Disable auto refresh to prevent fetch errors
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'x-application-name': 'practice-app',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})

// Simple connection test with timeout
const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Create a promise that will timeout after 3 seconds
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 3000)
    );
    
    // Try a simple health check by attempting to get the current session
    const sessionPromise = supabase.auth.getSession();
    
    const { data, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      if (error.message.includes('fetch') || error.message.includes('timeout')) {
        console.error('🚨 This looks like a network connectivity issue. Possible causes:');
        console.error('1. Supabase project is paused (check your Supabase dashboard)');
        console.error('2. Invalid Supabase URL or API keys');
        console.error('3. Network restrictions or firewall blocking the connection');
      }
    } else {
      console.log('✅ Supabase connection test successful');
    }
  } catch (err: any) {
    console.error('❌ Supabase connection test error:', err.message);
    if (err.message.includes('timeout')) {
      console.error('⏰ Connection timed out - your Supabase project may be paused or unreachable');
    } else {
      console.error('🌐 This indicates a network or configuration issue.');
    }
  }
};

// Run the test after a short delay to ensure everything is loaded
setTimeout(testConnection, 1000);
