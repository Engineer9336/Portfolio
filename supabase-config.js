// Paste your Supabase project URL and anon/public key here.
// NEVER put a service_role key in frontend code.
export const SUPABASE_URL = 'https://ohlexhxuvzqtuambvoue.supabase.co/rest/v1/';
export const SUPABASE_ANON_KEY = 'sb_publishable_Nyb4CMLmPA2_2qrEL9FwPQ_uO-ElWl3';
export const ADMIN_EMAIL = 'engineerworld853@gmail.com';
export const isSupabaseConfigured = () => SUPABASE_URL.includes('.supabase.co') && !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR_');
