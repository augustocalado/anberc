import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gvocklqkaijtksynzwvt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2b2NrbHFrYWlqdGtzeW56d3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzYyMDgsImV4cCI6MjA4OTExMjIwOH0.nU5p3JWGt3Jl1v9gK7Wcg-PNH4uyIRcqiKLa4W-MD10";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function listUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, name, role');

  if (error) {
    console.error('Erro ao buscar perfis:', error);
    return;
  }

  console.log('Usuários encontrados no sistema:');
  console.table(data);
}

listUsers();
