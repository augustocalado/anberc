"use client";

import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Ricardo Almeida",
    role: "Síndico - Ed. Horizonte",
    content: "A Anberc transformou a segurança do nosso condomínio. A integração dos sistemas funciona perfeitamente e a equipe técnica é extremamente profissional.",
    rating: 5
  },
  {
    name: "Mariana Costa",
    role: "Proprietária - Loja Fashion",
    content: "O sistema de climatização e CFTV me dá total tranquilidade. Consigo monitorar tudo pelo celular com uma nitidez impressionante.",
    rating: 5
  },
  {
    name: "Dr. Carlos Eduardo",
    role: "Residência Particular",
    content: "Excelente atendimento desde o orçamento até a instalação. A engenharia elétrica e o sistema de alarme são de altíssima qualidade.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#38BDF8] font-bold uppercase tracking-widest text-sm mb-4">Depoimentos</h2>
          <p className="text-4xl font-bold text-[#001F3F] mb-6">O que nossos clientes dizem</p>
          <p className="text-[#778899] text-lg">A confiança de quem já protege seu patrimônio com a inteligência da Anberc.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <Card key={index} className="bg-[#F5F5F5] border-none relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-[#001F3F]" />
              </div>
              <CardContent className="p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#38BDF8] text-[#38BDF8]" />
                  ))}
                </div>
                <p className="text-[#333333] italic mb-8 leading-relaxed">
                  "{t.content}"
                </p>
                <div>
                  <p className="text-[#001F3F] font-bold">{t.name}</p>
                  <p className="text-[#38BDF8] text-sm font-semibold">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;