-- SEO Pages table for Local SEO strategy
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  h1 TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  services JSONB DEFAULT '[]'::jsonb,
  nearby_locations TEXT,
  map_query TEXT, -- Query for Google Maps embed
  map_embed_url TEXT, -- URL src for Google Maps embed iframe
  schema_markup JSONB,
  is_city_page BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can view seo_pages" ON public.seo_pages;
CREATE POLICY "Anyone can view seo_pages" ON public.seo_pages FOR SELECT USING (true);

-- Insert initial data
INSERT INTO public.seo_pages (slug, city, neighborhood, title, meta_description, h1, intro_text, services, nearby_locations, map_query, is_city_page)
VALUES 
-- Pillar Page
('vale-do-paraiba', 'Vale do Paraíba', NULL, 'Segurança Eletrônica e Elétrica no Vale do Paraíba | Anberc', 'A Anberc atende todo o Vale do Paraíba com serviços de eletricista e instalação de câmeras. Atendimento em SJC, Taubaté, Caçapava e região.', 'Especialista em Segurança e Elétrica no Vale do Paraíba', 'A Anberc é sua parceira estratégica no Vale do Paraíba para soluções de segurança eletrônica e instalações elétricas de alta complexidade.', '["Instalação de Câmeras", "Manutenção Elétrica", "CFTV", "Cerca Elétrica"]', 'Atendemos todo o eixo da Dutra entre SJC e Taubaté.', 'Vale do Paraíba, SP', true),

-- SJC - City Page
('sao-jose-dos-campos', 'São José dos Campos', NULL, 'Eletricista e Câmeras em São José dos Campos | Anberc', 'Procurando eletricista em SJC? A Anberc oferece instalação de câmeras e manutenção elétrica em todos os bairros de São José dos Campos.', 'Segurança e Elétrica em São José dos Campos', 'Atendemos toda a cidade de São José dos Campos com serviços profissionais de engenharia elétrica e segurança eletrônica.', '["CFTV", "Alarmes", "Câmeras IP", "Manutenção Industrial"]', 'Atendemos todas as zonas de SJC.', 'São José dos Campos, SP', true),

-- SJC - Neighborhoods
('sao-jose-dos-campos/jardim-aquarius', 'São José dos Campos', 'Jardim Aquarius', 'Eletricista e Instalação de Câmeras no Jardim Aquarius | SJC', 'Precisa de eletricista no Jardim Aquarius? Instalação de câmeras e manutenção elétrica residencial e comercial no Aquarius, SJC.', 'Eletricista e Instalação de Câmeras no Jardim Aquarius - SJC', 'Precisa de um eletricista de confiança ou instalação de câmeras no Jardim Aquarius? Nossa empresa atende toda a região de São José dos Campos com serviços profissionais de manutenção elétrica, instalação de quadros, CFTV e segurança eletrônica.', '["Instalação de câmeras Wi-Fi e Cabeadas no Jardim Aquarius", "Reparos elétricos de urgência", "Manutenção preventiva em condomínios"]', 'Atendemos residências e comércios próximos à Praça Ulisses Guimarães.', 'Jardim Aquarius, São José dos Campos, SP', false),

('sao-jose-dos-campos/urbanova', 'São José dos Campos', 'Urbanova', 'Eletricista e Instalação de Câmeras no Urbanova | SJC', 'Serviços de elétrica e segurança eletrônica no Urbanova, SJC. Instalação de câmeras, cercas elétricas e manutenção geral.', 'Eletricista e Instalação de Câmeras no Urbanova - SJC', 'Precisa de um eletricista de confiança ou instalação de câmeras no Urbanova? Atendemos condomínios e residências com foco em alta tecnologia e segurança.', '["CFTV para Condomínios", "Instalação de Refletores", "Manutenção Elétrica Residencial"]', 'Atendemos residências próximas à Univap e arredores.', 'Urbanova, São José dos Campos, SP', false),

-- Taubaté - City Page
('taubate', 'Taubaté', NULL, 'Eletricista e Instalação de Câmeras em Taubaté | Anberc', 'A melhor solução em elétrica e segurança eletrônica de Taubaté. Atendemos residências e empresas com serviços técnicos especializados.', 'Segurança e Elétrica em Taubaté', 'Referência em serviços de elétrica e instalação de câmeras em Taubaté, a Anberc oferece soluções sob medida para sua segurança.', '["Instalação de Câmeras", "Manutenção Elétrica", "Projetos de Segurança"]', 'Atendemos toda a região central e bairros de Taubaté.', 'Taubaté, SP', true),

-- Taubaté - Neighborhoods
('taubate/independencia', 'Taubaté', 'Independência', 'Eletricista e Instalação de Câmeras no Bairro Independência | Taubaté', 'Eletricista profissional no bairro Independência em Taubaté. Instalação de CFTV, alarmes e manutenção elétrica em geral.', 'Eletricista e Instalação de Câmeras no Independência - Taubaté', 'Atendemos o bairro Independência em Taubaté com excelência técnica em serviços elétricos e de segurança eletrônica.', '["Instalação de câmeras IP", "Troca de fiação e disjuntores", "Segurança Perimetral"]', 'Próximo ao Taubaté Shopping e região.', 'Independência, Taubaté, SP', false)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  intro_text = EXCLUDED.intro_text,
  services = EXCLUDED.services,
  nearby_locations = EXCLUDED.nearby_locations,
  map_query = EXCLUDED.map_query;
