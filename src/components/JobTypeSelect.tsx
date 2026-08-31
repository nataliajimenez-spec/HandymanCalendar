"use client";

import { useState } from "react";

type JobType = { id: string; name: string };

const OTHER = "OTHER";

export function JobTypeSelect({
  jobTypes,
  defaultJobTypeId,
  defaultTitle,
  idPrefix = "",
}: {
  jobTypes: JobType[];
  defaultJobTypeId?: string | null;
  defaultTitle?: string;
  idPrefix?: string;
}) {
  const initialIsOther = !defaultJobTypeId && (!!defaultTitle || jobTypes.length === 0);
  const [selected, setSelected] = useState(
    defaultJobTypeId || (initialIsOther ? OTHER : jobTypes[0]?.id ?? OTHER)
  );
  const [customTitle, setCustomTitle] = useState(initialIsOther ? defaultTitle ?? "" : "");

  const isOther = selected === OTHER;
  const selectedName = jobTypes.find((jt) => jt.id === selected)?.name ?? "";

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label className="field-label" htmlFor={`${idPrefix}jobTypeId`}>
          Tipo de trabajo
        </label>
        <select
          id={`${idPrefix}jobTypeId`}
          value={isOther ? OTHER : selected}
          onChange={(e) => setSelected(e.target.value)}
          className="input-field"
        >
          {jobTypes.length === 0 && <option value={OTHER}>Otro (especificar)</option>}
          {jobTypes.map((jt) => (
            <option key={jt.id} value={jt.id}>
              {jt.name}
            </option>
          ))}
          {jobTypes.length > 0 && <option value={OTHER}>Otro (especificar)</option>}
        </select>
      </div>

      {isOther ? (
        <div className="space-y-1">
          <label className="field-label" htmlFor={`${idPrefix}title`}>
            Especifica el trabajo
          </label>
          <input
            id={`${idPrefix}title`}
            name="title"
            required
            placeholder="Ej. Reparar fuga en baño"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="input-field"
          />
          <input type="hidden" name="jobTypeId" value="" />
        </div>
      ) : (
        <>
          <input type="hidden" name="title" value={selectedName} />
          <input type="hidden" name="jobTypeId" value={selected} />
        </>
      )}
    </div>
  );
}
