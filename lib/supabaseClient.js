import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 👉 WICHTIG: sauber prüfen ob wirklich konfiguriert
export const supabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("YOUR_PROJECT") &&
  !supabaseAnonKey.includes("YOUR_PUBLIC");

// 👉 Singleton verhindern (wichtig gegen GoTrueClient Warning)
let supabaseInstance = null;

if (supabaseConfigured && !supabaseInstance) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "heritage-drivers-auth",
    },
  });
}

export const supabase = supabaseInstance;