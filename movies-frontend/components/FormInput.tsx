'use client';
import { InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

type Props = {
  label: string;
  error?: FieldError;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ label, error, ...rest }: Props) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}</label>
      <input
        className="w-full border px-4 py-2 rounded"
        {...rest}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
