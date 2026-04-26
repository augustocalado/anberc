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
import { Save, Package, Tag, DollarSign, Layers, Loader2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye } from 'lucide-react';

interface NovoProdutoModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'produto' | 'servico';
    onSuccess?: () => void;
    mode?: 'create' | 'edit' | 'view';
    item?: any;
}

const NovoProdutoModal = ({ isOpen, onClose, type, onSuccess, mode = 'create', item }: NovoProdutoModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        categoria: '',
        preco: '',
        estoque: type === 'produto' ? '0' : undefined,
        descricao: ''
    });

    React.useEffect(() => {
        if (isOpen) {
            if ((mode === 'edit' || mode === 'view') && item) {
                setFormData({
                    nome: item.nome || '',
                    categoria: item.categoria || '',
                    preco: item.preco?.toString() || '',
                    estoque: type === 'produto' ? (item.estoque?.toString() || '0') : undefined,
                    descricao: item.descricao || ''
                });
            } else {
                setFormData({
                    nome: '',
                    categoria: '',
                    preco: '',
                    estoque: type === 'produto' ? '0' : undefined,
                    descricao: ''
                });
            }
        }
    }, [isOpen, mode, item, type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'edit' && item?.id) {
                const { error } = await supabase
                    .from('produtos')
                    .update({
                        nome: formData.nome,
                        categoria: formData.categoria,
                        preco: parseFloat(formData.preco.replace(',', '.')),
                        estoque: type === 'produto' ? parseInt(formData.estoque || '0') : 0,
                        descricao: formData.descricao
                    })
                    .eq('id', item.id);

                if (error) throw error;
                toast.success(`${type === 'produto' ? 'Produto' : 'Serviço'} atualizado com sucesso!`);
            } else {
                const { error } = await supabase.from('produtos').insert([{
                    nome: formData.nome,
                    tipo: type,
                    categoria: formData.categoria,
                    preco: parseFloat(formData.preco.replace(',', '.')),
                    estoque: type === 'produto' ? parseInt(formData.estoque || '0') : 0,
                    descricao: formData.descricao
                }]);

                if (error) throw error;
                toast.success(`${type === 'produto' ? 'Produto' : 'Serviço'} cadastrado com sucesso!`);
            }
            setFormData({
                nome: '',
                categoria: '',
                preco: '',
                estoque: type === 'produto' ? '0' : undefined,
                descricao: ''
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erro ao cadastrar:', err);
            toast.error("Erro ao cadastrar. Verifique se a tabela 'produtos' já foi criada.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl max-h-[90vh] h-full flex flex-col">
                <div className="relative flex flex-col h-full overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-6 top-6 z-20 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>


                    <DialogHeader className="bg-[#001F3F] p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <DialogTitle className="text-white flex items-center gap-3 text-2xl font-bold">
                            <div className="w-12 h-12 bg-[#38BDF8]/20 rounded-2xl flex items-center justify-center">
                                {mode === 'view' ? <Eye className="text-[#38BDF8] w-7 h-7" /> : <Package className="text-[#38BDF8] w-7 h-7" />}
                            </div>
                            {mode === 'edit' ? 'Editar' : mode === 'view' ? 'Visualizar' : 'Novo'} {type === 'produto' ? 'Produto' : 'Serviço'}
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/60 font-medium text-base">
                            {mode === 'view'
                                ? 'Detalhes do item cadastrado no sistema.'
                                : type === 'produto'
                                    ? 'Adicione um novo item ao seu estoque de segurança e tecnologia.'
                                    : 'Cadastre um novo serviço de instalação ou manutenção.'}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 min-h-0 w-full">
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Nome do Item</Label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            readOnly={mode === 'view'}
                                            required
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            placeholder={`Ex: ${type === 'produto' ? 'Câmera IP 4K' : 'Instalação de Central'}`}
                                            className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Categoria</Label>
                                        <Select
                                            disabled={mode === 'view'}
                                            value={formData.categoria}
                                            onValueChange={(v) => setFormData(p => ({ ...p, categoria: v }))}
                                        >
                                            <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium">
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="Segurança">Segurança</SelectItem>
                                                <SelectItem value="Elétrica">Elétrica</SelectItem>
                                                <SelectItem value="Climatização">Climatização</SelectItem>
                                                <SelectItem value="Outros">Outros</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Preço Base (R$)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                readOnly={mode === 'view'}
                                                required
                                                name="preco"
                                                value={formData.preco}
                                                onChange={handleChange}
                                                placeholder="0,00"
                                                className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {type === 'produto' && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Estoque Inicial</Label>
                                        <div className="relative">
                                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                readOnly={mode === 'view'}
                                                type="number"
                                                name="estoque"
                                                value={formData.estoque}
                                                onChange={handleChange}
                                                placeholder="Qtde"
                                                className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Breve Descrição</Label>
                                    <Textarea
                                        readOnly={mode === 'view'}
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        placeholder="Características técnicas..."
                                        className="min-h-[80px] rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all p-4 font-medium resize-none shadow-inner"
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
                                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (mode === 'edit' ? 'Salvar Alterações' : `Salvar ${type === 'produto' ? 'Produto' : 'Serviço'}`)}
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

export default NovoProdutoModal;
