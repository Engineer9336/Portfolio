// Paste your Supabase project URL and anon/public key here.
// NEVER put a service_role key in frontend code.
export const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
export const ADMIN_EMAIL = 'YOUR_VERIFIED_ADMIN_EMAIL@example.com';
export const isSupabaseConfigured = () => SUPABASE_URL.includes('.supabase.co') && !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR_');
