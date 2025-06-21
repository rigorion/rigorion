
import { createClient } from '@supabase/supabase-js'

// Use consistent URL from environment or fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://evfxcdzwmmiguzxdxktl.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZnhjZHp3bW1pZ3V6eGR4a3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODkxNjksImV4cCI6MjA1ODI2NTE2OX0.AN7JVRiz4aFANJPliLpyIfWYC3JxYBeVTYkyZm1sBPo'

console.log('🔧 Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('Key (first 20 chars):', supabaseKey.substring(0, 20) + '...')

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false, // Disable session persistence to avoid fetch conflicts
    detectSessionInUrl: false,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'x-application-name': 'practice-app',
    },
    fetch: (url, options = {}) => {
      // Add timeout to all fetch requests
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 8000)
      );
      
      const fetchPromise = fetch(url, {
        ...options,
        signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
      });
      
      return Promise.race([fetchPromise, timeoutPromise]);
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 1,
    },
  },
})

// Simple connection test
const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test with a simple health check that doesn't require auth
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
    });
    
    if (response.ok) {
      console.log('✅ Supabase connection successful');
    } else {
      console.error('❌ Supabase connection failed:', response.status, response.statusText);
    }
  } catch (err: any) {
    console.error('❌ Supabase connection error:', err.message);
    if (err.message.includes('timeout') || err.message.includes('fetch')) {
      console.error('⏰ This suggests your Supabase project may be paused or unreachable');
      console.error('💡 Check your Supabase dashboard at https://supabase.com/dashboard');
    }
  }
};

// Run connection test
setTimeout(testConnection, 1000);
