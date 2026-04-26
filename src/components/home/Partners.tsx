"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, BellRing, Zap, Smartphone } from 'lucide-react';

const techPillars = [
  {
    name: 'CFTV Inteligente',
    icon: Camera,
  },
  {
    name: 'Sistemas de Alarme',
    icon: BellRing,
  },
  {
    name: 'Engenharia Elétrica',
    icon: Zap,
  },
  {
    name: 'Automação',
    icon: Smartphone,
  },
];

const Partners = () => {
  return (
    <section className="py-16 bg-white border-y border-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px w-12 bg-[#38BDF8]/30" />
          <p className="text-[#778899] text-xs font-bold uppercase tracking-[0.3em]">
            Tecnologias de Ponta
          </p>
          <div className="h-px w-12 bg-[#38BDF8]/30" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {techPillars.map((item) => (
            <div key={item.name} className="group flex flex-col items-center text-center">
              <Link to="/servicos" className="mb-4 p-5 rounded-2xl bg-[#F5F5F5] border border-transparent group-hover:border-[#38BDF8]/40 group-hover:bg-white transition-all duration-500 relative overflow-hidden shadow-sm group-hover:shadow-md">
                <item.icon className="w-10 h-10 text-[#001F3F] group-hover:text-[#38BDF8] transition-all duration-500 group-hover:scale-110" />
              </Link>

              <Link to="/servicos">
                <h3 className="text-[#001F3F] font-bold text-lg tracking-tight group-hover:text-[#38BDF8] transition-colors">
                  {item.name}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;