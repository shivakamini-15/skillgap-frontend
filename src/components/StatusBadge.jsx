const labels = { MISSING: 'Missing', WEAK: 'Needs work', STRONG: 'Met' };

export default function StatusBadge({ status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{labels[status] || status}</span>;
}
