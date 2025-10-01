"use client";
import React from "react";

/* ---------- Labels & Inputs ---------- */
export const FieldLabel: React.FC<
  React.PropsWithChildren<{ htmlFor?: string }>
> = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-800 mb-1"
  >
    {children}
  </label>
);

const baseInput =
  "w-full rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed";

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  p
) => <input {...p} className={`${baseInput} ${p.className ?? ""}`} />;
export const NumberInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = (p) => (
  <input
    {...p}
    inputMode="decimal"
    className={`${baseInput} ${p.className ?? ""}`}
  />
);
export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = (p) => <textarea {...p} className={`${baseInput} ${p.className ?? ""}`} />;
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  p
) => <select {...p} className={`${baseInput} bg-white ${p.className ?? ""}`} />;

/* ---------- Flat Section (no box) ---------- */
export const Section: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
  <div className={`p-4 md:p-6 ${className ?? ""}`}>{children}</div>
);

/* ---------- Outer Card (keep for the whole page) ---------- */
export const Card: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
  <div
    className={`rounded-2xl bg-white border border-gray-200 shadow-sm ${
      className ?? ""
    }`}
  >
    {children}
  </div>
);
export const CardBody: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
  <div className={`p-4 md:p-6 ${className ?? ""}`}>{children}</div>
);

/* ---------- Tabs ---------- */
export const UnderlineTab: React.FC<
  React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>
> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "relative -mb-px pb-2 px-1.5 text-sm font-medium",
      "border-b-2 focus:outline-none focus:ring-0",
      active
        ? "border-[#0b1424] text-[#0b1424]"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
    ].join(" ")}
  >
    {children}
  </button>
);

/* ---------- Buttons ---------- */
export const OutlineButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, ...p }) => (
  <button
    {...p}
    className={[
      "px-3 py-1.5 text-sm rounded-md transition",
      "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-700",
      "focus:outline-none focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed",
      className ?? "",
    ].join(" ")}
  />
);
export const SolidButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, ...p }) => (
  <button
    {...p}
    className={[
      "px-3 py-1.5 text-sm rounded-md transition",
      "bg-[#0b1424] text-white hover:brightness-110",
      "focus:outline-none focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed",
      className ?? "",
    ].join(" ")}
  />
);
export const ButtonRow: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
  <div className={`flex justify-end gap-2 ${className ?? ""}`}>{children}</div>
);

/* ---------- Helpers ---------- */
export function YesNo({
  value,
  onChange,
  id,
  disabled,
}: {
  value?: "Yes" | "No" | "";
  onChange: (v: "Yes" | "No" | "") => void;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <Select
      id={id}
      disabled={disabled}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as any)}
    >
      <option value="">Select…</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </Select>
  );
}
export function CurrencyInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <Input
      disabled={disabled}
      placeholder={placeholder ?? "$"}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
