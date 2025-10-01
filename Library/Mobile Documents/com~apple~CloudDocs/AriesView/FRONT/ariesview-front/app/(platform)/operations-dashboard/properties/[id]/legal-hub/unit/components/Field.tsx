"use client";
import React from "react";

export const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string }>> = ({
  htmlFor,
  children,
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

export const TextInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = (props) => (
  <input
    {...props}
    className={`w-full rounded-md border px-3 py-2 text-sm ${
      props.className ?? ""
    }`}
  />
);

export const NumberInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = (props) => (
  <input
    {...props}
    inputMode="decimal"
    className={`w-full rounded-md border px-3 py-2 text-sm ${
      props.className ?? ""
    }`}
  />
);

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => (
  <textarea
    {...props}
    className={`w-full rounded-md border px-3 py-2 text-sm ${
      props.className ?? ""
    }`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props
) => (
  <select
    {...props}
    className={`w-full rounded-md border px-3 py-2 text-sm bg-white ${
      props.className ?? ""
    }`}
  />
);

export const Section: React.FC<
  React.PropsWithChildren<{ title: string; subtitle?: string }>
> = ({ title, subtitle, children }) => (
  <div className="rounded-xl border p-4 mb-6">
    <div className="mb-3">
      <h3 className="text-base font-semibold">{title}</h3>
      {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
    </div>
    {children}
  </div>
);

/** small Yes/No toggle */
export function YesNo({
  value,
  onChange,
  id,
}: {
  value?: "Yes" | "No" | "";
  onChange: (v: "Yes" | "No" | "") => void;
  id?: string;
}) {
  return (
    <Select
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as any)}
    >
      <option value="">Select…</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </Select>
  );
}

/** currency-ish input (kept as string for flexibility) */
export function CurrencyInput({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <TextInput
      placeholder={placeholder ?? "$"}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
