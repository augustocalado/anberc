"use client";

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#38BDF8]/10 rounded-full blur-3xl" />
            <div className="rounded-3xl overflow-hidden border-8 border-[#F5F5F5] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
                alt="Técnico Anberc em Instalação" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-[#001F3F] p-8 rounded-3xl shadow-2xl hidden md:block">
              <ShieldCheck className="text-[#38BDF8] w-12 h-12 mb-4" />
              <p className="text-white font-black text-3xl">100%</p>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Segurança Garantida</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-[#38BDF8] font-bold uppercase tracking-widest text-sm mb-4">Sobre a Anberc</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-[#001F3F] mb-6 leading-tight">Compromisso com a Fortificação Digital e Estrutural</h3>
              <p className="text-[#778899] text-lg leading-relaxed">
                A Anberc System Security é referência em integração tecnológica. Nossa missão é prover soluções que unem segurança eletrônica avançada, engenharia elétrica de precisão e climatização eficiente.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Projetos Personalizados",
                "Equipe Técnica Certificada",
                "Tecnologia de Ponta",
                "Suporte Especializado",
                "Manutenção Ágil",
                "Conformidade Técnica"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#38BDF8] w-5 h-5 shrink-0" />
                  <span className="text-[#333333] font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-[#778899] italic border-l-4 border-[#38BDF8] pl-6 py-2">
                "Nossa engenharia não apenas protege, ela otimiza o seu ambiente para o futuro."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;