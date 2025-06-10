import { createClient } from "@supabase/supabase-js";

const { supabase_url, supbase_key } = process.env;
console.log("Supabase URL: " + supabase_url);
if (!supabase_url || !supbase_key){
    throw new Error("Supabase URL or Key is not set in environment variables.");
}
export const supabase = createClient(supabase_url, supbase_key);
