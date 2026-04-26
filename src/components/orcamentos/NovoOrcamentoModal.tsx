"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText, User, DollarSign, Calendar, Loader2, X, Plus, Trash2, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NovoOrcamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode?: 'create' | 'edit' | 'view';
    orcamento?: any;
}

const NovoOrcamentoModal = ({ isOpen, onClose, onSuccess, mode = 'create', orcamento }: NovoOrcamentoModalProps) => {
    const [availableItems, setAvailableItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [extraExpenses, setExtraExpenses] = useState<string>('0');
    const [formData, setFormData] = useState({
        cliente: '',
        data: new Date().toISOString().split('T')[0],
        descricao: ''
    });

    const fetchClientes = async () => {
        try {
            const { data, error } = await supabase
                .from('clientes')
                .select('*')
                .order('nome', { ascending: true });

            if (error) throw error;
            setClientes(data || []);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            fetchClientes();
            fetchAvailableItems();

            if ((mode === 'edit' || mode === 'view') && orcamento) {
                setFormData({
                    cliente: orcamento.cliente || '',
                    data: orcamento.data || new Date().toISOString().split('T')[0],
                    descricao: orcamento.descricao || ''
                });
                setSelectedItems(orcamento.itens || []);
                setExtraExpenses(orcamento.valor_extra?.toString() || '0');
            } else {
                setFormData({
                    cliente: '',
                    data: new Date().toISOString().split('T')[0],
                    descricao: ''
                });
                setSelectedItems([]);
                setExtraExpenses('0');
            }
        }
    }, [isOpen, mode, orcamento]);

    const fetchAvailableItems = async () => {
        try {
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .order('nome', { ascending: true });

            if (error) throw error;
            setAvailableItems(data || []);
        } catch (err) {
            console.error('Erro ao buscar itens:', err);
        }
    };

    const addItem = (item: any) => {
        const newItem = {
            id: item.id,
            nome: item.nome,
            tipo: item.tipo,
            preco_base: item.preco || 0,
            margem: item.tipo === 'produto' ? 30 : 0, // Default 30% margin for products
            quantidade: 1,
            total: item.tipo === 'produto'
                ? (item.preco || 0) * 1.3
                : (item.preco || 0)
        };
        setSelectedItems([...selectedItems, newItem]);
    };

    const removeItem = (index: number) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...selectedItems];
        const item = { ...newItems[index] };

        if (field === 'margem' || field === 'preco_base' || field === 'quantidade') {
            const val = parseFloat(value) || 0;
            item[field] = val;

            if (item.tipo === 'produto') {
                const priceWithMargin = item.preco_base * (1 + (item.margem / 100));
                item.total = priceWithMargin * item.quantidade;
            } else {
                item.total = item.preco_base * item.quantidade;
            }
        }

        newItems[index] = item;
        setSelectedItems(newItems);
    };

    const subtotalProdutos = selectedItems
        .filter(i => i.tipo === 'produto')
        .reduce((sum, i) => sum + i.total, 0);

    const subtotalServicos = selectedItems
        .filter(i => i.tipo === 'servico')
        .reduce((sum, i) => sum + i.total, 0);

    const totalOrcamento = subtotalProdutos + subtotalServicos + (parseFloat(extraExpenses) || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'edit' && orcamento?.id) {
                const { error } = await supabase
                    .from('orcamentos')
                    .update({
                        cliente: formData.cliente,
                        data: formData.data,
                        valor: totalOrcamento,
                        descricao: formData.descricao,
                        itens: selectedItems,
                        valor_extra: parseFloat(extraExpenses) || 0
                    })
                    .eq('id', orcamento.id);

                if (error) throw error;
                toast.success(`Orçamento atualizado com sucesso!`);
            } else {
                const orcNumber = `ORC-${Math.floor(1000 + Math.random() * 9000)}`;

                const { error } = await supabase.from('orcamentos').insert([{
                    numero: orcNumber,
                    cliente: formData.cliente,
                    data: formData.data,
                    valor: totalOrcamento,
                    descricao: formData.descricao,
                    itens: selectedItems,
                    status: 'pendente',
                    valor_extra: parseFloat(extraExpenses) || 0
                }]);

                if (error) throw error;
                toast.success(`Orçamento ${orcNumber} para ${formData.cliente} gerado com sucesso!`);
            }
            setLoading(false);
            onClose();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            console.error('Erro ao salvar orçamento:', err);
            toast.error("Erro ao salvar orçamento. Verifique se a tabela 'orcamentos' foi criada.");
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl max-h-[90vh] h-full flex flex-col">
                <div className="relative flex flex-col h-full overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-6 top-6 z-20 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    <DialogHeader className="bg-[#001F3F] p-8 md:p-10 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <DialogTitle className="text-white flex items-center gap-3 text-2xl font-bold">
                            <div className="w-12 h-12 bg-[#38BDF8]/20 rounded-2xl flex items-center justify-center">
                                <FileText className="text-[#38BDF8] w-7 h-7" />
                            </div>
                            Novo Orçamento {mode === 'edit' ? '(Editando)' : mode === 'view' ? '(Visualizando)' : ''}
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/60 font-medium text-base">
                            {mode === 'view'
                                ? 'Detalhes da proposta técnica comercial.'
                                : 'Elabore uma nova proposta técnica comercial para seu cliente.'}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 min-h-0 w-full">
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Cliente / Prospect</Label>
                                    <Select
                                        disabled={mode === 'view'}
                                        value={formData.cliente}
                                        onValueChange={(val) => setFormData({ ...formData, cliente: val })}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium">
                                            <div className="flex items-center gap-3">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <SelectValue placeholder="Selecione o cliente" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-100 rounded-xl">
                                            {clientes.length > 0 ? (
                                                clientes.map((cli) => (
                                                    <SelectItem key={cli.id} value={cli.nome} className="font-medium focus:bg-cyan-50">
                                                        {cli.nome}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                    Nenhum cliente cadastrado
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Data da Proposta</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                readOnly={mode === 'view'}
                                                type="date"
                                                name="data"
                                                value={formData.data}
                                                onChange={handleChange}
                                                className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className={cn("space-y-2", mode === 'view' && "opacity-50 pointer-events-none")}>
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Adicionar Item (Produto/Serviço)</Label>
                                        <Select
                                            disabled={mode === 'view'}
                                            onValueChange={(val) => {
                                                const item = availableItems.find(i => i.id === val);
                                                if (item) addItem(item);
                                            }}
                                        >
                                            <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Plus className="w-4 h-4 text-cyan-500" />
                                                    <SelectValue placeholder="Escolha um item do catálogo" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {availableItems.map(item => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.nome} ({item.tipo === 'produto' ? 'Prod' : 'Serv'})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Tabela de Itens Selecionados */}
                                {selectedItems.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-600 block mb-2">Itens Inclusos</Label>
                                        <div className="space-y-3">
                                            {selectedItems.map((item, index) => (
                                                <div key={index} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                                item.tipo === 'produto' ? "bg-cyan-100 text-cyan-600" : "bg-purple-100 text-purple-600"
                                                            )}>
                                                                {item.tipo === 'produto' ? <Package className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                                            </div>
                                                            <span className="font-bold text-gray-900">{item.nome}</span>
                                                        </div>
                                                        {mode !== 'view' && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeItem(index)}
                                                                className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-3">
                                                        <div className="space-y-1">
                                                            <span className="text-[9px] uppercase font-bold text-gray-400 block px-1">Preço Uni.</span>
                                                            <Input
                                                                readOnly={mode === 'view'}
                                                                type="number"
                                                                value={item.preco_base}
                                                                onChange={(e) => updateItem(index, 'preco_base', e.target.value)}
                                                                className="h-9 rounded-xl border-gray-200 bg-white"
                                                            />
                                                        </div>
                                                        {item.tipo === 'produto' ? (
                                                            <div className="space-y-1">
                                                                <span className="text-[9px] uppercase font-bold text-gray-400 block px-1">Margem (%)</span>
                                                                <Input
                                                                    readOnly={mode === 'view'}
                                                                    type="number"
                                                                    value={item.margem}
                                                                    onChange={(e) => updateItem(index, 'margem', e.target.value)}
                                                                    className="h-9 rounded-xl border-gray-200 bg-white"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-1 opacity-50">
                                                                <span className="text-[9px] uppercase font-bold text-gray-400 block px-1">Margem</span>
                                                                <Input disabled value="-" className="h-9 rounded-xl border-gray-200 bg-gray-50" />
                                                            </div>
                                                        )}
                                                        <div className="space-y-1">
                                                            <span className="text-[9px] uppercase font-bold text-gray-400 block px-1">Qtd</span>
                                                            <Input
                                                                readOnly={mode === 'view'}
                                                                type="number"
                                                                value={item.quantidade}
                                                                onChange={(e) => updateItem(index, 'quantidade', e.target.value)}
                                                                className="h-9 rounded-xl border-gray-200 bg-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-[9px] uppercase font-bold text-gray-400 block px-1">Total Item</span>
                                                            <div className="h-9 flex items-center px-3 rounded-xl bg-cyan-50 text-cyan-700 font-bold text-sm">
                                                                R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Gastos Extras (R$)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                readOnly={mode === 'view'}
                                                value={extraExpenses}
                                                onChange={(e) => setExtraExpenses(e.target.value)}
                                                placeholder="Ex: Combustível"
                                                className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 bg-[#001F3F]/5 rounded-[2rem] p-6 flex flex-col justify-center items-end border border-[#001F3F]/10">
                                        <div className="flex flex-col gap-1 w-full max-w-[250px]">
                                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <span>Prod/Serv:</span>
                                                <span>R$ {(subtotalProdutos + subtotalServicos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <span>Gastos Extras:</span>
                                                <span>R$ {(parseFloat(extraExpenses) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="h-px bg-[#001F3F]/10 my-2" />
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black uppercase text-[#001F3F] mb-1">Total Geral:</span>
                                                <span className="text-3xl font-black text-cyan-600 tracking-tighter">
                                                    R$ {totalOrcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Escopo do Serviço / Observações</Label>
                                    <Textarea
                                        readOnly={mode === 'view'}
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        placeholder="Descreva detalhadamente o que está incluso no orçamento..."
                                        className="min-h-[120px] rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all p-4 font-medium resize-none shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                {mode !== 'view' ? (
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-cyan-600/20 gap-3 group transition-all"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (mode === 'edit' ? 'Salvar Alterações' : 'Gerar Orçamento')}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-cyan-600/20 gap-3 group transition-all"
                                    >
                                        Fechar Visualização
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="px-8 h-16 rounded-2xl font-bold text-gray-400 hover:bg-gray-50"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NovoOrcamentoModal;
