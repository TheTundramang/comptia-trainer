// saveManager.js — Phase 1 cloud progress sync
// Owned by Riley (architecture) + Evan (security review required before ship)
//
// Strategy:
//   - Authenticated user → read/write Supabase, mirror to localStorage as cache
//   - Anonymous user   → read/write localStorage only (free tier, offline)
//
// Drop-in replacement for the inline loadSave/writeSave in each App.jsx.
// Import: import { loadSave, writeSave } from '../saveManager.js'  (cert subdirs)
//         import { loadSave, writeSave } from './saveManager.js'   (root App.jsx)

import { supabase, getUser } from './supabase.js';

// Load progress for a given cert key (e.g. 'aplus-v1')
export async function loadSave(certKey) {
  try {
    const user = await getUser();

    if (user) {
      // Cloud path: fetch from Supabase
      const { data, error } = await supabase
        .from('cert_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('cert_key', certKey)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found — that's fine for a new user
        console.warn('[saveManager] Supabase read error, falling back to localStorage', error);
      }

      if (data) {
        // Flatten Supabase row back into the shape the app expects
        const parsed = {
          streak: data.streak ?? 0,
          lastActive: data.last_active,
          domainProgress: data.domain_progress ?? {},
          weakQuestions: data.weak_questions ?? {},
          starredCards: data.starred_cards ?? [],
          practiceHistory: data.practice_history ?? [],
        };
        // Mirror to localStorage as offline cache
        localStorage.setItem(certKey, JSON.stringify(parsed));
        return parsed;
      }
      // No cloud row yet — fall through to localStorage
    }

    // Local path: read from localStorage
    const raw = localStorage.getItem(certKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
  } catch (e) {
    console.warn('[saveManager] loadSave error, returning empty state', e);
    return {};
  }
}

// Write progress for a given cert key
export async function writeSave(certKey, data) {
  try {
    // Always write to localStorage first (instant, offline-safe)
    localStorage.setItem(certKey, JSON.stringify(data));

    const user = await getUser();
    if (!user) return; // anonymous — localStorage only

    // Cloud path: upsert to Supabase
    const { error } = await supabase
      .from('cert_progress')
      .upsert({
        user_id: user.id,
        cert_key: certKey,
        streak: data.streak ?? 0,
        last_active: data.lastActive ?? null,
        domain_progress: data.domainProgress ?? {},
        weak_questions: data.weakQuestions ?? {},
        starred_cards: data.starredCards ?? [],
        practice_history: data.practiceHistory ?? [],
      }, {
        onConflict: 'user_id,cert_key',
      });

    if (error) {
      console.warn('[saveManager] Supabase write error (localStorage saved)', error);
    }
  } catch (e) {
    console.warn('[saveManager] writeSave error', e);
  }
}
