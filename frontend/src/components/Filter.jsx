const OPTIONS = ['all', 'pending', 'done'];

export default function Filter({ current, onChange }) {
  return (
    <div className="filter" role="group" aria-label="Filter tasks">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          className={current === opt ? 'active' : ''}
          onClick={() => onChange(opt)}
        >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
}