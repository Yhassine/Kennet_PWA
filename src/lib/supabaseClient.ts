import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://ljxzmsycchuadvonhxjs.supabase.co";

const supabaseAnonKey: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqeHptc3ljY2h1YWR2b25oeGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzIwNTcsImV4cCI6MjEwNzIwODA1N30.Jl3JWSQYZDPcMnHv1t31OP4FhzJ6bhXDq2n5ZJaXbPQ";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
