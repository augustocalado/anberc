"use client";

import React, { useState, useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, User, Calendar, AlertCircle, Loader2, X, Eye, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface NovoOSModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode?: 'create' | 'edit' | 'view';
    os?: any;
}

const NovoOSModal = ({ isOpen, onClose, onSuccess, mode = 'create', os }: NovoOSModalProps) => {
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState<any[]>([]);
    const [tecnicos, setTecnicos] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        numero: '',
        cliente_id: '',
        cliente_nome: '',
        descricao: '',
        prioridade: 'media',
        status: 'aguardando',
        tecnico_id: '',
        tecnico_nome: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
            if ((mode === 'edit' || mode === 'view') && os) {
                setFormData({
                    numero: os.numero || '',
                    cliente_id: os.cliente_id || '',
                    cliente_nome: os.cliente_nome || '',
                    descricao: os.descricao || '',
                    prioridade: os.prioridade || 'media',
                    status: os.status || 'aguardando',
                    tecnico_id: os.tecnico_id || '',
                    tecnico_nome: os.tecnico_nome || ''
                });
            } else {
                const generatedNumber = `OS-2024-${Math.floor(Math.random() * 900) + 100}`;
                setFormData({
                    numero: generatedNumber,
                    cliente_id: '',
                    cliente_nome: '',
                    descricao: '',
                    prioridade: 'media',
                    status: 'aguardando',
                    tecnico_id: '',
                    tecnico_nome: ''
                });
            }
        }
    }, [isOpen, mode, os]);

    const fetchInitialData = async () => {
        try {
            const [clientesRes, tecnicosRes] = await Promise.all([
                supabase.from('clientes').select('id, nome').eq('status', 'ativo'),
                supabase.from('profiles').select('id, name').eq('role', 'Técnico')
            ]);
            setClientes(clientesRes.data || []);
            setTecnicos(tecnicosRes.data || []);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        if (name === 'cliente_id') {
            const cliente = clientes.find(c => c.id === value);
            setFormData(prev => ({ ...prev, cliente_id: value, cliente_nome: cliente?.nome || '' }));
        } else if (name === 'tecnico_id') {
            const tecnico = tecnicos.find(t => t.id === value);
            setFormData(prev => ({ ...prev, tecnico_id: value, tecnico_nome: tecnico?.name || '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'edit' && os?.id) {
                const { error } = await supabase
                    .from('ordens_servico')
                    .update({
                        cliente_id: formData.cliente_id,
                        cliente_nome: formData.cliente_nome,
                        descricao: formData.descricao,
                        prioridade: formData.prioridade,
                        status: formData.status,
                        tecnico_id: formData.tecnico_id,
                        tecnico_nome: formData.tecnico_nome
                    })
                    .eq('id', os.id);

                if (error) throw error;
                toast.success("Ordem de Serviço atualizada com sucesso!");
            } else {
                const { error } = await supabase.from('ordens_servico').insert([{
                    numero: formData.numero,
                    cliente_id: formData.cliente_id,
                    cliente_nome: formData.cliente_nome,
                    descricao: formData.descricao,
                    prioridade: formData.prioridade,
                    status: formData.status,
                    tecnico_id: formData.tecnico_id,
                    tecnico_nome: formData.tecnico_nome
                }]);

                if (error) throw error;
                toast.success("Ordem de Serviço aberta com sucesso!");
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Erro ao processar OS:', err);
            toast.error("Erro ao salvar Ordem de Serviço.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl max-h-[90vh] h-full flex flex-col">
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
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <DialogTitle className="text-white flex items-center gap-3 text-2xl font-bold">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                                {mode === 'view' ? <Eye className="text-cyan-400 w-7 h-7" /> : <ClipboardList className="text-cyan-400 w-7 h-7" />}
                            </div>
                            {mode === 'edit' ? 'Editar' : mode === 'view' ? 'Visualizar' : 'Nova'} Ordem de Serviço
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/60 font-medium text-base">
                            {mode === 'view'
                                ? 'Detalhes da ordem de serviço aberta.'
                                : 'Preencha os dados abaixo para gerenciar o chamado técnico.'}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 min-h-0 w-full">
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Nº Identificador</Label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            readOnly
                                            value={formData.numero}
                                            className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 font-bold text-[#001F3F]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Data de Abertura</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            readOnly
                                            value={new Date().toLocaleDateString('pt-BR')}
                                            className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Cliente / Local</Label>
                                <Select
                                    disabled={mode === 'view'}
                                    value={formData.cliente_id}
                                    onValueChange={(v) => handleSelectChange('cliente_id', v)}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium">
                                        <SelectValue placeholder="Selecione o cliente" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {clientes.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Prioridade</Label>
                                    <Select
                                        disabled={mode === 'view'}
                                        value={formData.prioridade}
                                        onValueChange={(v) => handleSelectChange('prioridade', v)}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="baixa">Baixa</SelectItem>
                                            <SelectItem value="media">Média</SelectItem>
                                            <SelectItem value="alta">Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Status</Label>
                                    <Select
                                        disabled={mode === 'view'}
                                        value={formData.status}
                                        onValueChange={(v) => handleSelectChange('status', v)}
                                    >
                                        <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="aguardando">Aguardando</SelectItem>
                                            <SelectItem value="execucao">Em Execução</SelectItem>
                                            <SelectItem value="finalizado">Finalizado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Técnico Responsável</Label>
                                <Select
                                    disabled={mode === 'view'}
                                    value={formData.tecnico_id}
                                    onValueChange={(v) => handleSelectChange('tecnico_id', v)}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium">
                                        <SelectValue placeholder="Selecione o técnico" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {tecnicos.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Descrição do Problema / Serviço</Label>
                                <Textarea
                                    readOnly={mode === 'view'}
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    placeholder="Descreva o que deve ser feito..."
                                    className="min-h-[120px] rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all p-4 font-medium resize-none shadow-inner"
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                {mode !== 'view' ? (
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-cyan-600/20 gap-3 group transition-all"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (mode === 'edit' ? 'Salvar Alterações' : 'Confirmar e Abrir OS')}
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

export default NovoOSModal;
