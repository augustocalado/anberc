"use client";

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ShieldCheck, Sparkles, Wind, Zap, ArrowRight, MessageCircle } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Catalog = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');

    const isServicesPage = location.pathname === '/servicos';
    const type = isServicesPage ? 'servico' : 'produto';

    const items = [
        {
            id: 1,
            nome: 'Sistema de CFTV 4K Ultra',
            categoria: 'Segurança',
            tipo: 'produto',
            descricao: 'Monitoramento de alta resolução com inteligência artificial e visão noturna colorida.',
            icon: ShieldCheck,
            cor: 'blue'
        },
        {
            id: 2,
            nome: 'Manutenção Elétrica Industrial',
            categoria: 'Elétrica',
            tipo: 'servico',
            descricao: 'Diagnóstico e manutenção preventiva em quadros elétricos e infraestrutura de alta carga.',
            icon: Zap,
            cor: 'yellow'
        },
        {
            id: 3,
            nome: 'Instalação de Ar Split Inverter',
            categoria: 'Climatização',
            tipo: 'servico',
            descricao: 'Dimensionamento técnico e instalação de sistemas de alta eficiência energética.',
            icon: Wind,
            cor: 'cyan'
        },
        {
            id: 4,
            nome: 'Alarme Perimetral Laser',
            categoria: 'Segurança',
            tipo: 'produto',
            descricao: 'Proteção perimetral avançada com sensores laser e integração com smartphone.',
            icon: ShieldCheck,
            cor: 'blue'
        }
    ].filter(item => item.tipo === type);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.nome.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedCategory === 'todos' || item.categoria === selectedCategory;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-40 pb-24">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                            <span className="text-[#001F3F] text-xs font-bold uppercase tracking-widest">Tecnologia Certificada</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-[#001F3F] mb-6">
                            {isServicesPage ? 'Nossa Expertise em' : 'Equipamentos de'} <br />
                            <span className="text-[#38BDF8]">{isServicesPage ? 'Serviços Técnicos' : 'Alta Performance'}</span>
                        </h1>
                        <p className="text-[#778899] text-xl font-medium leading-relaxed">
                            {isServicesPage
                                ? 'Soluções de engenharia dimensionadas para atender as necessidades mais críticas de segurança e conforto em SJC.'
                                : 'A tecnologia mais avançada do mercado para blindar seu patrimônio e garantir eficiência máxima.'}
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-[#F5F5F5] p-6 rounded-[2rem] mb-12 flex flex-col md:flex-row gap-4 items-center shadow-inner border border-gray-100">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#001F3F]/30 w-5 h-4" />
                            <Input
                                placeholder={`Buscar em ${isServicesPage ? 'serviços' : 'produtos'}...`}
                                className="bg-white border-none rounded-xl h-14 pl-12 text-[#001F3F] font-medium shadow-sm focus:ring-[#38BDF8]"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            {['todos', 'Segurança', 'Elétrica', 'Climatização'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-6 h-14 rounded-xl font-bold text-sm transition-all duration-300 border-2",
                                        selectedCategory === cat
                                            ? "bg-[#001F3F] border-[#001F3F] text-white shadow-lg"
                                            : "bg-white border-transparent text-[#001F3F]/60 hover:border-[#38BDF8]/30 hover:text-[#38BDF8]"
                                    )}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="group relative bg-[#F5F5F5] rounded-[2.5rem] p-8 border border-transparent hover:border-[#38BDF8]/30 hover:bg-white hover:shadow-2xl hover:shadow-[#38BDF8]/10 transition-all duration-500">
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500",
                                    item.cor === 'blue' ? "bg-blue-100 text-blue-600" :
                                        item.cor === 'cyan' ? "bg-cyan-100 text-cyan-600" :
                                            "bg-yellow-100 text-yellow-600"
                                )}>
                                    <item.icon size={32} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge className="bg-white text-[#001F3F] border-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                                            {item.categoria}
                                        </Badge>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-[#001F3F] group-hover:text-[#38BDF8] transition-colors">
                                        {item.nome}
                                    </h3>
                                    <p className="text-[#778899] font-medium leading-relaxed">
                                        {item.descricao}
                                    </p>
                                    <div className="pt-6 flex flex-col gap-3">
                                        <Link to="/contato">
                                            <Button className="w-full bg-[#001F3F] group-hover:bg-[#38BDF8] text-white font-bold h-12 rounded-xl transition-all gap-2">
                                                Interesse Técnico
                                                <ArrowRight size={18} />
                                            </Button>
                                        </Link>
                                        <a href="https://wa.me/5512981628675" target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" className="w-full text-[#38BDF8] font-extrabold h-12 rounded-xl border border-transparent hover:border-[#38BDF8] gap-2">
                                                <MessageCircle size={18} />
                                                WhatsApp Direto
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-[#F5F5F5] inline-flex p-10 rounded-full mb-8">
                                <Search className="w-16 h-16 text-[#001F3F]/20" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#001F3F]">Nenhum item encontrado</h3>
                            <p className="text-[#778899]">Tente alterar os filtros ou a busca para outro termo.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* CTA Final */}
            <section className="py-24 bg-[#001F3F]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Precisa de um projeto sob medida?</h2>
                    <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12 font-medium">
                        Realizamos o dimensionamento técnico gratuito para sua residência ou empresa em São José dos Campos e região.
                    </p>
                    <Link to="/contato">
                        <Button size="lg" className="bg-[#38BDF8] text-white hover:bg-[#0EA5E9] px-12 py-8 text-xl rounded-2xl font-bold shadow-2xl border-none">
                            Falar com um Especialista
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Catalog;
