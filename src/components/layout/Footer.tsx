"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-[#001F3F] pt-20 pb-10 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <Logo variant="light" />
            </Link>
            <p className="text-white/60 leading-relaxed text-sm">
              Líder em sistemas integrados de segurança, elétrica e climatização. Tecnologia e confiança para sua proteção.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-white hover:text-[#38BDF8] transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-white hover:text-[#38BDF8] transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-white hover:text-[#38BDF8] transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Links Rápidos</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="text-white/60 hover:text-[#38BDF8] transition-colors">Home</Link></li>
              <li><Link to="/servicos" className="text-white/60 hover:text-[#38BDF8] transition-colors">Nossos Serviços</Link></li>
              <li><Link to="/sobre" className="text-white/60 hover:text-[#38BDF8] transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-white/60 hover:text-[#38BDF8] transition-colors">Contato</Link></li>
              <li><Link to="/login" className="text-cyan-400/80 hover:text-cyan-400 transition-colors font-bold flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                Portal Adm <ArrowRight size={14} />
              </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Serviços</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/servicos" className="text-white/60 hover:text-[#38BDF8] transition-colors">Segurança Eletrônica</Link></li>
              <li><Link to="/servicos" className="text-white/60 hover:text-[#38BDF8] transition-colors">Engenharia Elétrica</Link></li>
              <li><Link to="/servicos" className="text-white/60 hover:text-[#38BDF8] transition-colors">Climatização & AC</Link></li>
              <li><Link to="/servicos" className="text-white/60 hover:text-[#38BDF8] transition-colors">Manutenção</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Localidades</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/servicos/sao-jose-dos-campos" className="text-white/60 hover:text-[#38BDF8] transition-colors">São José dos Campos</Link></li>
              <li><Link to="/servicos/taubate" className="text-white/60 hover:text-[#38BDF8] transition-colors">Taubaté</Link></li>
              <li><Link to="/servicos/cacapava" className="text-white/60 hover:text-[#38BDF8] transition-colors">Caçapava</Link></li>
              <li><Link to="/servicos/vale-do-paraiba" className="text-white/60 hover:text-[#38BDF8] transition-colors">Vale do Paraíba</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contato</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="text-[#38BDF8] shrink-0" size={18} />
                <span>Sede Corporativa - São José dos Campos, SP</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="text-[#38BDF8] shrink-0" size={18} />
                <span>(12) 98162-8675</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Mail className="text-[#38BDF8] shrink-0" size={18} />
                <span>contato@anberc.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © 2024 Anberc System Security. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;