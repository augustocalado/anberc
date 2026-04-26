"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Edit2, Trash2, Shield, User, Hammer, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Usuarios = () => {
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Técnico'
    });

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setProfiles(data || []);
        } catch (err: any) {
            console.error('Erro ao buscar perfis:', err);
            toast.error('Erro ao carregar lista de usuários.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingUser) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        role: formData.role,
                    })
                    .eq('id', editingUser.id);

                if (error) throw error;
                toast.success('Usuário atualizado com sucesso!');
            } else {
                const { error } = await supabase.from('profiles').insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                }]);

                if (error) throw error;
                toast.success(`Perfil de ${formData.role} criado com sucesso!`);
            }

            setFormData({ name: '', email: '', phone: '', role: 'Técnico' });
            setEditingUser(null);
            fetchProfiles();
        } catch (err: any) {
            console.error('Erro ao salvar usuário:', err);
            toast.error('Erro ao processar solicitação.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'Técnico'
        });
        // Scroll to form on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Usuário removido com sucesso!');
            fetchProfiles();
        } catch (err: any) {
            console.error('Erro ao deletar:', err);
            toast.error('Erro ao remover usuário.');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'Admin Master':
                return <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 uppercase font-bold text-[10px] tracking-widest"><Shield size={12} className="mr-1" /> Admin</Badge>;
            case 'Técnico':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 uppercase font-bold text-[10px] tracking-widest"><Hammer size={12} className="mr-1" /> Técnico</Badge>;
            case 'Cliente':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 uppercase font-bold text-[10px] tracking-widest"><User size={12} className="mr-1" /> Cliente</Badge>;
            default:
                return <Badge variant="outline" className="uppercase font-bold text-[10px] tracking-widest">{role}</Badge>;
        }
    };

    const filteredProfiles = profiles.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Usuários</h1>
                        <p className="text-gray-600">Gerencie o acesso de administradores, técnicos e clientes</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* List Section */}
                        <Card className="lg:col-span-8 bg-white border-none shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
                            <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-[#001F3F] text-lg">
                                    <Users className="w-5 h-5 text-cyan-500" />
                                    Usuários Ativos
                                </CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar usuários..."
                                        className="pl-10 h-10 bg-white border-gray-200 rounded-xl text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-[10px] text-gray-400 uppercase font-black tracking-widest bg-gray-50/30 border-b">
                                            <tr>
                                                <th className="px-6 py-4">Usuário</th>
                                                <th className="px-6 py-4">Acesso</th>
                                                <th className="px-6 py-4 text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                                        <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2 opacity-20" />
                                                        Carregando usuários...
                                                    </td>
                                                </tr>
                                            ) : filteredProfiles.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                                        Nenhum usuário encontrado
                                                    </td>
                                                </tr>
                                            ) : filteredProfiles.map((p) => (
                                                <tr key={p.id} className="hover:bg-cyan-50/30 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center font-bold text-gray-400 border border-gray-200">
                                                                {p.photo_url ? (
                                                                    <img src={p.photo_url} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    p.name?.substring(0, 2).toUpperCase() || '??'
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-[#001F3F] block">{p.name || 'Sem nome'}</span>
                                                                <span className="text-xs text-gray-500">{p.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {getRoleBadge(p.role)}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEdit(p)}
                                                                className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md"
                                                            >
                                                                <Edit2 size={16} className="text-gray-400 group-hover:text-cyan-600" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(p.id)}
                                                                className="h-9 w-9 p-0 rounded-xl hover:bg-red-50"
                                                            >
                                                                <Trash2 size={16} className="text-red-300 group-hover:text-red-500" />
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

                        {/* Form Section */}
                        <Card className="lg:col-span-4 bg-[#001F3F] border-none shadow-2xl rounded-[2rem] text-white self-start sticky top-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Plus className="text-cyan-400 w-6 h-6" />
                                </div>
                                <CardTitle className="text-2xl font-bold uppercase tracking-tight">Novo Cadastro</CardTitle>
                                <p className="text-white/40 text-sm font-medium">Cadastre novos membros da equipe ou clientes.</p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSaveUser} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 ml-1">Nome Completo</Label>
                                        <Input
                                            required
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-cyan-500 text-white placeholder:text-white/20"
                                            placeholder="Ex: Carlos Vieira"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 ml-1">E-mail de Acesso</Label>
                                        <Input
                                            required
                                            type="email"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-cyan-500 text-white placeholder:text-white/20"
                                            placeholder="email@empresa.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 ml-1">Telefone</Label>
                                            <Input
                                                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-cyan-500 text-white placeholder:text-white/20"
                                                placeholder="(12) 99999-9999"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 ml-1">Nível de Acesso (Role)</Label>
                                        <select
                                            className="flex h-12 w-full rounded-xl border border-white/10 bg-[#001F3F] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 text-white font-medium"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="Admin Master">Admin Master</option>
                                            <option value="Técnico">Técnico Operacional</option>
                                            <option value="Cliente">Cliente / Visitante</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-[#001F3F] font-black h-14 rounded-xl shadow-xl shadow-cyan-500/10 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : (editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário')}
                                        </Button>

                                        {editingUser && (
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setEditingUser(null);
                                                    setFormData({ name: '', email: '', phone: '', role: 'Técnico' });
                                                }}
                                                className="bg-white/10 hover:bg-white/20 text-white font-bold h-14 px-4 rounded-xl"
                                            >
                                                Cancelar
                                            </Button>
                                        )}
                                    </div>
                                </form>
                                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[10px] text-white/40 text-center font-medium italic leading-relaxed">
                                        Nota: O usuário pré-cadastrado deverá criar uma conta com este mesmo e-mail para validar seu acesso.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Usuarios;
