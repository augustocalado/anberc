import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Plus, Search, Edit2, Trash2, Save, X, MapPin, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SeoManagement = () => {
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPage, setEditingPage] = useState<any>(null);
  const [isNewCity, setIsNewCity] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    city: '',
    neighborhood: '',
    title: '',
    meta_description: '',
    h1: '',
    intro_text: '',
    nearby_locations: '',
    map_query: '',
    banner_url: '',
    map_embed_url: '',
    services: '',
    is_city_page: false
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .order('city', { ascending: true })
        .order('is_city_page', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar páginas SEO:', err);
      toast.error('Erro ao carregar lista de páginas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setIsNewCity(false);
    setFormData({
      slug: page.slug || '',
      city: page.city || '',
      neighborhood: page.neighborhood || '',
      title: page.title || '',
      meta_description: page.meta_description || '',
      h1: page.h1 || '',
      intro_text: page.intro_text || '',
      nearby_locations: page.nearby_locations || '',
      map_query: page.map_query || '',
      banner_url: page.banner_url || '',
      map_embed_url: page.map_embed_url || '',
      services: Array.isArray(page.services) ? page.services.join(', ') : '',
      is_city_page: page.is_city_page || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convert services string to JSON array
    const servicesArray = formData.services.split(',').map(s => s.trim()).filter(s => s !== '');
    const dataToSave = {
      ...formData,
      services: servicesArray
    };

    try {
      // Check if slug already exists in another page
      const { data: existingPage } = await supabase
        .from('seo_pages')
        .select('id, slug')
        .eq('slug', formData.slug)
        .single();

      if (existingPage && (!editingPage?.id || existingPage.id !== editingPage.id)) {
        toast.error(`O endereço "/servicos/${formData.slug}" já está em uso por outra página. Use um slug diferente.`);
        setLoading(false);
        return;
      }

      if (editingPage?.id) {
        const { error } = await supabase
          .from('seo_pages')
          .update(dataToSave)
          .eq('id', editingPage.id);

        if (error) throw error;
        toast.success('Página SEO atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('seo_pages')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Nova página SEO criada!');
      }

      setEditingPage(null);
      setFormData({
        slug: '', city: '', neighborhood: '', title: '',
        meta_description: '', h1: '', intro_text: '',
        nearby_locations: '', map_query: '', banner_url: '',
        map_embed_url: '', services: '', is_city_page: false
      });
      fetchPages();
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      const errorMessage = err.message || 'Erro desconhecido';
      if (err.code === '23505') {
        toast.error('Este endereço (Slug) já existe. Por favor, escolha outro.');
      } else {
        toast.error(`Erro no banco de dados: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateAiSuggestions = () => {
    const { city, neighborhood } = formData;
    if (!city) {
      toast.error('Preencha pelo menos a cidade para gerar sugestões.');
      return;
    }

    const loc = neighborhood ? `${neighborhood} | ${city}` : city;
    const locSimple = neighborhood ? `${neighborhood} em ${city}` : city;

    const titles = [
      `Eletricista e Instalação de Câmeras em ${loc} | Anberc`,
      `Segurança Eletrônica e Manutenção Elétrica ${loc} - Anberc`,
      `Eletricista 24h e CFTV em ${locSimple} | Melhor Preço`
    ];

    const descriptions = [
      `Precisa de um eletricista de confiança ou instalação de câmeras no ${locSimple}? A Anberc oferece serviços profissionais de manutenção elétrica, CFTV e segurança eletrônica com garantia.`,
      `Soluções completas em elétrica e segurança para residências e empresas em ${locSimple}. Atendimento rápido, técnico e especializado. Solicite seu orçamento agora!`,
      `Referência em ${locSimple} para instalação de câmeras, cercas elétricas e reparos elétricos urgentes. Equipe treinada e materiais de primeira linha.`
    ];

    const h1s = [
      `Eletricista e Instalação de Câmeras no ${locSimple}`,
      `Segurança e Manutenção Elétrica em ${locSimple}`,
      `Eletricista Profissional e CFTV: Atendimento em ${locSimple}`
    ];

    // Simple randomization or just pick first
    setFormData(prev => ({
      ...prev,
      title: titles[0],
      meta_description: descriptions[0],
      h1: h1s[0],
      intro_text: `Nossa empresa é especialista em segurança eletrônica e serviços elétricos, atendendo toda a região de ${city} com foco especial no ${neighborhood || 'centro'}. Oferecemos desde pequenos reparos até grandes projetos de CFTV e automação.`
    }));

    toast.success('Sugestões geradas com base na localidade!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página SEO?')) return;
    
    try {
      const { error } = await supabase.from('seo_pages').delete().eq('id', id);
      if (error) throw error;
      toast.success('Página excluída.');
      fetchPages();
    } catch (err) {
      toast.error('Erro ao excluir.');
    }
  };

  const filteredPages = pages.filter(p => 
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.neighborhood && p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueCities = Array.from(new Set(pages.map(p => p.city))).sort();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#001F3F] mb-2 flex items-center gap-3">
                <Globe className="text-cyan-500" />
                Gestão de SEO (Landing Pages)
              </h1>
              <p className="text-gray-500">Gerencie as páginas de destino por cidade e bairro.</p>
            </div>
            <Button 
              onClick={() => {
                setEditingPage({});
                setFormData({
                  slug: '', city: '', neighborhood: '', title: '',
                  meta_description: '', h1: '', intro_text: '',
                  nearby_locations: '', map_query: '', banner_url: '',
                  map_embed_url: '', services: '', is_city_page: false
                });
                setIsNewCity(false);
              }}
              className="bg-[#001F3F] hover:bg-[#003366] text-white rounded-xl px-6 h-12 font-bold shadow-lg shadow-[#001F3F]/20 flex items-center gap-2"
            >
              <Plus size={20} /> Nova Página
            </Button>
          </div>

          {editingPage && (
            <Card className="mb-8 border-none shadow-2xl bg-[#001F3F] text-white overflow-hidden rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 p-6">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                    <Edit2 className="text-cyan-400 w-5 h-5" />
                    {editingPage.id ? 'Editar Página' : 'Nova Página SEO'}
                  </CardTitle>
                  <Button 
                    type="button" 
                    onClick={generateAiSuggestions}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 h-8 rounded-full flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Sugestão com IA
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setEditingPage(null)} className="text-white hover:bg-white/10">
                  <X size={20} />
                </Button>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Coluna 1 */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Cidade</Label>
                        <div className="flex gap-2">
                          {isNewCity ? (
                            <Input 
                              className="bg-white/5 border-white/10 text-white h-10" 
                              placeholder="Nome da nova cidade"
                              value={formData.city}
                              onChange={e => setFormData({...formData, city: e.target.value})}
                              required
                            />
                          ) : (
                            <select 
                              className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              value={formData.city}
                              onChange={e => setFormData({...formData, city: e.target.value})}
                              required
                            >
                              <option value="" className="bg-[#001F3F]">Selecione uma cidade...</option>
                              {uniqueCities.map(city => (
                                <option key={city} value={city} className="bg-[#001F3F]">{city}</option>
                              ))}
                            </select>
                          )}
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsNewCity(!isNewCity);
                              if (!isNewCity) setFormData({...formData, city: ''});
                            }}
                            className="border-white/10 hover:bg-white/10 text-cyan-400 shrink-0 h-10 w-10 p-0"
                            title={isNewCity ? "Selecionar existente" : "Cadastrar nova cidade"}
                          >
                            {isNewCity ? <Search size={18} /> : <Plus size={18} />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Bairro (Opcional)</Label>
                        <Input 
                          className="bg-white/5 border-white/10 text-white h-10" 
                          placeholder="Ex: Jardim Aquarius"
                          value={formData.neighborhood}
                          onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">URL Slug (Ex: sjc/aquarius)</Label>
                        <Input 
                          required 
                          className="bg-white/5 border-white/10 text-white h-10" 
                          placeholder="sao-jose-dos-campos/jardim-aquarius"
                          value={formData.slug}
                          onChange={e => setFormData({...formData, slug: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Título SEO (Meta Title)</Label>
                        <Input 
                          required 
                          className="bg-white/5 border-white/10 text-white h-10" 
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Descrição SEO (Meta Description)</Label>
                        <Textarea 
                          required 
                          className="bg-white/5 border-white/10 text-white min-h-[100px]" 
                          value={formData.meta_description}
                          onChange={e => setFormData({...formData, meta_description: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Coluna 2 */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">H1 da Página</Label>
                        <Input 
                          required 
                          className="bg-white/5 border-white/10 text-white h-10" 
                          value={formData.h1}
                          onChange={e => setFormData({...formData, h1: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Texto de Introdução</Label>
                        <Textarea 
                          required 
                          className="bg-white/5 border-white/10 text-white min-h-[80px]" 
                          value={formData.intro_text}
                          onChange={e => setFormData({...formData, intro_text: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">URL de Incorporação do Mapa</Label>
                        <Input 
                          className="bg-white/5 border-white/10 text-white h-10" 
                          placeholder="Link src do Google Maps Embed..."
                          value={formData.map_embed_url}
                          onChange={e => setFormData({...formData, map_embed_url: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Serviços (separados por vírgula)</Label>
                        <Input 
                          className="bg-white/5 border-white/10 text-white h-10" 
                          placeholder="Ex: Câmeras, Alarmes, Eletricista"
                          value={formData.services}
                          onChange={e => setFormData({...formData, services: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">URL do Banner</Label>
                        <Input 
                          className="bg-white/5 border-white/10 text-white h-10" 
                          placeholder="Link da imagem..."
                          value={formData.banner_url}
                          onChange={e => setFormData({...formData, banner_url: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input 
                          type="checkbox" 
                          id="is_city_page"
                          className="w-4 h-4 rounded border-white/10 bg-white/5"
                          checked={formData.is_city_page}
                          onChange={e => setFormData({...formData, is_city_page: e.target.checked})}
                        />
                        <Label htmlFor="is_city_page" className="text-sm font-medium">Esta é uma página de Cidade?</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                    <Button type="button" variant="ghost" onClick={() => setEditingPage(null)} className="text-white">Cancelar</Button>
                    <Button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-[#001F3F] font-bold px-8 h-12 rounded-xl">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-5 h-5" />}
                      Salvar Página
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-white border-b flex flex-row items-center justify-between py-6 px-8">
              <CardTitle className="text-xl font-bold text-[#001F3F] flex items-center gap-2">
                <Globe className="text-cyan-500 w-6 h-6" />
                Páginas Indexadas
              </CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Buscar por cidade, bairro..." 
                  className="pl-10 h-11 rounded-xl text-sm border-gray-100"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b">
                    <tr>
                      <th className="px-8 py-5">Localização</th>
                      <th className="px-8 py-5">URL Slug</th>
                      <th className="px-8 py-5">Título SEO</th>
                      <th className="px-8 py-5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {loading && pages.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-bold uppercase text-xs">
                          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 opacity-20 text-[#001F3F]" />
                          Carregando dados...
                        </td>
                      </tr>
                    ) : filteredPages.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-bold uppercase text-xs">
                          Nenhuma página encontrada para sua busca.
                        </td>
                      </tr>
                    ) : filteredPages.map((page) => (
                      <tr key={page.id} className={cn(
                        "transition-colors group border-l-4",
                        page.is_city_page ? "bg-gray-50/50 border-l-[#001F3F]" : "bg-white border-l-transparent hover:bg-cyan-50/30"
                      )}>
                        <td className="px-8 py-5">
                          <div className={cn(
                            "flex items-center gap-4",
                            !page.is_city_page && "ml-10"
                          )}>
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                              page.is_city_page ? 'bg-[#001F3F] text-white shadow-lg' : 'bg-cyan-100 text-cyan-600'
                            )}>
                              <MapPin size={20} />
                            </div>
                            <div>
                              <span className={cn(
                                "font-bold block tracking-tight",
                                page.is_city_page ? "text-[#001F3F] text-lg" : "text-gray-900 text-base"
                              )}>
                                {page.city}
                              </span>
                              <span className={cn(
                                "text-xs font-bold uppercase tracking-widest",
                                page.is_city_page ? "text-cyan-600" : "text-gray-400"
                              )}>
                                {page.is_city_page ? 'Página Pilar (Cidade)' : page.neighborhood}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <code className={cn(
                            "text-[11px] px-3 py-1.5 rounded-lg font-bold border",
                            page.is_city_page ? "bg-cyan-100 text-cyan-800 border-cyan-200" : "bg-gray-100 text-gray-500 border-gray-200"
                          )}>
                            /servicos/{page.slug}
                          </code>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-gray-600 truncate max-w-[280px] block font-medium">{page.title}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => handleEdit(page)} className="h-10 w-10 p-0 hover:bg-cyan-100 hover:text-cyan-700 rounded-xl">
                              <Edit2 size={18} />
                            </Button>
                            <Button variant="ghost" onClick={() => handleDelete(page.id)} className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-500 rounded-xl">
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SeoManagement;
