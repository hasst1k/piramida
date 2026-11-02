import PriceSlider from "./PriceSlider";

export default function Filters({ filters, options, values, onChange, onReset }) {
  return (
    <aside className="filters">
      <h3>Фильтры</h3>

      {filters.map((f) => {
        if (f.type === "select") {
          return (
            <label key={f.key}>
              {f.label}
              <select
                value={values[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
              >
                <option value="">Все</option>
                {(options[f.key] || []).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
          );
        }

        if (f.type === "slider") {
          return (
            <PriceSlider
              key={f.key}
              label={f.label}
              max={f.max}
              value={values[f.key + "_max"]}
              onChange={(v) => onChange(f.key + "_max", v)}
            />
          );
        }

        return null;
      })}

      <button className="button" onClick={onReset}>Сбросить</button>
    </aside>
  );
}