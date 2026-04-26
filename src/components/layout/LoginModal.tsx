"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Entrar na Conta</DialogTitle>
          <DialogClose asChild>
            <button className="absolute top-4 right-4 p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </DialogClose>
        </DialogHeader>
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333] ml-1">E-mail</label>
            <Input className="bg-[#F5F5F5] border-transparent h-12 rounded-xl focus:ring-[#38BDF8]" placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333] ml-1">Senha</label>
            <Input type="password" className="bg-[#F5F5F5] border-transparent h-12 rounded-xl focus:ring-[#38BDF8]" placeholder="********" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/login" className="text-[#38BDF8] hover:text-[#0EA5E9]">
                Esqueci minha senha
              </Link>
            </div>
            <Button className="w-full bg-[#001F3F] text-white hover:bg-[#002d5c]">Entrar</Button>
          </div>
        </form>
        <p className="mt-4 text-[#38BDF8] text-sm">Ainda não tem uma conta? <Link to="/login" className="text-[#38BDF8] hover:text-[#0EA5E9]">Criar conta</Link></p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;