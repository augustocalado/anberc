"use client";

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Save, Plus, Trash2, Loader2, MapPin, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionProvider';

const VisitaTecnica = () => {
    const { user, profile } = useSession();
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<string>('');

    const [formData, setFormData] = useState({
        client_name: '',
        report: '',
        photos: [] as string[]
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            const { data } = await supabase
                .from('appointments')
                .select('*')
                .eq('status', 'Pendente')
                .order('scheduled_date', { ascending: true });
            if (data) setAppointments(data);
        };
        fetchAppointments();
    }, []);

    const handleAppointmentChange = (id: string) => {
        setSelectedAppointment(id);
        const appt = appointments.find(a => a.id === id);
        if (appt) {
            setFormData({ ...formData, client_name: appt.client_name });
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            setLoading(true);
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `visits/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('profiles') // Reusing profile bucket or use 'visits' if created
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('profiles')
                    .getPublicUrl(filePath);

                setFormData(prev => ({
                    ...prev,
                    photos: [...prev.photos, publicUrl]
                }));
                toast.success('Foto adicionada!');
            } catch (err: any) {
                console.error('Erro no upload:', err);
                toast.error('Erro ao carregar foto.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async () => {
        if (!user || !selectedAppointment) {
            toast.error('Selecione um agendamento primeiro.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('technical_visits')
                .insert({
                    appointment_id: selectedAppointment,
                    client_name: formData.client_name,
                    technician_id: user.id,
                    report: formData.report,
                    photos: formData.photos,
                    status: 'Realizada'
                });

            if (error) throw error;

            // Update appointment status to completed
            await supabase
                .from('appointments')
                .update({ status: 'Concluído' })
                .eq('id', selectedAppointment);

            toast.success('Relatório de visita salvo com sucesso!');
            setFormData({ client_name: '', report: '', photos: [] });
            setSelectedAppointment('');
        } catch (err: any) {
            console.error('Erro ao salvar relatório:', err);
            toast.error('Erro ao salvar relatório.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatório de Visita Técnica</h1>
                        <p className="text-gray-600">Registre os detalhes e evidências da visita realizada</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Dados da Visita</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Selecionar Agendamento</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={selectedAppointment}
                                            onChange={(e) => handleAppointmentChange(e.target.value)}
                                        >
                                            <option value="">Selecione um cliente agendado...</option>
                                            {appointments.map(appt => (
                                                <option key={appt.id} value={appt.id}>
                                                    {appt.client_name} - {new Date(appt.scheduled_date).toLocaleDateString()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="report">Relatório Técnico / Observações</Label>
                                        <Textarea
                                            id="report"
                                            placeholder="Descreva o que foi realizado, problemas identificados e soluções aplicadas..."
                                            className="min-h-[200px]"
                                            value={formData.report}
                                            onChange={(e) => setFormData({ ...formData, report: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Camera className="w-5 h-5" />
                                        Evidências Fotográficas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {formData.photos.map((photo, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                <img src={photo} alt={`Evidência ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-cyan-500 hover:text-cyan-500 transition-colors"
                                        >
                                            <Plus size={24} />
                                            <span className="text-xs mt-2 uppercase font-bold">Adicionar Foto</span>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                            accept="image/*"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Técnico Responsável</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                                            {profile?.photo_url ? (
                                                <img src={profile.photo_url} className="w-full h-full object-cover" />
                                            ) : (
                                                profile?.name?.charAt(0) || '?'
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{profile?.name || 'Carregando...'}</p>
                                            <p className="text-xs text-gray-500">{profile?.role}</p>
                                        </div>
                                    </div>

                                    {profile?.signature_url && (
                                        <div className="space-y-2">
                                            <Label>Sua Assinatura Digital:</Label>
                                            <div className="border border-gray-200 rounded-lg bg-white p-2">
                                                <img src={profile.signature_url} alt="Assinatura" className="max-h-24 mx-auto" />
                                                <p className="text-center text-[10px] text-gray-400 mt-1 uppercase font-bold italic">
                                                    {profile.signature_name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        className="w-full h-12 text-lg"
                                        onClick={handleSubmit}
                                        disabled={loading || !selectedAppointment}
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                        Finalizar Relatório
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VisitaTecnica;
