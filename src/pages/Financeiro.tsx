"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Filter, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const Financeiro = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('receitas');

  const transacoes = [
    {
      id: 1,
      tipo: 'receita',
      descricao: 'Pagamento OS-2024-001',
      cliente: 'Empresa ABC Ltda',
      valor: 'R$ 12.500',
      data: '15/01/2024',
      status: 'recebido',
    },
    {
      id: 2,
      tipo: 'despesa',
      descricao: 'Compra de materiais',
      fornecedor: 'Fornecedor XYZ',
      valor: 'R$ 2.800',
      data: '18/01/2024',
      status: 'pago',
    },
    {
      id: 3,
      tipo: 'receita',
      descricao: 'Pagamento OS-2024-002',
      cliente: 'Cliente XYZ',
      valor: 'R$ 8.900',
      data: '22/01/2024',
      status: 'pendente',
    },
  ];

  const filteredTransacoes = transacoes.filter(transacao => {
    const matchesSearch = transacao.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (transacao.cliente && transacao.cliente.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (transacao.fornecedor && transacao.fornecedor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'todos' || transacao.tipo === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recebido': return 'bg-green-100 text-green-800';
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recebido': return 'Recebido';
      case 'pago': return 'Pago';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'receita' ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Financeiro</h1>
                <p className="text-gray-600">Controle financeiro e fluxo de caixa</p>
              </div>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+15.2%</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Receitas</h3>
                <p className="text-2xl font-bold text-gray-900">R$ 124.500</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm text-red-600 font-medium">+8.7%</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Despesas</h3>
                <p className="text-2xl font-bold text-gray-900">R$ 45.200</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Saldo</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Lucro Líquido</h3>
                <p className="text-2xl font-bold text-gray-900">R$ 79.300</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar transações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="receitas">Receitas</TabsTrigger>
              <TabsTrigger value="despesas">Despesas</TabsTrigger>
              <TabsTrigger value="todos">Todos</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente/Fornecedor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransacoes.map((transacao) => (
                      <tr key={transacao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transacao.data}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(transacao.tipo)}
                            <span className="text-sm font-medium text-gray-900">
                              {transacao.descricao}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transacao.cliente || transacao.fornecedor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={cn(
                            transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                          )}>
                            {transacao.valor}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(transacao.status)}>
                            {getStatusText(transacao.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
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
        </main>
      </div>
    </div>
  );
};

export default Financeiro;