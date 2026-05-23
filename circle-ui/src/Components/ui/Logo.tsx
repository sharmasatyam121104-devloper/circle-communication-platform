type LogoProps = {
  height?: number;
  className?: string;
  href?: string;
};

const Logo = ({
  height = 40,
  className = "",
  href = "/",
}: LogoProps) => {

  return (
    <a
      href={href}
      className={`
        inline-flex items-center gap-3
        select-none
        group
        transition-all duration-200
        ${className}
      `}
      style={{ height }}
    >

      {/* ICON */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        className="
          transition-transform duration-300
          group-hover:scale-105
        "
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Theme-aware gradient (neutral professional) */}
          <linearGradient id="circleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Base circle */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="url(#circleGrad)"
          strokeWidth="10"
          fill="none"
          className="text-blue-500 dark:text-cyan-400"
        />

        {/* Inner arc */}
        <path
          d="M30 55 A20 20 0 1 1 70 45"
          stroke="url(#circleGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          className="text-blue-600 dark:text-cyan-300"
        />

      </svg>

      {/* TEXT */}
      <div className="flex flex-col leading-tight">

        <span
          className="
            text-xl font-serif tracking-wide
            text-zinc-900 dark:text-zinc-900
            transition-colors
          "
        >
          CIRCLE
        </span>

      </div>

    </a>
  );
};

export default Logo;