
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface ShowcaseBannerProps {
  imageUrl?: string;
}

export const ShowcaseBanner: React.FC<ShowcaseBannerProps> = ({ imageUrl }) => {
  const [hasError, setHasError] = useState(false);
  const logoUrl = "https://s5.iimage.su/s/01/uK0lK8nxZppHltfQVmPpMgi2r1MXOiTdLgwF9qev.png";

  return (
    <div className="relative w-full bg-[#1a1d23] border border-white/[0.05] rounded-tr-[40px] md:rounded-tr-[80px] rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden group shadow-2xl">
      {/* Background subtle noise/grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      
      <div className="flex flex-col md:flex-row items-stretch min-h-[220px] md:min-h-[340px]">
        {/* Text Section - Bold & High Contrast */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center space-y-0 z-10">
          <div className="relative">
             <h2 className="text-5xl md:text-[9rem] font-black text-white leading-[0.82] tracking-tighter uppercase font-syne animate-in slide-in-from-left-8 duration-700">
               ВИТРИНА
             </h2>
             <h2 className="text-5xl md:text-[9rem] font-black text-white/20 italic leading-[0.82] tracking-tighter uppercase font-syne animate-in slide-in-from-left-12 duration-1000">
               ШАГОВ
             </h2>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-12 bg-indigo-500/50" />
          </div>
        </div>

        {/* Photo/Logo Section */}
        <div className="w-full md:w-[40%] bg-[#21252b] relative overflow-hidden flex items-center justify-center border-t md:border-t-0 md:border-l border-white/[0.08]">
          {(imageUrl && !hasError) ? (
            <>
              <img 
                src={imageUrl} 
                alt="" 
                onError={() => setHasError(true)}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Logo Overlay as a clean watermark */}
              <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 pointer-events-none drop-shadow-2xl">
                <img 
                  src={logoUrl} 
                  alt="" 
                  className="w-10 h-10 md:w-16 md:h-16 object-contain opacity-50 transition-opacity group-hover:opacity-100" 
                />
                <Sparkles size={16} className="absolute -top-2 -right-2 text-white/40 md:w-8 md:h-8 animate-pulse" />
              </div>
            </>
          ) : (
            /* Refined Placeholder if no image or broken image */
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
               <div className="relative">
                  <img 
                    src={logoUrl} 
                    alt="SHAG Logo" 
                    className="w-24 h-24 md:w-40 md:h-40 object-contain opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full opacity-50" />
               </div>
            </div>
          )}
          
          {/* Subtle Corner Glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 blur-[60px] rounded-full" />
        </div>
      </div>
    </div>
  );
};
