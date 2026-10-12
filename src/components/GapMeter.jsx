/** Five-segment meter: filled = current level, marker = required level. */
export default function GapMeter({ current, required }) {
  return (
    <div className="meter" aria-label={`Level ${current} of required ${required}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`seg ${n <= current ? 'on' : ''} ${n <= required ? 'need' : ''} ${n === required ? 'target' : ''}`}
        />
      ))}
    </div>
  );
}
