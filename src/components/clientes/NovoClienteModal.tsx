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
import { Save, User, Building, Phone, Mail, MapPin, Hash, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface NovoClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const NovoClienteModal = ({ isOpen, onClose, onSuccess }: NovoClienteModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        documento: '', // CPF ou CNPJ
        endereco: '',
        numero: '',
        complemento: '',
        cidade: 'São José dos Campos',
        estado: 'SP',
        observacoes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('clientes').insert([formData]);

            if (error) {
                if (error.code === '42P01') {
                    throw new Error("Tabela 'clientes' não encontrada no banco de dados.");
                }
                throw error;
            }

            toast.success("Cliente cadastrado com sucesso!");
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                documento: '',
                endereco: '',
                numero: '',
                complemento: '',
                cidade: 'São José dos Campos',
                estado: 'SP',
                observacoes: ''
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erro ao cadastrar cliente:', err);
            toast.error(err.message || "Erro ao cadastrar cliente. Tente novamente.");
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
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-6 top-6 z-10 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    <DialogHeader className="bg-[#001F3F] p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <DialogTitle className="text-white flex items-center gap-3 text-2xl font-bold">
                            <div className="w-12 h-12 bg-[#38BDF8]/20 rounded-2xl flex items-center justify-center">
                                <User className="text-[#38BDF8] w-7 h-7" />
                            </div>
                            Novo Cliente
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/60 font-medium text-base">
                            Cadastre um novo cliente no sistema para gerenciar orçamentos e serviços.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Seção Dados Principais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Nome Completo / Razão Social</Label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        required
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Ex: Anberc Soluções"
                                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">CNPJ ou CPF</Label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        required
                                        name="documento"
                                        value={formData.documento}
                                        onChange={handleChange}
                                        placeholder="00.000.000/0000-00"
                                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Seção Contato */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contato@empresa.com"
                                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">WhatsApp</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        required
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="(12) 99999-9999"
                                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Endereço, Número e Complemento */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Logradouro (Rua/Av)</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        name="endereco"
                                        value={formData.endereco}
                                        onChange={handleChange}
                                        placeholder="Rua..."
                                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Número</Label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        name="numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        placeholder="123"
                                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Complemento</Label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        name="complemento"
                                        value={formData.complemento}
                                        onChange={handleChange}
                                        placeholder="Apto/Bloco"
                                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#778899] ml-1">Observações Técnicas</Label>
                            <Textarea
                                name="observacoes"
                                value={formData.observacoes}
                                onChange={handleChange}
                                placeholder="Notas internas ou detalhes do serviço..."
                                className="min-h-[100px] rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all p-4 font-medium resize-none shadow-inner"
                            />
                        </div>

                        <div className="pt-6 flex gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-cyan-600/20 gap-3 group transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-6 h-6" />
                                ) : (
                                    <>
                                        Salvar Cliente
                                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </Button>
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NovoClienteModal;
