import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  watchlist: number[];
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function upsertUserProfile(profile: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }

  return data;
}


export async function updateUserProfileFields(
  userId: string,
  fields: Partial<Omit<UserProfile, 'id'>>,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}


export async function getOrCreateUserProfile(
  userId: string,
  email: string,
  name: string,
): Promise<UserProfile | null> {
  const existing = await getUserProfile(userId);
  if (existing) return existing;

  return upsertUserProfile({
    id: userId,
    email,
    name: name || email.split('@')[0],
    created_at: new Date().toISOString(),
    watchlist: [],
  });
}