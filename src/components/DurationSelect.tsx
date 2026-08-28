const DURATION_OPTIONS = [
  { minutes: 30, label: "30 min" },
  { minutes: 60, label: "1 hora" },
  { minutes: 90, label: "1.5 horas" },
  { minutes: 120, label: "2 horas" },
  { minutes: 180, label: "3 horas" },
  { minutes: 240, label: "4 horas" },
  { minutes: 480, label: "Todo el día (8h)" },
];

export function DurationSelect({ defaultValue = 60 }: { defaultValue?: number }) {
  return (
    <div className="space-y-1">
      <label className="field-label" htmlFor="durationMinutes">
        Duración estimada
      </label>
      <select id="durationMinutes" name="durationMinutes" defaultValue={defaultValue} className="input-field">
        {DURATION_OPTIONS.map((opt) => (
          <option key={opt.minutes} value={opt.minutes}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
