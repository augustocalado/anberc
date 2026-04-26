import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin, ShieldCheck, Zap, Camera, ArrowRight, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ServicosLocalidade = () => {
  const { city, neighborhood } = useParams();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const slug = neighborhood ? `${city}/${neighborhood}` : city;

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('seo_pages')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPageData(data);
      } catch (err) {
        console.error('Erro ao buscar página SEO:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-600 w-12 h-12" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold text-[#001F3F] mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-8">Não encontramos serviços específicos para esta localidade ainda.</p>
          <Link to="/">
            <Button className="bg-[#001F3F] text-white">Voltar para Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Anberc - ${pageData.h1}`,
    "image": "https://anberc.com.br/logo.png",
    "@id": `https://anberc.com.br/servicos/${pageData.slug}`,
    "url": `https://anberc.com.br/servicos/${pageData.slug}`,
    "telephone": "+5512981628675",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": pageData.city,
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.1857, // Default SJC
      "longitude": -45.8892
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#38BDF8]/30">
      <SEO 
        title={pageData.title}
        description={pageData.meta_description}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      
      <Navbar />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center text-white overflow-hidden bg-[#001F3F]">
          {/* Background Image with Overlay */}
          {pageData.banner_url ? (
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
              style={{ backgroundImage: `url(${pageData.banner_url})` }}
            >
              <div className="absolute inset-0 bg-[#001F3F]/60 backdrop-brightness-50" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#001F3F] via-[#001F3F]/40 to-transparent" />
            </div>
          ) : (
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-100 text-xs font-bold uppercase tracking-widest">{pageData.neighborhood || pageData.city}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {pageData.h1}
              </h1>
              <p className="text-white/90 text-xl leading-relaxed mb-10 drop-shadow-md font-medium">
                {pageData.intro_text}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-[#001F3F] font-bold px-8 py-6 rounded-xl text-lg group shadow-2xl shadow-cyan-500/20">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <a 
                  href={`https://wa.me/5512981628675?text=Olá, gostaria de um orçamento para serviços elétricos/câmeras no bairro ${pageData.neighborhood || pageData.city}.`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white font-bold px-8 py-6 rounded-xl text-lg">
                    Falar via WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#001F3F] mb-6">Serviços Especializados em {pageData.neighborhood || pageData.city}</h2>
                <div className="space-y-6">
                  {pageData.services?.map((service: string, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0">
                        {service.toLowerCase().includes('câmera') ? <Camera className="text-cyan-600" /> : <Zap className="text-cyan-600" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#001F3F] mb-1">{service}</h4>
                        <p className="text-sm text-gray-600">Qualidade e garantia em cada instalação realizada no {pageData.neighborhood || 'município'}.</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-cyan-600" />
                    <h4 className="font-bold text-[#001F3F]">Diferencial Regional</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{pageData.nearby_locations}"
                  </p>
                </div>
              </div>

              <div className="h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-100">
                {pageData.map_embed_url ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={pageData.map_embed_url}
                  ></iframe>
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(pageData.map_query)}`}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content & Dicas */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#001F3F] mb-12 text-center">Por que escolher a Anberc?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="text-cyan-500 w-8 h-8" />
                  </div>
                  <h4 className="font-bold mb-2">Segurança Máxima</h4>
                  <p className="text-sm text-gray-600">Projetos desenhados para a realidade de {pageData.city}.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                    <Zap className="text-cyan-500 w-8 h-8" />
                  </div>
                  <h4 className="font-bold mb-2">Engenharia Técnica</h4>
                  <p className="text-sm text-gray-600">Eletricistas treinados e certificados.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="text-cyan-500 w-8 h-8" />
                  </div>
                  <h4 className="font-bold mb-2">Atendimento 24h</h4>
                  <p className="text-sm text-gray-600">Suporte técnico especializado em todo o Vale.</p>
                </div>
              </div>

              <div className="mt-20 p-10 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-[#001F3F]">Dicas de Segurança para {pageData.neighborhood || pageData.city}</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2" />
                    <p className="text-gray-700"><strong>Google Meu Negócio:</strong> Avalie nossos serviços mencionando seu bairro. Isso ajuda outros moradores a encontrarem profissionais de confiança.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2" />
                    <p className="text-gray-700"><strong>Manutenção Preventiva:</strong> O clima do Vale do Paraíba pode afetar fiações externas. Revise anualmente seu quadro de energia.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2" />
                    <p className="text-gray-700"><strong>Monitoramento Remoto:</strong> Configure o acesso das câmeras no seu celular para viajar com tranquilidade.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/5512981628675?text=Olá, gostaria de um orçamento para serviços elétricos/câmeras no bairro ${pageData.neighborhood || pageData.city}.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#38BDF8] text-white p-4 rounded-full shadow-2xl hover:bg-[#0EA5E9] hover:scale-110 transition-all duration-300 group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-[#001F3F] text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
          Orçamento no {pageData.neighborhood || 'Bairro'}
        </span>
      </a>
    </div>
  );
};

export default ServicosLocalidade;
