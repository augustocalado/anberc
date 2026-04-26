"use client";

import React, { useState } from 'react';
import { useSession } from '@/components/SessionProvider';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Search,
  PenTool,
  Calendar,
  LogOut,
  MapPin,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
  { name: 'Visita Técnica', href: '/visita-tecnica', icon: MapPin, roles: ['Admin Master', 'Técnico'] },
  { name: 'Financeiro', href: '/financeiro', icon: BarChart3, roles: ['Admin Master'] },
  { name: 'Usuários', href: '/usuarios', icon: Users, roles: ['Admin Master'] },
  { name: 'Gestão SEO', href: '/seo', icon: Globe, roles: ['Admin Master'] },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    role: profile?.role || 'Admin Master' // Fallback to Admin Master to show menu items during load
  };

  return (
    <div className={cn(
      "hidden md:flex bg-gray-900 border-r border-gray-800 transition-all duration-300 relative h-screen flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-center p-4 border-b border-gray-800 relative min-h-[80px]">
        {isCollapsed ? (
          <img
            src={user.photo}
            alt="User"
            className="w-8 h-8 rounded-lg object-cover border border-cyan-500/50"
          />
        ) : (
          <Logo variant="light" className="scale-125" userPhoto={user.photo} />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors",
            !isCollapsed ? "absolute right-2 top-1/2 -translate-y-1/2" : ""
          )}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {navigation
          .filter(item => item.roles.includes(user.role))
          .map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-cyan-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon size={20} />
                {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
      </nav>

      <div className={cn(
        "p-4 border-t border-gray-800 space-y-4 bg-gray-900",
        isCollapsed && "flex flex-col items-center px-2"
      )}>
        <Link
          to="/configuracoes"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
            location.pathname === '/configuracoes'
              ? "bg-cyan-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
        >
          <Settings size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Configurações</span>}
        </Link>

        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full text-red-400 hover:text-white hover:bg-red-500/20",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Sair do Sistema</span>}
        </button>

        {!isCollapsed && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-gray-500 text-[10px] truncate">{user.email}</span>
                  <span className="bg-cyan-500/10 text-cyan-500 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter border border-cyan-500/20">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;