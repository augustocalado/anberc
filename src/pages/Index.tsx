"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import SEO from '@/components/seo/SEO';
import Hero from '@/components/home/Hero';
import Partners from '@/components/home/Partners';
import ServicesGrid from '@/components/home/ServicesGrid';
import About from '@/components/home/About';
import Testimonials from '@/components/home/Testimonials';
import Localities from '@/components/home/Localities';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Cpu, Target, Eye, ShieldCheck, ArrowRight, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [googleVerify, setGoogleVerify] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const fetchSEO = async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'google_site_verification')
        .single();

      if (data) setGoogleVerify(data.value.code);
    };

    fetchSEO();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('leads').insert([{
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: 'Lead capturado via formulário rápido da Home Page.'
      }]);

      if (error) throw error;

      toast.success("Solicitação enviada! Nossa engenharia entrará em contato em até 24h.");
      setFormData({ name: '', phone: '', email: '' });
    } catch (err: any) {
      console.error('Erro ao enviar lead:', err);
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#38BDF8]/30">
      <SEO
        title="Página Inicial"
        description="A Anberc é especialista em segurança eletrônica, oferecendo soluções completas em CFTV, alarmes e monitoramento 24h."
        googleVerification={googleVerify}
      />
      <Navbar />

      <main>
        <Hero />

        <Partners />

        {/* Seção Institucional: Missão, Visão e Valores */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[#38BDF8] font-bold tracking-widest uppercase text-sm">Nossa Essência</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#001F3F] mt-4">Compromisso com a Excelência</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Missão */}
              <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-[#38BDF8] hover:shadow-2xl hover:shadow-[#38BDF8]/10 transition-all duration-500 group">
                <div className="w-16 h-16 bg-[#38BDF8]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#38BDF8] transition-colors duration-500">
                  <Target className="w-8 h-8 text-[#38BDF8] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#001F3F] mb-4">Missão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Proporcionar conforto térmico e segurança eletrônica de alta tecnologia para famílias e empresas de <strong>São José dos Campos</strong>, com atendimento ágil e técnico.
                </p>
              </div>

              {/* Visão */}
              <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-[#38BDF8] hover:shadow-2xl hover:shadow-[#38BDF8]/10 transition-all duration-500 group">
                <div className="w-16 h-16 bg-[#38BDF8]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#38BDF8] transition-colors duration-500">
                  <Eye className="w-8 h-8 text-[#38BDF8] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#001F3F] mb-4">Visão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ser a referência número 1 em soluções residenciais e corporativas no <strong>Vale do Paraíba</strong>, reconhecida pela qualidade técnica e confiança até 2030.
                </p>
              </div>

              {/* Valores */}
              <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-[#38BDF8] hover:shadow-2xl hover:shadow-[#38BDF8]/10 transition-all duration-500 group">
                <div className="w-16 h-16 bg-[#38BDF8]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#38BDF8] transition-colors duration-500">
                  <ShieldCheck className="w-8 h-8 text-[#38BDF8] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#001F3F] mb-4">Valores</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transparência nos orçamentos, pontualidade nos prazos, compromisso com a segurança do cliente e inovação constante em <strong>SJC</strong>.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link to="/servicos">
                <Button className="bg-[#001F3F] text-white hover:bg-[#002d5c] px-8 py-6 rounded-xl font-bold group">
                  Conheça Nossos Serviços em SJC
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <ServicesGrid />

        <About />

        <Testimonials />
        <Localities />

        {/* CTA Final Corporativo */}
        <section id="orcamento" className="py-24 bg-[#F5F5F5] scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="bg-[#001F3F] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#38BDF8]/5 rounded-full -ml-32 -mb-32 blur-3xl" />

              <div className="relative z-10">
                <Cpu className="w-16 h-16 text-[#38BDF8] mx-auto mb-8 opacity-50" />
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Pronto para integrar sua segurança?</h2>
                <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto font-medium">
                  Fale agora com nosso corpo de engenharia e receba um projeto técnico personalizado para sua necessidade.
                </p>

                <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" onSubmit={handleSubmit}>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#38BDF8] ml-1">Nome Completo</label>
                      <Input
                        required
                        className="bg-white/10 border-white/10 h-14 rounded-xl text-white placeholder:text-white/20 focus:ring-[#38BDF8]"
                        placeholder="Ex: João Silva"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#38BDF8] ml-1">WhatsApp</label>
                      <Input
                        required
                        className="bg-white/10 border-white/10 h-14 rounded-xl text-white placeholder:text-white/20 focus:ring-[#38BDF8]"
                        placeholder="(12) 90000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#38BDF8] ml-1">E-mail</label>
                      <Input
                        required
                        type="email"
                        className="bg-white/10 border-white/10 h-14 rounded-xl text-white placeholder:text-white/20 focus:ring-[#38BDF8]"
                        placeholder="contato@empresa.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 text-left flex flex-col justify-end">
                      <Button
                        disabled={loading}
                        size="lg"
                        className="bg-[#38BDF8] text-white hover:bg-[#0EA5E9] h-14 text-lg rounded-xl font-bold shadow-2xl border-none w-full"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : (
                          <>
                            Solicitar
                            <Send className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  <p className="mt-6 text-white/30 text-xs text-center font-medium italic">
                    Ao enviar, nossa engenharia entrará em contato em até 24h úteis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Floating Button - Now in Light Blue */}
      <a
        href="https://wa.me/5512981628675"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#38BDF8] text-white p-4 rounded-full shadow-2xl hover:bg-[#0EA5E9] hover:scale-110 transition-all duration-300 group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-[#001F3F] text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
          Suporte Técnico WhatsApp
        </span>
      </a>
    </div>
  );
};

export default Index;