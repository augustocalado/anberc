"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light';
  userPhoto?: string;
}

const Logo = ({ className, variant = 'default', userPhoto }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2 transition-all duration-300", className)}>
      {userPhoto ? (
        <div className="relative group">
          <img
            src={userPhoto}
            alt="User Profile"
            className="h-16 w-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </div>
      ) : (
        <img
          src="/logo-anberc.png"
          alt="Anberc Logo"
          className={cn(
            "h-20 w-auto object-contain",
            variant === 'light' ? "brightness-0 invert" : ""
          )}
        />
      )}
    </div>
  );
};

export default Logo;