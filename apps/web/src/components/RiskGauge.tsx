'use client';

interface RiskGaugeProps {
  score: number;
  level: string;
  size?: 'sm' | 'lg';
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'very_high':
      return '#ef4444';
    case 'high':
      return '#f97316';
    case 'moderate':
      return '#eab308';
    case 'low':
      return '#84cc16';
    case 'very_low':
      return '#22c55e';
    default:
      return '#9ca3af';
  }
}

function getLevelLabel(level: string): string {
  return level.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RiskGauge({ score, level, size = 'lg' }: RiskGaugeProps) {
  const color = getLevelColor(level);
  const isLarge = size === 'lg';
  const radius = isLarge ? 80 : 36;
  const stroke = isLarge ? 12 : 6;
  const svgSize = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={svgSize} height={svgSize} className="transform -rotate-90">
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          width: svgSize,
          height: svgSize,
        }}
      >
        <span className={`font-bold ${isLarge ? 'text-4xl' : 'text-lg'}`} style={{ color }}>
          {score}
        </span>
        {isLarge && (
          <span className="text-sm text-gray-500 mt-1">{getLevelLabel(level)}</span>
        )}
      </div>
    </div>
  );
}
