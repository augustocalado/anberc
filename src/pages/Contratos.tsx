import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Printer, Save, PenTool } from 'lucide-react';
import { toast } from "sonner";

const templates = {
    cftv: {
        title: "Contrato de Instalação de CFTV",
        content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE INSTALAÇÃO DE CFTV

CONTRATADA: ANBERC SOLUÇÕES INTEGRADAS
CONTRATANTE: [NOME DO CLIENTE]

OBJETO: O presente contrato tem por objeto a prestação de serviços de instalação, configuração e teste de sistema de Circuito Fechado de TV (CFTV).

CLÁUSULA PRIMEIRA - DOS EQUIPAMENTOS
A CONTRATADA instalará os seguintes equipamentos: [LISTAR EQUIPAMENTOS].

CLÁUSULA SEGUNDA - DOS PRAZOS
O serviço será iniciado em [DATA] e finalizado em até [PRAZO] dias úteis.

CLÁUSULA TERCEIRA - DOS VALORES
Pelo serviço, o CONTRANTE pagará o valor de R$ [VALOR], conforme as seguintes condições: [CONDIÇÕES].

CLÁUSULA QUARTA - DA GARANTIA
A CONTRATADA oferece garantia de 12 meses para os equipamentos e 90 dias para a instalação.

[CIDADE], [DIA] de [MÊS] de [ANO].`
    },
    alarme: {
        title: "Contrato de Alarme e Monitoramento",
        content: `CONTRATO DE MONITORAMENTO E INSTALAÇÃO DE SISTEMA DE ALARME

CONTRATADA: ANBERC SOLUÇÕES INTEGRADAS
CONTRATANTE: [NOME DO CLIENTE]

OBJETO: Prestação de serviços de instalação de sistema de alarme e monitoramento 24 horas.

CLÁUSULA PRIMEIRA - DO MONITORAMENTO
O monitoramento será realizado via central da CONTRATADA, com aviso imediato aos contatos autorizados em caso de disparo.

CLÁUSULA SEGUNDA - DA MENSALIDADE
O CONTRATANTE pagará o valor mensal de R$ [VALOR] referente ao serviço de monitoramento.

CLÁUSULA TERCEIRA - DA MANUTENÇÃO
A manutenção corretiva será realizada mediante chamado ou detecção de falha via sistema.

[CIDADE], [DIA] de [MÊS] de [ANO].`
    },
    eletrica: {
        title: "Contrato de Prestação de Serviços Elétricos",
        content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ELÉTRICOS

CONTRATADA: ANBERC SOLUÇÕES INTEGRADAS
CONTRATANTE: [NOME DO CLIENTE]

OBJETO: Realização de serviços de infraestrutura e instalações elétricas conforme projeto anexo.

CLÁUSULA PRIMEIRA - DAS OBRIGAÇÕES
A CONTRATADA fornecerá mão de obra qualificada e EPIs necessários para a execução segura do serviço.

CLÁUSULA SEGUNDA - MATERIAIS
O fornecimento de materiais é de responsabilidade da [CONTRATANTE/CONTRATADA].

CLÁUSULA TERCEIRA - PAGAMENTO
O valor total do serviço é de R$ [VALOR].

[CIDADE], [DIA] de [MÊS] de [ANO].`
    },
    manutencao: {
        title: "Contrato de Manutenção Preventiva (Ar Condicionado)",
        content: `CONTRATO DE MANUTENÇÃO PREVENTIVA E CORRETIVA DE AR CONDICIONADO

CONTRATADA: ANBERC SOLUÇÕES INTEGRADAS
CONTRATANTE: [NOME DO CLIENTE]

OBJETO: Manutenção periódica de sistemas de climatização.

CLÁUSULA PRIMEIRA - DA PERIODICIDADE
As visitas preventivas ocorrerão [MENSALMENTE/TRIMESTRALMENTE] para limpeza de filtros e check-up geral.

CLÁUSULA SEGUNDA - DA LIMPEZA
A limpeza profunda das serpentinas será realizada a cada 6 meses.

CLÁUSULA TERCEIRA - ATENDIMENTO EMERGENCIAL
Em caso de falha, o prazo de atendimento é de até 24 horas úteis.

[CIDADE], [DIA] de [MÊS] de [ANO].`
    }
};

const Contratos = () => {
    const [activeTab, setActiveTab] = useState('cftv');
    const [contractContent, setContractContent] = useState(templates.cftv.content);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setContractContent(templates[value as keyof typeof templates].content);
    };

    const handleSave = () => {
        toast.success("Contrato salvo com sucesso!");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contratos</h1>
                            <p className="text-gray-600">Gerencie e emita contratos para seus clientes</p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" /> Imprimir
                            </Button>
                            <Button className="bg-[#38BDF8] hover:bg-[#0EA5E9]" onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" /> Salvar Contrato
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="cftv" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                        <TabsList className="bg-white border border-gray-200 p-1">
                            <TabsTrigger value="cftv">CFTV</TabsTrigger>
                            <TabsTrigger value="alarme">Alarme</TabsTrigger>
                            <TabsTrigger value="eletrica">Elétrica</TabsTrigger>
                            <TabsTrigger value="manutencao">Manutenção Ar</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm print:shadow-none print:border-none">
                                    <CardHeader className="border-b border-gray-100 mb-4">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <FileText className="text-cyan-600" />
                                            {templates[activeTab as keyof typeof templates].title}
                                        </CardTitle>
                                        <CardDescription>Edite as informações do contrato abaixo</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={contractContent}
                                            onChange={(e) => setContractContent(e.target.value)}
                                            className="min-h-[500px] font-serif text-lg leading-relaxed border-gray-200 focus:border-cyan-500 p-8"
                                        />

                                        <div className="mt-12 grid grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                                            <div className="text-center">
                                                <div className="border-b border-gray-400 mb-2 py-4"></div>
                                                <p className="font-bold text-gray-900">ANBERC SOLUÇÕES INTEGRADAS</p>
                                                <p className="text-sm text-gray-500">CONTRATADA</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-gray-400 mb-2 py-4"></div>
                                                <p className="font-bold text-gray-900">CLIENTE</p>
                                                <p className="text-sm text-gray-500">CONTRATANTE</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6 print:hidden">
                                    <Card className="bg-[#001F3F] text-white border-none shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <PenTool className="text-[#38BDF8]" />
                                                Assinatura Digital
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-300 mb-6">
                                                Envie este contrato para o cliente assinar digitalmente de forma rápida e segura.
                                            </p>
                                            <Button className="w-full bg-[#38BDF8] text-white hover:bg-[#0EA5E9]" onClick={() => toast.info("Link de assinatura enviado!")}>
                                                Enviar para Assinatura
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white border-gray-200 shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Dicas de Preenchimento</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-gray-600 space-y-4">
                                            <p>• Certifique-se de listar todos os equipamentos detalhadamente.</p>
                                            <p>• Especifique claramente as datas de início e entrega.</p>
                                            <p>• Defina as condições de pagamento e parcelamento.</p>
                                            <p>• Revise as cláusulas de garantia do fabricante.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default Contratos;
