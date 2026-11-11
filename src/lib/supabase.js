import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://cthvxtjwstyezwzuohdx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aHZ4dGp3c3R5ZXp3enVvaGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxNTc4NDgsImV4cCI6MjEwOTczMzg0OH0.LEJhPmoX0Me1OALib4gEljREIaTJkM8y4wRkd_7kVik';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL)
  || (typeof window !== 'undefined' && window.SUPABASE_URL)
  || DEFAULT_SUPABASE_URL;

const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY)
  || (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY)
  || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
