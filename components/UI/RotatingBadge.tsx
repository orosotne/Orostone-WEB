import React from 'react';

interface RotatingBadgeProps {
  onClick?: () => void;
  className?: string;
  variant?: 'light' | 'dark' | 'dark-white';
}

export const RotatingBadge: React.FC<RotatingBadgeProps> = ({
  onClick,
  className = '',
  variant = 'light',
}) => {
  const textColor = variant === 'light' ? 'white' : '#121212';
  const accentColor = variant === 'dark-white' ? 'white' : '#ECD488';
  const innerCircleSize = variant === 'light' ? 'w-14 h-14' : 'w-20 h-20';
  const innerPadding = variant === 'light' ? 'p-2.5' : 'p-4';
  const innerCircleBg = variant === 'dark-white' ? 'bg-white' : 'bg-[#ECD488]';

  return (
    <div
      className={`relative w-32 h-32 cursor-pointer group ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? 'Scroll to top' : undefined}
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 w-full h-full"
        style={{ animation: 'spin 10s linear infinite' }}
        aria-hidden="true"
      >
        <defs>
          <path
            id="rotatingBadgeCircle"
            d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
          />
        </defs>
        <text fontFamily="sans-serif" fontWeight="700">
          <textPath href="#rotatingBadgeCircle" startOffset="0%">
            <tspan fontSize="11" fill={textColor} letterSpacing="1.5">KRÁSA KAMEŇA</tspan>
            <tspan fontSize="14" fill={accentColor} letterSpacing="1.5" dy="0"> ✦ </tspan>
            <tspan fontSize="11" fill={textColor} letterSpacing="1.5" fontStyle="italic">SILA TECHNOLÓGIE</tspan>
            <tspan fontSize="14" fill={accentColor} letterSpacing="1.5" dy="0"> ✦ </tspan>
          </textPath>
        </text>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${innerCircleSize} rounded-full ${innerCircleBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${innerPadding}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 654.84"
            className="w-full h-full"
            aria-hidden="true"
          >
            <polygon
              points="1080 207.41 1080 238.72 359.25 654.84 0 447.43 0 416.12 720.75 0 1080 207.41"
              fill="#121212"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
