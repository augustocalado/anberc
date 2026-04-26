-- Create the produtos table
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

-- Enable RLS
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can view produtos" ON public.produtos;
CREATE POLICY "Anyone can view produtos" ON public.produtos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage produtos" ON public.produtos;
CREATE POLICY "Admins can manage produtos" ON public.produtos FOR ALL USING (auth.role() = 'authenticated');
