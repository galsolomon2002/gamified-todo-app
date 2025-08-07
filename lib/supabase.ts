// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqlmcecwilagtgncglrb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbG1jZWN3aWxhZ3RnbmNnbHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1OTkyNjcsImV4cCI6MjA3MDE3NTI2N30.vyKkD0WJBXDkKALHsVAw03WavSswONWJlsE7sW1gwF0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
