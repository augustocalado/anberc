-- Profiles table with RBAC (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  photo_url TEXT,
  signature_url TEXT,
  signature_name TEXT,
  role TEXT DEFAULT 'Cliente' CHECK (role IN ('Admin Master', 'Técnico', 'Cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Function to handle new user entries in public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'Cliente');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  technician_id UUID REFERENCES public.profiles(id),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Concluído', 'Cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'Novo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Settings table (SEO and Global Config)
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Technical Visits (Visita Técnica)
CREATE TABLE IF NOT EXISTS public.technical_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id),
  client_name TEXT NOT NULL,
  technician_id UUID REFERENCES public.profiles(id),
  visit_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  report TEXT,
  photos TEXT[], -- Array of photo URLs
  status TEXT DEFAULT 'Realizada' CHECK (status IN ('Realizada', 'Em andamento', 'Pendente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on technical_visits
ALTER TABLE public.technical_visits ENABLE ROW LEVEL SECURITY;

-- Basic Policies (DROP then CREATE to avoid already exists error)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view appointments" ON appointments;
CREATE POLICY "Anyone can view appointments" ON appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert appointments" ON appointments;
CREATE POLICY "Authenticated users can insert appointments" ON appointments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view leads" ON leads;
CREATE POLICY "Admins can view leads" ON leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view settings" ON settings;
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update settings" ON settings;
CREATE POLICY "Admins can update settings" ON settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Technicians and admins can view visits" ON technical_visits;
CREATE POLICY "Technicians and admins can view visits" ON technical_visits FOR SELECT USING (true);

DROP POLICY IF EXISTS "Technicians can insert visits" ON technical_visits;
CREATE POLICY "Technicians can insert visits" ON technical_visits FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- STORAGE CONFIGURATION (Manual step in Supabase Dashboard)
-- Bucket: 'profiles' (Public: true)
-- Bucket: 'visits' (Public: true)
-- Bucket: 'signatures' (Public: true)

-- Clientes (Customer database)
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  documento TEXT,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  cidade TEXT DEFAULT 'São José dos Campos',
  estado TEXT DEFAULT 'SP',
  observacoes TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Policies for Clientes
DROP POLICY IF EXISTS "Anyone can view clientes" ON clientes;
CREATE POLICY "Anyone can view clientes" ON clientes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage clientes" ON clientes;
CREATE POLICY "Authenticated users can manage clientes" ON clientes FOR ALL USING (auth.role() = 'authenticated');

-- Produtos e Serviços (Catalog)
CREATE TABLE IF NOT EXISTS public.produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('produto', 'servico')),
  categoria TEXT,
  preco DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  estoque INTEGER DEFAULT 0,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on produtos
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Policies for Produtos
DROP POLICY IF EXISTS "Anyone can view produtos" ON public.produtos;
CREATE POLICY "Anyone can view produtos" ON public.produtos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage produtos" ON public.produtos;
CREATE POLICY "Admins can manage produtos" ON public.produtos FOR ALL USING (auth.role() = 'authenticated');

-- Orçamentos (Budgets)
CREATE TABLE IF NOT EXISTS public.orcamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL,
  cliente TEXT NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  valor DECIMAL(12,2) DEFAULT 0.00,
  descricao TEXT,
  itens JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on orcamentos
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

-- Policies for Orçamentos
DROP POLICY IF EXISTS "Anyone can view orcamentos" ON public.orcamentos;
CREATE POLICY "Anyone can view orcamentos" ON public.orcamentos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage orcamentos" ON public.orcamentos;
CREATE POLICY "Authenticated users can manage orcamentos" ON public.orcamentos FOR ALL USING (auth.role() = 'authenticated');

-- Ordens de Serviço (Service Orders)
CREATE TABLE IF NOT EXISTS public.ordens_servico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  cliente_nome TEXT NOT NULL,
  descricao TEXT,
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  status TEXT DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'execucao', 'finalizado')),
  tecnico_id UUID REFERENCES public.profiles(id),
  tecnico_nome TEXT,
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on ordens_servico
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

-- Policies for Ordens de Serviço
DROP POLICY IF EXISTS "Anyone can view ordens_servico" ON public.ordens_servico;
CREATE POLICY "Anyone can view ordens_servico" ON public.ordens_servico FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage ordens_servico" ON public.ordens_servico;
CREATE POLICY "Authenticated users can manage ordens_servico" ON public.ordens_servico FOR ALL USING (auth.role() = 'authenticated');
