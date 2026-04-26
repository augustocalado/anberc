"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Cpu, Loader2, Send, MessageSquare, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('leads').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Assunto: ${formData.subject}\n\nMensagem: ${formData.message}`
      }]);

      if (error) throw error;

      toast.success("Solicitação enviada com sucesso! Em breve entraremos em contato.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Erro ao enviar lead:', err);
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#38BDF8]/30 overflow-x-hidden">
      <Navbar />

      <main className="pt-40 pb-24 relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#38BDF8]/5 rounded-full blur-3xl -mr-64 -mt-32 pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#001F3F]/5 rounded-full blur-3xl -ml-48 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-4 py-2 rounded-full mb-6">
                <Cpu className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[#001F3F] text-xs font-bold uppercase tracking-widest leading-none">Canal Direto com Engenharia</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[#001F3F] mb-8 tracking-tight">
                Vamos Proteger seu <br />
                <span className="text-[#38BDF8]">Patrimônio Juntos</span>
              </h1>
              <p className="text-[#778899] text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                Dúvidas técnicas ou solicitações de orçamento? Nossa equipe de especialistas está pronta para desenhar sua solução em SJC.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Contact Info Cards */}
              <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="bg-[#001F3F] p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#38BDF8]/20 transition-colors" />

                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#38BDF8]/20 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="text-[#38BDF8] w-6 h-6" />
                    </div>
                    Canais Oficiais
                  </h3>

                  <div className="space-y-8">
                    <ContactItem
                      icon={<Phone className="text-[#38BDF8]" size={24} />}
                      label="Telefone & WhatsApp"
                      value="(12) 98162-8675"
                      href="https://wa.me/5512981628675"
                    />
                    <ContactItem
                      icon={<Mail className="text-[#38BDF8]" size={24} />}
                      label="E-mail Corporativo"
                      value="contato@anberc.com.br"
                      href="mailto:contato@anberc.com.br"
                    />
                    <ContactItem
                      icon={<MapPin className="text-[#38BDF8]" size={24} />}
                      label="Nossa Sede"
                      value="São José dos Campos, SP"
                    />
                    <ContactItem
                      icon={<Clock className="text-[#38BDF8]" size={24} />}
                      label="Horário de Atendimento"
                      value="Segunda a Sexta: 08h às 18h"
                    />
                  </div>

                  <div className="mt-12 pt-10 border-t border-white/10">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Siga a Anberc</p>
                    <div className="flex gap-4">
                      {['Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                        <button key={social} className="px-4 py-2 bg-white/5 hover:bg-[#38BDF8] hover:text-white rounded-xl text-xs font-bold transition-all border border-white/10">
                          {social}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#38BDF8] p-8 rounded-[2.5rem] text-[#001F3F] shadow-xl flex items-center gap-6 group hover:translate-y-[-4px] transition-transform duration-300 cursor-pointer overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl" />
                  <div className="w-16 h-16 bg-[#001F3F] rounded-2xl flex items-center justify-center shrink-0">
                    <MessageSquare className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Atendimento via Chat</h4>
                    <p className="text-[#001F3F]/70 font-medium">Fale agora pelo WhatsApp</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div id="orcamento" className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-1000 scroll-mt-40">
                <div className="h-full bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                  <h3 className="text-3xl font-bold text-[#001F3F] mb-2">Envie sua Mensagem</h3>
                  <p className="text-[#778899] font-medium mb-10">Preencha os campos abaixo e retornaremos em até 24h úteis.</p>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Nome Completo"
                        placeholder="Ex: João Silva"
                        value={formData.name}
                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <FormInput
                        label="E-mail Corporativo"
                        type="email"
                        placeholder="contato@empresa.com"
                        value={formData.email}
                        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="WhatsApp"
                        placeholder="(12) 90000-0000"
                        value={formData.phone}
                        onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <FormInput
                        label="Assunto do Contato"
                        placeholder="Ex: Orçamento CFTV"
                        value={formData.subject}
                        onChange={(e: any) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#001F3F] ml-1 uppercase tracking-tighter opacity-70">Mensagem Detalhada</label>
                      <Textarea
                        required
                        className="bg-gray-50 border-gray-200 min-h-[160px] rounded-2xl focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all p-4 text-gray-900 font-medium text-base resize-none"
                        placeholder="Descreva brevemente o que você precisa..."
                        value={formData.message}
                        onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <Button
                      disabled={loading}
                      size="lg"
                      className="w-full bg-[#001F3F] hover:bg-[#0EA5E9] hover:scale-[1.01] active:scale-[0.99] text-white h-16 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 gap-3 border-none group"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-6 h-6" />
                      ) : (
                        <>
                          Enviar Solicitação Técnica
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ContactItem = ({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string, href?: string }) => (
  <div className="flex gap-5 group/item">
    <div className="bg-white/5 p-4 rounded-2xl group-hover/item:bg-[#38BDF8]/20 transition-colors duration-300 border border-white/5 h-fit">
      {icon}
    </div>
    <div>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      {href ? (
        <a href={href} className="text-white font-bold text-lg hover:text-[#38BDF8] transition-colors leading-tight block">
          {value}
        </a>
      ) : (
        <p className="text-white font-bold text-lg leading-tight">{value}</p>
      )}
    </div>
  </div>
);

const FormInput = ({ label, type = "text", placeholder, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-[#001F3F] ml-1 uppercase tracking-tighter opacity-70">{label}</label>
    <Input
      required
      type={type}
      className="bg-gray-50 border-gray-200 h-14 rounded-2xl focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all px-4 text-gray-900 font-medium"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default Contact;