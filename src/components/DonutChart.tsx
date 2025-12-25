interface DonutChartProps {
  percentage: number;
  color: string;
  label: string;
}

export function DonutChart({ percentage, color, label }: DonutChartProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          className="text-lg font-semibold"
        >
          {percentage}%
        </text>
      </svg>
      <p className="text-sm mt-2">{label}</p>
    </div>
  );
}
