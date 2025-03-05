
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mpormoygsvacbxzrylzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb3Jtb3lnc3ZhY2J4enJ5bHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzcyOTEsImV4cCI6MjA1NjYxMzI5MX0.q1oSa_5OJ1MFlNrMYhT6sQF-y68eNnBS_yROGQ6nsuY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
