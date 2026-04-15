interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* I — Red left arc */}
      <path
        d="M42 8 L28 8 C14 8 8 20 8 34 L8 66 C8 80 14 92 28 92 L42 92 L42 75 L32 75 C26 75 24 70 24 66 L24 34 C24 30 26 25 32 25 L42 25 Z"
        fill="#CC1A1A"
      />
      {/* U — Green right shape */}
      <path
        d="M54 8 L54 66 C54 70 56 75 62 75 L68 75 C74 75 76 70 76 66 L76 8 L92 8 L92 66 C92 80 86 92 68 92 L62 92 C44 92 38 80 38 66 L38 8 Z"
        fill="#166534"
      />
    </svg>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <Logo size={36} />
      <div className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-gray-900">UI Uniformes</span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Gestão</span>
      </div>
    </div>
  );
}
