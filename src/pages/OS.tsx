"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Calendar, User, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import NovoOSModal from '@/components/os/NovoOSModal';

const OS = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedOS, setSelectedOS] = useState<any>(null);
  const [ordens, setOrdens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOS();
  }, []);

  const fetchOS = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdens(data || []);
    } catch (err) {
      console.error('Erro ao buscar OS:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoOS = () => {
    setSelectedOS(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleVer = (os: any) => {
    setSelectedOS(os);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditar = (os: any) => {
    setSelectedOS(os);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta Ordem de Serviço?')) return;

    try {
      const { error } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('OS excluída com sucesso!');
      fetchOS();
    } catch (err) {
      console.error('Erro ao excluir:', err);
      toast.error('Erro ao excluir a OS.');
    }
  };

  const filteredOrdens = ordens.filter(os =>
    os.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    os.cliente_nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { id: 'aguardando', title: 'Aguardando', color: 'bg-gray-100', textColor: 'text-gray-700' },
    { id: 'execucao', title: 'Em Execução', color: 'bg-blue-100', textColor: 'text-blue-700' },
    { id: 'finalizado', title: 'Finalizado', color: 'bg-green-100', textColor: 'text-green-700' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ordens de Serviço</h1>
                <p className="text-gray-600">Gerencie as tarefas da sua equipe</p>
              </div>
              <Button
                onClick={handleNovoOS}
                className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20 px-6 h-12 rounded-xl font-bold gap-2"
              >
                <Plus className="w-5 h-5" />
                Abrir Chamado
              </Button>
            </div>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar ordens de serviço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map((column) => (
              <Card key={column.id} className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-3 text-center border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className={cn("text-sm font-semibold", column.textColor)}>
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className={column.color}>
                      {filteredOrdens.filter(os => os.status === column.id).length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {filteredOrdens.filter(os => os.status === column.id).map((os) => (
                    <Card key={os.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-[#001F3F] text-lg leading-none">
                              {os.numero}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">
                              {os.cliente_nome}
                            </p>
                          </div>
                          <Badge className={cn("uppercase text-[10px] font-bold px-2 py-0.5", getPriorityColor(os.prioridade))}>
                            {os.prioridade}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 bg-gray-50 p-2 rounded-lg">
                          {os.descricao || 'Sem descrição.'}
                        </p>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium font-mono">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(os.data_abertura).toLocaleDateString()}
                          </div>
                          {os.tecnico_nome && (
                            <div className="flex items-center gap-1.5 text-xs text-cyan-600 font-bold bg-cyan-50 px-2 py-1 rounded-full border border-cyan-100">
                              <User className="w-3 h-3" />
                              <span>{os.tecnico_nome.split(' ')[0]}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="ghost" size="sm" className="flex-1 h-10 rounded-lg hover:bg-gray-100 text-gray-400" onClick={() => handleVer(os)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1 h-10 rounded-lg hover:bg-gray-100 text-gray-400" onClick={() => handleEditar(os)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1 h-10 rounded-lg hover:text-red-600 hover:bg-red-50 text-gray-400" onClick={() => handleExcluir(os.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredOrdens.filter(os => os.status === column.id).length === 0 && (
                    <div className="py-8 text-center text-gray-400 text-sm italic">
                      Vazio
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <NovoOSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOS}
        mode={modalMode}
        os={selectedOS}
      />
    </div>
  );
};

export default OS;