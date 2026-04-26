-- Migration to fix schema mismatch
-- Run this in your Supabase SQL Editor

-- 1. Add missing columns to 'clientes' table if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='numero') THEN
        ALTER TABLE public.clientes ADD COLUMN numero TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='complemento') THEN
        ALTER TABLE public.clientes ADD COLUMN complemento TEXT;
    END IF;

    -- Add phone column to profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
END $$;

-- 2. Ensure 'produtos' table exists for the new budget features
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

-- 3. Enable RLS and Policies for 'produtos'
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view produtos" ON public.produtos;
CREATE POLICY "Anyone can view produtos" ON public.produtos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage produtos" ON public.produtos;
CREATE POLICY "Admins can manage produtos" ON public.produtos FOR ALL USING (auth.role() = 'authenticated');

-- 4. Create 'orcamentos' table
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

ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view orcamentos" ON public.orcamentos;
CREATE POLICY "Anyone can view orcamentos" ON public.orcamentos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage orcamentos" ON public.orcamentos;
CREATE POLICY "Authenticated users can manage orcamentos" ON public.orcamentos FOR ALL USING (auth.role() = 'authenticated');

-- 5. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
