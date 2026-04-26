"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, User, Phone, MapPin, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import RelatorioVisitaModal from '@/components/visitas/RelatorioVisitaModal';

const Agendamento = () => {
    const { profile } = useSession();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedAptForReport, setSelectedAptForReport] = useState<any>(null);

    const [newAppointment, setNewAppointment] = useState({
        client_name: '',
        service_type: '',
        technician_id: '',
        scheduled_date: '',
        time: ''
    });

    React.useEffect(() => {
        fetchAppointments();
        fetchTechnicians();
        fetchClientes();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    profiles:technician_id (name)
                `)
                .order('scheduled_date', { ascending: true });

            if (error) throw error;
            setAppointments(data || []);
        } catch (err: any) {
            console.error('Erro ao buscar agendamentos:', err);
            toast.error('Erro ao carregar agendamentos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, name')
                .eq('role', 'Técnico');

            if (error) throw error;
            setTechnicians(data || []);
        } catch (err) {
            console.error('Erro ao buscar técnicos:', err);
        }
    };

    const fetchClientes = async () => {
        try {
            const { data, error } = await supabase
                .from('clientes')
                .select('id, nome')
                .order('nome', { ascending: true });

            if (error) throw error;
            setClientes(data || []);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
        }
    };

    const handleCreateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dateTime = `${newAppointment.scheduled_date}T${newAppointment.time}:00Z`;
            const { error } = await supabase.from('appointments').insert([{
                client_name: newAppointment.client_name,
                service_type: newAppointment.service_type,
                technician_id: newAppointment.technician_id || null,
                scheduled_date: dateTime,
                status: 'Pendente'
            }]);

            if (error) throw error;

            toast.success('Agendamento criado com sucesso!');
            setIsDialogOpen(false);
            setNewAppointment({ client_name: '', service_type: '', technician_id: '', scheduled_date: '', time: '' });
            fetchAppointments();
        } catch (err: any) {
            console.error('Erro ao criar agendamento:', err);
            toast.error('Erro ao criar agendamento.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReport = (apt: any) => {
        setSelectedAptForReport(apt);
        setIsReportModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmado': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pendente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Em andamento': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendamentos</h1>
                            <p className="text-gray-600">Gerencie as visitas técnicas e serviços externos</p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.02]">
                                    <Plus size={20} />
                                    Novo Agendamento
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-gray-900 uppercase tracking-tight">Novo Agendamento</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateAppointment} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Cliente / Condomínio</Label>
                                        <Select
                                            value={newAppointment.client_name}
                                            onValueChange={val => setNewAppointment({ ...newAppointment, client_name: val })}
                                        >
                                            <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                                                <SelectValue placeholder="Selecione o cliente" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {clientes.map(cli => (
                                                    <SelectItem key={cli.id} value={cli.nome}>{cli.nome}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Serviço</Label>
                                        <Select
                                            value={newAppointment.service_type}
                                            onValueChange={val => setNewAppointment({ ...newAppointment, service_type: val })}
                                        >
                                            <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                                                <SelectValue placeholder="Selecione o serviço" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="Instalação de Câmeras">Instalação de Câmeras</SelectItem>
                                                <SelectItem value="Manutenção de Alarmes">Manutenção de Alarmes</SelectItem>
                                                <SelectItem value="Reparo de Interfone">Reparo de Interfone</SelectItem>
                                                <SelectItem value="Projeto Elétrico">Projeto Elétrico</SelectItem>
                                                <SelectItem value="Ar Condicionado">Ar Condicionado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Data</Label>
                                            <Input
                                                required
                                                type="date"
                                                value={newAppointment.scheduled_date}
                                                onChange={e => setNewAppointment({ ...newAppointment, scheduled_date: e.target.value })}
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Hora</Label>
                                            <Input
                                                required
                                                type="time"
                                                value={newAppointment.time}
                                                onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">Técnico Responsável</Label>
                                        <Select
                                            value={newAppointment.technician_id}
                                            onValueChange={val => setNewAppointment({ ...newAppointment, technician_id: val })}
                                        >
                                            <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl">
                                                <SelectValue placeholder="Selecione o técnico" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {technicians.map(tech => (
                                                    <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-bold uppercase tracking-widest rounded-xl"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar Agendamento'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 space-y-6">
                            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden border-none shadow-xl shadow-gray-200/50">
                                <CardHeader className="border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"><ChevronLeft size={16} /></Button>
                                        <span className="font-bold text-gray-900 uppercase tracking-tighter">Março 2024</span>
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"><ChevronRight size={16} /></Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-cyan-600">Hoje</Button>
                                        <div className="w-px h-4 bg-gray-200 mx-2" />
                                        <Button variant="outline" size="sm" className="gap-2 h-9 px-4 rounded-lg font-bold uppercase text-[10px] tracking-widest">
                                            <Filter size={14} /> Filtros
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-gray-100">
                                        {loading ? (
                                            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                                                <Loader2 className="animate-spin w-8 h-8 mb-4" />
                                                <p className="text-sm font-bold uppercase tracking-widest">Carregando agendamentos...</p>
                                            </div>
                                        ) : appointments.length === 0 ? (
                                            <div className="p-12 text-center text-gray-400">
                                                <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                                                <p className="text-sm font-bold uppercase tracking-widest">Nenhum agendamento encontrado</p>
                                            </div>
                                        ) : appointments.map((apt) => (
                                            <div key={apt.id} className="p-6 hover:bg-gray-50 transition-colors group cursor-pointer relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-cyan-500 transition-all" />
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex items-start gap-5">
                                                        <div className="bg-cyan-50 text-cyan-600 p-3 rounded-2xl shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                                                            <CalendarIcon size={24} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h3 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-cyan-600 transition-colors uppercase">{apt.client_name}</h3>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                                                                <span className="flex items-center gap-1.5 font-bold text-gray-700">
                                                                    <CalendarIcon size={14} />
                                                                    {new Date(apt.scheduled_date).toLocaleDateString('pt-BR')}
                                                                </span>
                                                                <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(apt.scheduled_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                <span className="flex items-center gap-1.5 font-bold text-gray-700"><User size={14} /> {apt.profiles?.name || 'Não atribuído'}</span>
                                                            </div>
                                                            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mt-2">{apt.service_type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 ml-14 md:ml-0">
                                                        <Badge className={cn("px-4 py-1.5 rounded-full border shadow-sm font-bold uppercase text-[10px] tracking-widest", getStatusColor(apt.status))}>
                                                            {apt.status}
                                                        </Badge>
                                                        {apt.status === 'Pendente' && (
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenReport(apt);
                                                                }}
                                                                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold uppercase text-[10px] tracking-widest px-4 h-9 rounded-lg"
                                                            >
                                                                Relatório
                                                            </Button>
                                                        )}
                                                        <Button variant="outline" size="sm" className="hidden lg:flex border-gray-200 hover:bg-gray-100 font-bold uppercase text-[10px] tracking-widest px-4">Detalhes</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-[#001F3F] text-white border-none shadow-2xl shadow-blue-900/20 overflow-hidden relative group">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all" />
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                                        <Clock className="text-cyan-400" />
                                        Resumo Hoje
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-3xl font-black">08</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Pendentes</p>
                                            <p className="text-3xl font-black text-yellow-400">03</p>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold uppercase tracking-widest h-12 rounded-xl">Ver Agenda Completa</Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-none shadow-xl shadow-gray-200/50">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold uppercase tracking-tight">Técnicos em Campo</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-gray-100">
                                        {[
                                            { name: 'Carlos Silva', status: 'Em serviço', color: 'bg-blue-500' },
                                            { name: 'Ricardo M.', status: 'Disponível', color: 'bg-green-500' },
                                            { name: 'Fernando Jr.', status: 'Em deslocamento', color: 'bg-yellow-500' },
                                        ].map((tech, i) => (
                                            <div key={i} className="px-6 py-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                                        {tech.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm uppercase">{tech.name}</p>
                                                        <p className="text-xs text-gray-500">{tech.status}</p>
                                                    </div>
                                                </div>
                                                <div className={cn("w-2.5 h-2.5 rounded-full", tech.color)} />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
            <RelatorioVisitaModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                appointment={selectedAptForReport}
                onSuccess={fetchAppointments}
            />
        </div>
    );
};

export default Agendamento;
