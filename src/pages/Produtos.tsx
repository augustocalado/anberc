"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Filter, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import NovoProdutoModal from '@/components/produtos/NovoProdutoModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Produtos = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');

  // Set initial tab based on path
  const isServicesPage = location.pathname === '/servicos';
  const [activeTab, setActiveTab] = useState(isServicesPage ? 'servicos' : 'produtos');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setActiveTab(location.pathname === '/servicos' ? 'servicos' : 'produtos');
  }, [location.pathname]);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  React.useEffect(() => {
    fetchItems();
  }, []);

  const handleNovoItem = () => {
    setSelectedItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleVer = (item: any) => {
    setSelectedItem(item);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditar = (item: any) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item excluído com sucesso!');
      fetchItems();
    } catch (err) {
      console.error('Erro ao excluir:', err);
      toast.error('Erro ao excluir o item.');
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('produtos').select('*').order('nome');
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Erro ao buscar itens:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'todos' || item.categoria === filterCategory;
    const matchesTab = (activeTab === 'produtos' && item.tipo === 'produto') ||
      (activeTab === 'servicos' && item.tipo === 'servico');
    return matchesSearch && matchesFilter && matchesTab;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTab === 'produtos' ? 'Catálogo de Produtos' : 'Catálogo de Serviços'}
                </h1>
                <p className="text-gray-600">
                  {activeTab === 'produtos' ? 'Gerencie seus equipamentos e materiais' : 'Gerencie seus serviços e mão de obra'}
                </p>
              </div>
              <Button
                onClick={handleNovoItem}
                className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20 px-6 h-12 rounded-xl font-bold gap-2"
              >
                <Plus className="w-4 h-4" />
                {activeTab === 'produtos' ? 'Novo Produto' : 'Novo Serviço'}
              </Button>
            </div>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="todos">Todas as Categorias</option>
                <option value="Segurança">Segurança</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Climatização">Climatização</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {activeTab === 'produtos' ? 'Produto' : 'Serviço'}
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Preço</th>
                      {activeTab === 'produtos' && (
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estoque</th>
                      )}
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{item.nome}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="text-xs font-medium">
                            {item.categoria}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-cyan-600">
                            {item.preco}
                          </span>
                        </td>
                        {activeTab === 'produtos' && (
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${item.estoque > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.estoque > 0 ? `${item.estoque} unidades` : 'Esgotado'}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleVer(item)}
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditar(item)}
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:text-red-600"
                              onClick={() => handleExcluir(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={activeTab === 'produtos' ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                          Nenhum {activeTab === 'produtos' ? 'produto' : 'serviço'} encontrado para sua busca.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <NovoProdutoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={activeTab === 'produtos' ? 'produto' : 'servico'}
        onSuccess={fetchItems}
        mode={modalMode}
        item={selectedItem}
      />
    </div>
  );
};

export default Produtos;