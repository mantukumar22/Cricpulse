/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverGlow?: boolean;
  borderTheme?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverGlow = false,
  borderTheme = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-md 
        bg-slate-900/50 
        border 
        ${borderTheme ? 'border-[#FFCB05]/30 shadow-[0_0_15px_rgba(255,203,5,0.15)]' : 'border-white/10 shadow-black/45'}
        rounded-2xl 
        p-5 
        shadow-xl 
        transition-all 
        duration-300
        ${onClick ? 'cursor-pointer hover:bg-slate-900/75' : ''}
        ${hoverGlow ? 'hover:border-[#FFCB05]/50 hover:shadow-[0_0_20px_rgba(255,203,5,0.15)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
