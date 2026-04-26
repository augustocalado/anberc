-- fresh_start_cleanup.sql
-- Execute este script no SQL Editor do Supabase para limpar dados de teste/fake.
-- Este script PRESERVA seus perfis (Admin Master), configurações (SEO) e modelos de contrato.

-- 1. Limpar Relatórios de Visita Técnica
TRUNCATE TABLE public.technical_visits CASCADE;

-- 2. Limpar Agendamentos e Ordens de Serviço (OS)
TRUNCATE TABLE public.appointments CASCADE;

-- 3. Limpar Leads (Solicitações de Contato)
TRUNCATE TABLE public.leads CASCADE;

-- 4. Limpar Perfis que não são Admin (Opcional - descomente se quiser limpar outros usuários)
-- DELETE FROM public.profiles WHERE role NOT IN ('Admin Master');

-- NOTA: Perfis com cargo 'Admin Master' NÃO são apagados para manter seu acesso.
-- A tabela 'settings' também é mantida para não perder a identidade do site e SEO.
