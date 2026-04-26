import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Localities = () => {
  const [localities, setLocalities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 cities per page

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_pages')
          .select('slug, city, neighborhood, is_city_page')
          .order('city', { ascending: true });

        if (error) throw error;
        setLocalities(data || []);
      } catch (err) {
        console.error('Erro ao buscar localidades:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalities();
  }, []);

  // Group by city
  const groupedLocalities = localities.reduce((acc: any, curr: any) => {
    if (!acc[curr.city]) {
      acc[curr.city] = [];
    }
    acc[curr.city].push(curr);
    return acc;
  }, {});

  const cityNames = Object.keys(groupedLocalities);
  const totalPages = Math.ceil(cityNames.length / itemsPerPage);
  const displayedCities = cityNames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading && localities.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-cyan-500 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Presença Regional</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#001F3F] leading-tight">
              Eletricista e Câmeras em <span className="text-cyan-500">Sua Região</span>
            </h2>
          </div>
          <p className="text-gray-500 font-medium max-w-sm text-right hidden md:block">
            Atendimento especializado em todo o Vale do Paraíba com unidades móveis em cada bairro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {displayedCities.map((city) => (
            <div key={city} className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 hover:border-cyan-200 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/5 group animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#001F3F] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <MapPin size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#001F3F]">{city}</h3>
              </div>

              <div className="space-y-3">
                {groupedLocalities[city].map((loc: any) => (
                  <Link 
                    key={loc.slug} 
                    to={`/servicos/${loc.slug}`}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-cyan-500 hover:translate-x-1 transition-all duration-300 group/item"
                  >
                    <span className="text-sm font-bold text-gray-700 group-hover/item:text-cyan-600 transition-colors">
                      {loc.neighborhood || `Geral ${city}`}
                    </span>
                    <ArrowRight size={14} className="text-gray-300 group-hover/item:text-cyan-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-gray-200 text-[#001F3F] font-bold rounded-xl h-12"
            >
              Anterior
            </Button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-10 h-10 rounded-xl font-bold text-sm transition-all",
                    currentPage === i + 1 
                      ? "bg-[#001F3F] text-white" 
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-200 text-[#001F3F] font-bold rounded-xl h-12"
            >
              Próxima
            </Button>
          </div>
        )}

        <div className="mt-16 p-8 bg-[#001F3F] rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 text-center md:text-left">
            <h4 className="text-white text-xl font-bold mb-2">Não encontrou seu bairro?</h4>
            <p className="text-white/60 text-sm">Atendemos todo o Vale do Paraíba sob consulta.</p>
          </div>
          <Link to="/contato" className="relative z-10">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-[#001F3F] font-bold px-8 py-6 rounded-xl">
              Consultar Disponibilidade
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Localities;
