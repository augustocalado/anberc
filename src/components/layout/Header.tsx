"use client";

import React, { useState } from 'react';
import { useSession } from '@/components/SessionProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import TopBar from './TopBar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ClipboardList,
  BarChart3,
  PenTool,
  Menu,
  Settings,
  Search,
  Bell,
  Calendar,
  LogOut
} from 'lucide-react';
import Logo from './Logo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin Master'] },
  { name: 'Clientes', href: '/clientes', icon: Users, roles: ['Admin Master', 'Técnico'] },
  { name: 'Produtos', href: '/produtos', icon: Package, roles: ['Admin Master'] },
  { name: 'Serviços', href: '/servicos', icon: PenTool, roles: ['Admin Master'] },
  { name: 'Orçamentos', href: '/orcamentos', icon: FileText, roles: ['Admin Master', 'Cliente'] },
  { name: 'Ordens de Serviço', href: '/os', icon: ClipboardList, roles: ['Admin Master', 'Técnico'] },
  { name: 'Contratos', href: '/contratos', icon: FileText, roles: ['Admin Master', 'Cliente'] },
  { name: 'Agendamento', href: '/agendamento', icon: Calendar, roles: ['Admin Master', 'Técnico'] },
  { name: 'Financeiro', href: '/financeiro', icon: BarChart3, roles: ['Admin Master'] },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { profile, signOut } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const user = {
    name: profile?.name || profile?.email || (profile === null ? 'Convidado' : 'Carregando...'),
    email: profile?.email || '',
    photo: profile?.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    role: profile?.role || 'Admin Master'
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-900 border-gray-800 p-0 w-72">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-800 flex justify-center">
                  <Logo variant="light" className="scale-125" userPhoto={user.photo} />
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navigation
                    .filter(item => item.roles.includes(user.role))
                    .map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-cyan-600 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
                          )}
                        >
                          <item.icon size={20} />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                  <Link
                    to="/configuracoes"
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 mb-4",
                      location.pathname === '/configuracoes'
                        ? "bg-cyan-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <Settings size={20} />
                    <span className="font-medium">Configurações</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 mb-4 w-full text-red-400 hover:text-white hover:bg-red-500/20"
                    )}
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Sair do Sistema</span>
                  </button>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-600 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold text-white">
                        {profile?.photo_url ? (
                          <img src={profile.photo_url} className="w-full h-full object-cover" />
                        ) : (
                          'AD'
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-white">
                        <p className="text-xs font-medium truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate tracking-tighter">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar clientes, orçamentos, OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;