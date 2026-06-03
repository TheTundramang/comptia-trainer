import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'comptia-auth',
  },
});

// Get the currently authenticated user (null if logged out)
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Get the user's profile including is_paid status
export async function getProfile() {
  const user = await getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return data;
}

// Sign up with email + password
export async function signUp(email, password) {
  return supabase.auth.signUp({ email, password });
}

// Sign in with email + password
export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign out
export async function signOut() {
  return supabase.auth.signOut();
}

// Listen for auth state changes
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
