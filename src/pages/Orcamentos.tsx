"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NovoOrcamentoModal from '@/components/orcamentos/NovoOrcamentoModal';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Eye, Edit, Download, FileText, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Orcamentos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  React.useEffect(() => {
    fetchOrcamentos();
  }, []);

  const fetchOrcamentos = async () => {
    setLoading(true);
    try {
      // For now, since there might not be an orcamentos table, we'll try to fetch 
      // but catch safely. If the table doesn't exist, we'll keep it empty instead of crashing.
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== '42P01') throw error;
      setOrcamentos(data || []);
    } catch (err) {
      console.error('Erro ao buscar orçamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrcamentos = orcamentos.filter(orcamento => {
    const matchesSearch = (orcamento.cliente?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (orcamento.numero?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'todos' || orcamento.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'rejeitado': return 'Rejeitado';
      default: return status;
    }
  };

  const handleNovoOrcamento = () => {
    setSelectedOrcamento(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleVer = (orc: any) => {
    setSelectedOrcamento(orc);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditar = (orc: any) => {
    setSelectedOrcamento(orc);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) return;

    try {
      const { error } = await supabase
        .from('orcamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Orçamento excluído com sucesso!');
      fetchOrcamentos();
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      toast.error('Erro ao excluir orçamento.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamentos</h1>
                <p className="text-gray-600">Gerencie propostas e contratos</p>
              </div>
              <Button
                onClick={handleNovoOrcamento}
                className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20 px-6 h-12 rounded-xl font-bold gap-2"
              >
                <Plus className="w-5 h-5" />
                Novo Orçamento
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar orçamentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes</TabsTrigger>
              <TabsTrigger value="aprovado">Aprovados</TabsTrigger>
              <TabsTrigger value="rejeitado">Rejeitados</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrcamentos.map((orcamento) => (
              <Card key={orcamento.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{orcamento.numero}</span>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {orcamento.cliente}
                      </h3>
                    </div>
                    <Badge className={cn("shrink-0", getStatusColor(orcamento.status))}>
                      {getStatusText(orcamento.status)}
                    </Badge>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Valor Total</span>
                        <span className="text-xl font-black text-cyan-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(orcamento.valor) || 0)}
                        </span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="text-xs text-gray-500">Data</span>
                        <span className="text-sm font-medium text-gray-700">{orcamento.data}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-[10px] px-1 h-8"
                        onClick={() => handleVer(orcamento)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-[10px] px-1 h-8 text-blue-600 border-blue-100 hover:bg-blue-50"
                        onClick={() => handleEditar(orcamento)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-[10px] px-1 h-8 text-red-600 border-red-100 hover:bg-red-50"
                        onClick={() => handleExcluir(orcamento.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Excluir
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-[10px] px-1 h-8">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <NovoOrcamentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrcamentos}
        mode={modalMode}
        orcamento={selectedOrcamento}
      />
    </div>
  );
};

export default Orcamentos;