"use client";

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Save, Plus, Trash2, Loader2, MapPin, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionProvider';

interface RelatorioVisitaModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: any;
    onSuccess?: () => void;
}

const RelatorioVisitaModal = ({ isOpen, onClose, appointment, onSuccess }: RelatorioVisitaModalProps) => {
    const { user, profile } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        report: '',
        photos: [] as string[]
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            setLoading(true);
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `visits/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('profiles')
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
        if (!user || !appointment) {
            toast.error('Dados de agendamento ausentes.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('technical_visits')
                .insert({
                    appointment_id: appointment.id,
                    client_name: appointment.client_name,
                    technician_id: user.id,
                    report: formData.report,
                    photos: formData.photos,
                    status: 'Realizada'
                });

            if (error) throw error;

            await supabase
                .from('appointments')
                .update({ status: 'Concluído' })
                .eq('id', appointment.id);

            toast.success('Relatório de visita salvo com sucesso!');
            setFormData({ report: '', photos: [] });
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erro ao salvar relatório:', err);
            toast.error('Erro ao salvar relatório.');
        } finally {
            setLoading(false);
        }
    };

    if (!appointment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-white rounded-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <MapPin className="text-cyan-600" />
                        Relatório de Visita Técnica
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cliente</Label>
                            <p className="font-bold text-[#001F3F]">{appointment.client_name}</p>
                        </div>
                        <div>
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Serviço</Label>
                            <p className="text-sm font-medium text-gray-600">{appointment.service_type}</p>
                        </div>
                        <div>
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Data Agendada</Label>
                            <p className="text-sm font-medium text-gray-600">
                                {new Date(appointment.scheduled_date).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Relatório Técnico / Observações</Label>
                        <Textarea
                            placeholder="Descreva o que foi realizado, problemas identificados e soluções aplicadas..."
                            className="min-h-[150px] bg-gray-50 border-gray-100 rounded-xl focus:ring-cyan-500"
                            value={formData.report}
                            onChange={(e) => setFormData({ ...formData, report: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                            <Camera size={14} className="text-cyan-600" />
                            Evidências Fotográficas
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {formData.photos.map((photo, index) => (
                                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                                    <img src={photo} alt={`Evidência ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-cyan-500 hover:text-cyan-500 hover:bg-cyan-50/50 transition-all group"
                            >
                                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] mt-2 uppercase font-black tracking-widest">Adicionar</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handlePhotoUpload}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {profile?.signature_url && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Técnico Responsável</Label>
                                <p className="font-bold text-[#001F3F]">{profile.name}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-black italic">{profile.signature_name}</p>
                            </div>
                            <div className="bg-white p-2 rounded-xl border border-gray-200">
                                <img src={profile.signature_url} alt="Assinatura" className="h-12 object-contain" />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-3 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase tracking-widest text-xs h-12">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold uppercase tracking-widest text-xs h-12 rounded-xl px-8 shadow-lg shadow-cyan-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                        Finalizar Relatório
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RelatorioVisitaModal;
