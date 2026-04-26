"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import TopBar from './TopBar';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
    { name: 'Painel', path: '/dashboard' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <TopBar />
      <nav className={cn(
        "transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-zinc-200 py-1 shadow-sm"
          : "bg-white border-transparent py-1 md:py-2"
      )}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center py-1 md:py-2 md:pl-24">
              <Logo className="scale-75 md:scale-110 origin-left" />
            </Link>
          </div>

          {/* Mobile Center Button */}
          <div className="flex md:hidden flex-1 justify-center">
            <Link
              to="/os"
              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 px-3 py-1 rounded-full border border-cyan-500/30 transition-all font-bold uppercase tracking-tighter text-[10px] flex items-center gap-1"
            >
              <span>Abrir Chamado</span>
            </Link>
          </div>

          {/* Desktop Menu - Centered Links */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name}
                to={link.path}
                className="text-sm font-bold text-[#333333] hover:text-[#38BDF8] transition-colors uppercase tracking-wider whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions - Right Side Desktop */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-6">
            <Link to="/contato#orcamento">
              <Button className="bg-[#001F3F] hover:bg-[#002d5c] text-white font-bold rounded-lg px-6 h-11 whitespace-nowrap">
                Solicitar Orçamento
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle - Right */}
          <div className="flex-1 flex justify-end md:hidden">
            <button className="text-[#001F3F]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {
          isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-200 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 shadow-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#333333] py-2 border-b border-zinc-50"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contato#orcamento" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-[#001F3F] text-white font-bold w-full py-7 text-lg mt-2">
                  Solicitar Orçamento
                </Button>
              </Link>
            </div >
          )}
      </nav >
    </div >
  );
};

export default Navbar;