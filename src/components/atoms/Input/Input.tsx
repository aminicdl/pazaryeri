'use client';

import React, { forwardRef, InputHTMLAttributes, useId } from 'react';

export type InputVariant = 'text' | 'search' | 'number';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: InputVariant;
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'text', error, label, disabled, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const baseStyles =
      'w-full px-4 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';

    const stateStyles = error
      ? 'border-red-500 focus:ring-red-500 dark:border-red-400'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-400';

    const colorStyles =
      'bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500';

    const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900';

    const inputType = variant === 'search' ? 'search' : variant === 'number' ? 'number' : 'text';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          aria-disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${baseStyles} ${stateStyles} ${colorStyles} ${disabledStyles} ${className}`}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
