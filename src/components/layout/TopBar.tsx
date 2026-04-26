"use client";

import React from 'react';
import { Mail, Phone, ExternalLink, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const TopBar = () => {
    return (
        <div className="bg-[#001F3F] text-white py-2 px-4 border-b border-white/10 overflow-hidden hidden md:block">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                    <a
                        href="mailto:contato@anberc.com.br"
                        className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                    >
                        <Mail size={14} className="text-cyan-400" />
                        <span>contato@anberc.com.br</span>
                    </a>

                    <div className="flex items-center gap-4">
                        <a
                            href="tel:12981628675"
                            className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                        >
                            <Phone size={14} className="text-cyan-400" />
                            <span>(12) 98162-8675</span>
                        </a>
                        <div className="hidden sm:flex items-center gap-2 text-white/70 ml-4 pl-4 border-l border-white/20">
                            <Clock size={14} className="text-cyan-400" />
                            <span>8:00 às 18:00 Seg a sexta</span>
                        </div>
                    </div>
                </div>

                <Link
                    to="/os"
                    className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30 transition-all font-bold uppercase tracking-wider"
                >
                    <span>Abrir um chamado</span>
                    <ExternalLink size={12} />
                </Link>
            </div>
        </div>
    );
};

export default TopBar;
