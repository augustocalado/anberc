"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Cpu, Target, Users, Award, ChevronRight, Zap, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sobre = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-40 pb-24">
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-4 py-2 rounded-full mb-8">
                            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                            <span className="text-[#001F3F] text-xs font-bold uppercase tracking-widest">Excelência em Integração</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#001F3F] mb-8 leading-tight">
                            Referência em <br />
                            <span className="text-[#38BDF8]">Segurança e Conforto</span>
                        </h1>
                        <p className="text-xl text-[#778899] mb-12 max-w-2xl mx-auto leading-relaxed">
                            A Anberc System Security nasceu com o propósito de redefinir o conceito de proteção e climatização, unindo engenharia de precisão com suporte humanizado em São José dos Campos.
                        </p>
                    </div>
                </section>

                {/* Values / Grid */}
                <section className="bg-[#F5F5F5] py-24 mb-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#38BDF8]/5 rounded-full blur-3xl -mr-64 -mt-32 pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ValueCard
                                icon={<Target className="w-8 h-8 text-white" />}
                                title="Nossa Missão"
                                description="Prover soluções integradas que garantam a tranquilidade e o bem-estar dos nossos clientes através da inovação tecnológica."
                                color="bg-cyan-500"
                            />
                            <ValueCard
                                icon={<Cpu className="w-8 h-8 text-white" />}
                                title="Tecnologia"
                                description="Operamos com o estado da arte em hardware e software, garantindo sistemas resilientes e de alta performance."
                                color="bg-[#001F3F]"
                            />
                            <ValueCard
                                icon={<Users className="w-8 h-8 text-white" />}
                                title="Capital Humano"
                                description="Nossa equipe é formada por engenheiros e técnicos certificados, em constante atualização com as normas vigentes."
                                color="bg-cyan-600"
                            />
                        </div>
                    </div>
                </section>

                {/* Details Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-[#38BDF8] font-bold uppercase tracking-widest text-sm mb-4">Engenharia de Soluções</h2>
                                <h3 className="text-4xl md:text-5xl font-bold text-[#001F3F] mb-6 leading-tight">Por que escolher a Anberc?</h3>
                                <p className="text-[#778899] text-lg leading-relaxed mb-6">
                                    Não somos apenas instaladores. Somos parceiros estratégicos do seu patrimônio. Atuamos desde o levantamento técnico (Site Survey) até a manutenção preditiva de sistemas complexos.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <ExpertiseLine icon={<ShieldCheck />} text="Segurança Eletrônica: Monitoramento 24h e CFTV Inteligente" />
                                <ExpertiseLine icon={<Zap />} text="Elétrica: Projetos residenciais, comerciais e industriais" />
                                <ExpertiseLine icon={<Wind />} text="Climatização: Sistemas VRF e Split Inverter de alta eficiência" />
                                <ExpertiseLine icon={<Award />} text="Certificações: Conformidade total com normas de segurança" />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1558467523-46113f1fef72?auto=format&fit=crop&q=80&w=1000"
                                    alt="Anberc Professional Team"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-[#38BDF8] p-8 rounded-3xl shadow-xl">
                                <p className="text-[#001F3F] font-black text-4xl">10+</p>
                                <p className="text-[#001F3F]/60 text-xs font-bold uppercase tracking-widest">Anos de Experiência</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4">
                    <div className="bg-[#001F3F] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 relative z-10">
                            Pronto para o próximo <br />
                            <span className="text-cyan-400">nível de proteção?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                            <Link to="/contato">
                                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-[#001F3F] font-black px-12 py-8 text-xl rounded-2xl shadow-xl shadow-cyan-500/10 border-none transition-all active:scale-[0.98]">
                                    Solicitar Orçamento
                                </Button>
                            </Link>
                            <Link to="/servicos">
                                <Button variant="outline" size="lg" className="border-2 border-white/20 text-white hover:bg-white/10 px-12 py-8 text-xl rounded-2xl transition-all h-full">
                                    Nossos Serviços
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

const ValueCard = ({ icon, title, description, color }: any) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group">
        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-[#001F3F] mb-4">{title}</h3>
        <p className="text-[#778899] font-medium leading-relaxed">{description}</p>
    </div>
);

const ExpertiseLine = ({ icon, text }: any) => (
    <div className="flex items-center gap-4 group cursor-default">
        <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-white transition-colors">
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
        </div>
        <span className="text-[#001F3F] font-bold text-lg">{text}</span>
    </div>
);

export default Sobre;
