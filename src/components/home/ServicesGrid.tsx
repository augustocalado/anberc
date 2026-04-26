"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Wind, Settings, Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    title: 'Segurança Eletrônica',
    description: 'Monitoramento inteligente, CFTV de alta definição e controle de acesso biométrico.',
    icon: Shield,
  },
  {
    title: 'Engenharia Elétrica',
    description: 'Projetos elétricos, manutenção de painéis e soluções em energia de alta performance.',
    icon: Zap,
  },
  {
    title: 'Climatização & AC',
    description: 'Instalação e manutenção de sistemas de ar condicionado residenciais e corporativos.',
    icon: Wind,
  },
  {
    title: 'Manutenção Preventiva',
    description: 'Planos de revisão periódica para garantir o funcionamento ininterrupto dos seus sistemas.',
    icon: Settings,
  },
];

const ServicesGrid = () => {
  return (
    <section className="py-24 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#38BDF8] font-bold uppercase tracking-widest text-sm mb-4">Excelência Técnica</h2>
          <p className="text-4xl font-bold text-[#001F3F] mb-6">Soluções Integradas</p>
          <p className="text-[#778899] text-lg">Tecnologia de ponta aplicada à segurança e ao conforto do seu ambiente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link key={index} to="/servicos" className="contents">
              <Card className="bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="mb-6 p-4 rounded-2xl bg-[#F5F5F5] w-fit group-hover:bg-[#001F3F] transition-all duration-300">
                    <service.icon className="w-8 h-8 text-[#38BDF8] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#001F3F] mb-3 group-hover:text-[#38BDF8] transition-colors">{service.title}</h3>
                  <p className="text-[#778899] leading-relaxed text-sm">{service.description}</p>

                  <div className="mt-6 flex items-center text-[#001F3F] font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Saiba Mais <Cpu className="ml-2 w-3 h-3 text-[#38BDF8]" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;