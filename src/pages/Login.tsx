"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      toast.success("Login realizado com sucesso!");
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Erro de login:", err);
      toast.error(err.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center gap-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div className="flex flex-col text-left leading-none">
                <span className="text-2xl font-black tracking-tighter text-[#001F3F]">ANBERC</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#778899]">Soluções Integradas</span>
              </div>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-[#001F3F]">Bem-vindo de volta</h2>
          <p className="text-sm text-gray-500 mt-2">Acesse sua conta administrativa</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-[#38BDF8] focus:ring-[#38BDF8]" />
              <span className="text-gray-600">Lembrar-me</span>
            </label>
            <Link to="#" className="text-[#38BDF8] font-semibold hover:underline">Esqueceu a senha?</Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#001F3F] hover:bg-[#002d5c] text-white font-bold text-lg rounded-xl transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Entrando...
              </div>
            ) : 'Entrar'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Não tem acesso? <Link to="/contato" className="text-[#38BDF8] font-bold hover:underline">Fale com o suporte</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;