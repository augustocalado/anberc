"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LoginButton = () => {
  return (
    <Link to="/login">
      <Button className="bg-[#38BDF8] text-white hover:bg-[#0EA5E9] font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300">
        Entrar
      </Button>
    </Link>
  );
};

export default LoginButton;