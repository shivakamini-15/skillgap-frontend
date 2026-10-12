/** Circular score meter (0-100). */
export default function ScoreRing({ value = 0, label, size = 132, color = 'var(--blue)' }) {
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="ring" style={{ width: size }}>
      <svg width={size} height={size} role="img" aria-label={`${label}: ${pct} percent`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="ring-value">
          {Math.round(pct)}%
        </text>
      </svg>
      <div className="ring-label">{label}</div>
    </div>
  );
}
