
import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url: string | undefined) => url && (url.startsWith('https://') || url.startsWith('http://'))

// Fallback to placeholder if env var is missing or invalid (e.g. "YOUR_SUPABASE_URL")
const supabaseUrl = isValidUrl(envUrl) ? envUrl : 'https://placeholder.supabase.co'
const supabaseAnonKey = envKey || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
