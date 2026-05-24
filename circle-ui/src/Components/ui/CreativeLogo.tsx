type CreativeLogoProps = {
  size?: number; // पूरे लोगो का बेस साइज
  className?: string;
};

const CreativeLogo = ({ size = 200, className = "" }: CreativeLogoProps) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center select-none bg-slate-950 p-8 rounded-3xl ${className}`}
      style={{ width: size * 2.2, fontFamily: 'system-ui, sans-serif' }}
    >
      <div className="relative flex items-center justify-center group cursor-pointer">
        
        <div className="absolute inset-0 bg-linear-to-tr from-cyan-500 via-blue-600 to-indigo-500 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />

        <div 
          className="absolute border-2 border-dashed border-cyan-400/30 rounded-full animate-[spin_20s_linear_infinite]"
          style={{ width: size * 1.1, height: size * 1.1 }}
        />

        {/* Main Creative SVG Icon */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-300"
        >
          <defs>
            <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
              <stop offset="50%" stopColor="#2563eb" /> {/* Blue */}
              <stop offset="100%" stopColor="#4f46e5" /> {/* Indigo */}
            </linearGradient>
            <linearGradient id="metallicGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <circle cx="100" cy="100" r="35" fill="url(#mainGrad)" className="opacity-80 mix-blend-screen" />
          <circle cx="100" cy="100" r="25" fill="#020617" />


          <path
            d="M 40,100 A 60,60 0 1,1 140,150"
            stroke="url(#mainGrad)"
            strokeWidth="20"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
          />


          <path
            d="M 90,40 L 150,100 A 30,30 0 0,1 110,140 L 80,110"
            stroke="url(#metallicGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            className="mix-blend-overlay"
          />
          <path
            d="M 90,40 L 150,100 A 30,30 0 0,1 110,140 L 80,110"
            stroke="url(#mainGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />


          <circle cx="150" cy="100" r="6" fill="#22d3ee" className="animate-ping origin-center" />
          <circle cx="150" cy="100" r="4" fill="#ffffff" />
        </svg>
      </div>


      <div className="mt-6 text-center z-10">
        <h1 className="text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
          CIRCLE
        </h1>
        <p className="mt-1 text-xs font-medium tracking-[0.25em] text-cyan-400 uppercase opacity-90">
          connect . create . evolve
        </p>
      </div>
    </div>
  );
};

export default CreativeLogo;