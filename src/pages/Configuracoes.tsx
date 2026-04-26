"use client";

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Bell, Shield, Database, Search, Upload, Plus, Trash2, Edit2, Globe, MapPin, ExternalLink, PlusCircle, ShieldCheck, Camera, Loader2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionProvider';

const Configuracoes = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Logic to handle the file (e.g., upload or state update)
      console.log('Selecionado:', file.name);
    }
  };

  const [sitelinks, setSitelinks] = useState([
    { id: 1, text: 'Instalação de Câmeras', url: '/servicos-seguranca' },
    { id: 2, text: 'Ar Condicionado SJC', url: '/climatizacao' }
  ]);

  const [localSeo, setLocalSeo] = useState([
    {
      id: 1,
      title: 'Instalação de Ar Condicionado em SJC',
      description: 'Melhor serviço de instalação e manutenção de ar condicionado em São José dos Campos.',
      keywords: 'ar condicionado sjc, instalação, manutenção'
    },
    {
      id: 2,
      title: 'Câmeras de Segurança SJC',
      description: 'Venda e instalação de câmeras de segurança monitoradas em São José dos Campos.',
      keywords: 'câmeras sjc, segurança eletrônica, monitoramento'
    }
  ]);

  const { user, refreshProfile } = useSession();
  const [googleCode, setGoogleCode] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    cargo: '',
    signature_name: ''
  });
  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      // Fetch Google Code
      const { data: codeData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'google_site_verification')
        .single();
      if (codeData) setGoogleCode(codeData.value.code);

      // Fetch Profile
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) {
          setProfilePhoto(profile.photo_url);
          setProfileData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            cargo: profile.role || '',
            signature_name: profile.signature_name || ''
          });
        }
      }
    };

    fetchSettings();
  }, [user]);

  const handleSaveGoogleCode = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'google_site_verification', value: { code: googleCode } });

      if (error) throw error;
      toast.success('Código de verificação salvo com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar código:', err);
      toast.error('Erro ao salvar código.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePhotoClick = () => {
    profileInputRef.current?.click();
  };

  const handleProfilePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const uploadToast = toast.loading('Enviando nova foto de perfil...');
      setLoading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        // Update Profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ photo_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        await refreshProfile();
        setProfilePhoto(publicUrl);
        toast.dismiss(uploadToast);
        toast.success('Foto de perfil atualizada com sucesso!');
      } catch (err: any) {
        console.error('Erro ao atualizar foto:', err);
        toast.dismiss(uploadToast);
        toast.error('Erro ao carregar foto: ' + (err.message || 'Verifique sua conexão.'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          role: profileData.cargo,
          signature_name: profileData.signature_name
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success('Perfil atualizado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      toast.error('Erro ao salvar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath(); // Reset path
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = async () => {
    if (!user || !signatureCanvasRef.current) return;

    setLoading(true);
    try {
      const canvas = signatureCanvasRef.current;
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Não foi possível gerar a imagem da assinatura.');

      const fileName = `${user.id}-signature.png`;
      const filePath = `signatures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles') // Keeping it in profiles bucket for simplicity
        .upload(filePath, blob, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ signature_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Assinatura salva com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar assinatura:', err);
      toast.error('Erro ao salvar assinatura.');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
            <p className="text-gray-600">Gerencie preferências e configurações do sistema</p>
          </div>

          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm inline-flex">
              <TabsTrigger value="identidade" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-4 py-2 font-bold uppercase text-[10px] tracking-widest transition-all">Identidade</TabsTrigger>
              <TabsTrigger value="banner" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-4 py-2 font-bold uppercase text-[10px] tracking-widest transition-all">Banner</TabsTrigger>
              <TabsTrigger value="perfil" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-4 py-2 font-bold uppercase text-[10px] tracking-widest transition-all">Perfil</TabsTrigger>
              <TabsTrigger value="usuarios" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-4 py-2 font-bold uppercase text-[10px] tracking-widest transition-all">Usuários</TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-4 py-2 font-bold uppercase text-[10px] tracking-widest transition-all">SEO</TabsTrigger>
              <TabsTrigger value="clientes" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg px-4 py-2 font-bold uppercase text-[10px] tracking-widest transition-all">Nossos Clientes</TabsTrigger>
            </TabsList>


            <TabsContent value="identidade">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Identidade Visual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 group hover:border-cyan-500 transition-colors cursor-pointer">
                    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                      <img src="/logo-anberc.png" alt="Logo Preview" className="h-16 object-contain" />
                    </div>
                    <div className="text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button variant="outline" className="gap-2" onClick={handleLogoClick}>
                        <Upload size={16} />
                        Alterar Logotipo
                      </Button>
                      <p className="mt-2 text-xs text-gray-500 select-none">
                        Formatos recomendados: PNG ou SVG (fundo transparente)
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Salvar Identidade</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="perfil">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Perfil do Usuário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-cyan-500/20 bg-gray-100 flex items-center justify-center">
                        {profilePhoto ? (
                          <img src={profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-gray-300" />
                        )}
                      </div>
                      <button
                        onClick={handleProfilePhotoClick}
                        className="absolute bottom-2 right-2 bg-cyan-500 text-white p-2 rounded-xl shadow-lg hover:bg-cyan-600 transition-colors"
                      >
                        <Camera size={20} />
                      </button>
                      <input
                        type="file"
                        ref={profileInputRef}
                        onChange={handleProfilePhotoChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900">Foto de Perfil</h3>
                      <p className="text-sm text-gray-500">Esta foto aparecerá na lateral do painel</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" value={profileData.email} disabled />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={profileData.cargo}
                        onChange={(e) => setProfileData({ ...profileData, cargo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-8 mt-8">
                    <h3 className="font-bold text-gray-900 mb-4">Assinatura Digital</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="signature_name">Nome para Assinatura (Ex: João Silva - Engenheiro)</Label>
                        <Input
                          id="signature_name"
                          value={profileData.signature_name}
                          onChange={(e) => setProfileData({ ...profileData, signature_name: e.target.value })}
                          placeholder="Nome que aparecerá nos relatórios"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Assinatura (Touch/Mouse)</Label>
                        <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                          <canvas
                            ref={signatureCanvasRef}
                            width={400}
                            height={150}
                            className="w-full touch-none cursor-crosshair bg-white"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={clearSignature}>Limpar</Button>
                          <Button size="sm" onClick={saveSignature} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Salvar Assinatura'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="banner">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Gerenciamento de Banners
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Configure os banners que aparecem na página inicial do site.</p>
                  <Button variant="outline" size="sm">Adicionar Novo Banner</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <div className="space-y-6">
                {/* SEO Local Section */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      SEO Local (São José dos Campos)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-4 py-3">Title Tag</th>
                            <th className="px-4 py-3">Meta Description</th>
                            <th className="px-4 py-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {localSeo.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-4 font-medium text-gray-900 max-w-[200px] truncate">{item.title}</td>
                              <td className="px-4 py-4 text-gray-600 max-w-[400px] truncate">{item.description}</td>
                              <td className="px-4 py-4 text-right space-x-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                  <Edit2 size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 size={16} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Sitelinks Manager */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-green-600" />
                      Sitelinks (Links Rápidos para o Google)
                    </CardTitle>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                      <PlusCircle size={16} />
                      Adicionar Novo Sitelink
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sitelinks.map((link) => (
                        <div key={link.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{link.text}</p>
                            <p className="text-xs text-blue-600 font-mono mt-1">{link.url}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                              <Edit2 size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Regiões de Atendimento */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      Regiões de Atendimento & Geolocalização
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="regioes" className="text-gray-700">Bairros e Cidades Atendidas</Label>
                      <Textarea
                        id="regioes"
                        className="min-h-[100px] bg-white border-gray-200 focus:ring-blue-500"
                        defaultValue="SJC (Urbanova, Aquarius, Vila Adyana, Satélite), Jacareí e Caçapava"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Verificação de Propriedade Section */}
                <Card className="bg-white border-gray-200 shadow-sm border-l-4 border-l-blue-600">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      Verificação de Propriedade
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="google-verify" className="text-gray-700 font-semibold">
                        Código de Verificação do Google Workspace (Meta Tag)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="google-verify"
                          placeholder="google-site-verification=..."
                          value={googleCode}
                          onChange={(e) => setGoogleCode(e.target.value)}
                          className="bg-white border-gray-200 focus:ring-blue-500 font-mono text-sm"
                        />
                        <Button
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                          onClick={handleSaveGoogleCode}
                        >
                          {loading ? <Loader2 className="animate-spin" /> : 'Salvar Código'}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 italic">
                        Insira aqui a meta tag fornecida pelo Google (ex: google-site-verification).
                        Esta tag será injetada automaticamente no cabeçalho de todas as páginas.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                  <Button className="bg-[#001F3F] hover:bg-[#002d5c] text-white shadow-xl px-8 py-6 text-lg rounded-xl transition-all active:scale-95 flex gap-2">
                    <Settings className="w-5 h-5" />
                    Salvar Todas as Configurações SEO
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clientes">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Nossos Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Gerencie a lista de clientes e logos exibidos no site.</p>
                  <Button variant="outline" size="sm">Adicionar Cliente</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usuarios">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Users List */}
                <Card className="lg:col-span-8 bg-white border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-[#001F3F]">
                        <Users className="w-5 h-5 text-cyan-500" />
                        Corpo Técnico e Administrativo
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">Gerencie os acessos e permissões da equipe</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-50/30 border-b">
                          <tr>
                            <th className="px-6 py-4 font-bold">Colaborador</th>
                            <th className="px-6 py-4 font-bold">Nível</th>
                            <th className="px-6 py-4 font-bold">E-mail</th>
                            <th className="px-6 py-4 font-bold text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-cyan-50/30 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-600/20">
                                  {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                                </div>
                                <div>
                                  <span className="font-bold text-[#001F3F] block">{user?.name || 'Administrador'}</span>
                                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{profileData.cargo || 'Gestor'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <Badge className="bg-cyan-50 text-cyan-600 border-cyan-100 font-bold px-3 py-1 rounded-lg">
                                Admin Master
                              </Badge>
                            </td>
                            <td className="px-6 py-5 text-gray-500 font-medium">{user?.email || 'admin@anberc.com.br'}</td>
                            <td className="px-6 py-5 text-right">
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-cyan-600" />
                              </Button>
                            </td>
                          </tr>
                          {/* Placeholder for more users */}
                          <tr className="hover:bg-cyan-50/30 transition-colors group opacity-60">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                  FL
                                </div>
                                <div>
                                  <span className="font-bold text-[#001F3F] block">Flávio Oliveira</span>
                                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Técnico Sênior</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <Badge variant="outline" className="border-gray-200 text-gray-500 font-bold px-3 py-1 rounded-lg">
                                Técnico
                              </Badge>
                            </td>
                            <td className="px-6 py-5 text-gray-400 font-medium italic">convite enviado...</td>
                            <td className="px-6 py-5 text-right">
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl">
                                <Trash2 className="w-4 h-4 text-red-300" />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Create User Form */}
                <Card className="lg:col-span-4 bg-[#001F3F] border-none shadow-2xl rounded-[2.5rem] text-white self-start sticky top-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4">
                      <Plus className="text-cyan-400 w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Novo Membro</CardTitle>
                    <p className="text-white/40 text-sm font-medium">Convide colaboradores para o painel de controle.</p>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 ml-1">Nome Completo</Label>
                        <Input className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-cyan-500 text-white placeholder:text-white/20" placeholder="Ex: Lucas Mendes" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 ml-1">E-mail de Acesso</Label>
                        <Input type="email" className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-cyan-500 text-white placeholder:text-white/20" placeholder="lucas@anberc.com.br" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 ml-1">Nível de Permissão</Label>
                        <select className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 text-white font-medium">
                          <option className="bg-[#001F3F]" value="admin">Admin Master</option>
                          <option className="bg-[#001F3F]" value="tecnico">Técnico Operacional</option>
                          <option className="bg-[#001F3F]" value="financeiro">Financeiro / Adm</option>
                        </select>
                      </div>
                    </div>
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#001F3F] font-black h-14 rounded-xl shadow-xl shadow-cyan-500/10 transition-all active:scale-[0.98] mt-4">
                      Enviar Convite de Acesso
                    </Button>
                    <p className="text-[10px] text-white/30 text-center font-medium italic">
                      O colaborador receberá um link para definir sua senha inicial por e-mail.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Configuracoes;