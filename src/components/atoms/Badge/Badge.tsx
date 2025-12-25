'use client';

import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeType = 'status' | 'count';

export interface BadgeProps {
  variant?: BadgeVariant;
  type?: BadgeType;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const typeStyles: Record<BadgeType, string> = {
  status: 'px-2.5 py-0.5 rounded-full text-xs font-medium',
  count: 'px-2 py-0.5 rounded-md text-xs font-semibold min-w-[1.5rem] text-center',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  type = 'status',
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center ${variantStyles[variant]} ${typeStyles[type]} ${className}`}
      role={type === 'status' ? 'status' : undefined}
      aria-label={type === 'count' ? `Count: ${children}` : undefined}
    >
      {children}
    </span>
  );
};

export default Badge;
