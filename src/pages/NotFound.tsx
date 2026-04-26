import { Link } from "react-router-dom";
import { MoveLeft, HelpCircle } from "lucide-react";
import Logo from "@/components/layout/Logo";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white selection:bg-[#38BDF8]/30 px-4">
      {/* Background Micro-animation/Effect */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%23001F3F' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: '100px' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="mb-12">
          <Logo className="scale-125 md:scale-150" />
        </div>

        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black text-[#001F3F]/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 bg-[#38BDF8]/10 rounded-[2rem] border border-[#38BDF8]/20 animate-bounce">
              <HelpCircle className="w-16 h-16 text-[#38BDF8]" />
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-[#001F3F] mb-4">Página não encontrada</h2>
        <p className="text-gray-600 text-lg mb-12 leading-relaxed">
          O link que você acessou pode estar quebrado ou a página foi removida.
          Nossa equipe de engenharia já está ciente.
        </p>

        <Link to="/">
          <button className="group flex items-center gap-3 bg-[#001F3F] text-white hover:bg-[#002d5c] px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl">
            <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar para a Página Inicial
          </button>
        </Link>
      </div>

      <div className="mt-16 text-sm text-gray-400 font-medium tracking-widest uppercase">
        Anberc System Security & Climatização
      </div>
    </div>
  );
};

export default NotFound;
