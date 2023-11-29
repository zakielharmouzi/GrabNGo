import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jwbgvkgvkjspfnyurjfd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3Ymd2a2d2a2pzcGZueXVyamZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExMTQ1MjQsImV4cCI6MjAxNjY5MDUyNH0.QCBH0uwgwO7Uk_PQ7WZYR6YLYhRzNFkzzfOa5A1jcxU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})