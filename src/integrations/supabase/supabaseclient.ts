// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mpormoygsvacbxzrylzl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb3Jtb3lnc3ZhY2J4enJ5bHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzcyOTEsImV4cCI6MjA1NjYxMzI5MX0.q1oSa_5OJ1MFlNrMYhT6sQF-y68eNnBS_yROGQ6nsuY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);