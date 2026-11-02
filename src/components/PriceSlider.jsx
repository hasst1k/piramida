export default function PriceSlider({ label, value, max, onChange }) {
  const current = value || max;
  return (
    <label>
      {label}: до <b>{current}</b>
      <input
        type="range"
        min="0"
        max={max}
        value={current}
        onChange={(e) => onChange(Number(e.target.value) >= max ? "" : e.target.value)}
      />
    </label>
  );
}