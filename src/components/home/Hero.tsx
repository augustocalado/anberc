"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-b from-white to-[#F5F5F5]">
      {/* Circuit Pattern Background Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%23001F3F' stroke-width='1'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%23001F3F'/%3E%3Ccircle cx='90' cy='10' r='2' fill='%23001F3F'/%3E%3Ccircle cx='90' cy='90' r='2' fill='%23001F3F'/%3E%3Ccircle cx='10' cy='90' r='2' fill='%23001F3F'/%3E%3Cpath d='M50 10v80M10 50h80' stroke='%23001F3F' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '150px' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-4 py-2 rounded-full mb-8">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-[#001F3F] text-xs font-bold uppercase tracking-widest">Fortificação Digital e Estrutural</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#001F3F] leading-tight mb-8">
            Sistemas Integrados de <br />
            <span className="text-[#38BDF8]">Segurança e Climatização</span>
          </h1>

          <p className="text-xl text-[#778899] mb-12 max-w-2xl mx-auto leading-relaxed">
            Proteção Eletrônica, Soluções Elétricas e Instalação de Ar Condicionado com Tecnologia e Confiança para o seu patrimônio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/servicos">
              <Button size="lg" className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold px-10 py-7 text-lg rounded-xl shadow-lg shadow-[#38BDF8]/20 border-none w-full sm:w-auto">
                Nossos Serviços
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link to="/contato">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#001F3F] text-[#001F3F] hover:bg-[#001F3F] hover:text-white px-10 py-7 text-lg rounded-xl transition-all duration-300 w-full sm:w-auto"
              >
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;