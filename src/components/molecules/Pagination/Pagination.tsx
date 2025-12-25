'use client';

import React, { useMemo } from 'react';
import Button from '@/components/atoms/Button/Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  disabled?: boolean;
  className?: string;
  dictionary?: {
    previous: string;
    next: string;
    page: string;
    of: string;
    first: string;
    last: string;
  };
}

const ChevronLeftIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
);

const DoubleChevronLeftIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.06 1.06L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.06 1.06L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const DoubleChevronRightIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.21 5.23a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-1.06L8.168 10 4.23 6.29a.75.75 0 01-.02-1.06zm6 0a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.06-1.06L14.168 10 10.23 6.29a.75.75 0 01-.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const DOTS = '...';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  disabled = false,
  className = '',
  dictionary = {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    first: 'First page',
    last: 'Last page',
  },
}) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 dots

    // Case 1: Total pages less than page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Case 2: No left dots, but right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: Left dots, but no right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, DOTS, ...middleRange, DOTS, totalPages];
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      {/* First Page Button */}
      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={disabled || isFirstPage}
          aria-label={dictionary.first}
          className="p-2"
        >
          <DoubleChevronLeftIcon />
        </Button>
      )}

      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || isFirstPage}
        aria-label={dictionary.previous}
        className="p-2"
      >
        <ChevronLeftIcon />
        <span className="sr-only sm:not-sr-only sm:ml-1">{dictionary.previous}</span>
      </Button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
              >
                {DOTS}
              </span>
            );
          }

          const isActive = pageNumber === currentPage;
          return (
            <Button
              key={pageNumber}
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(pageNumber as number)}
              disabled={disabled}
              aria-label={`${dictionary.page} ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
              className="min-w-[40px]"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Mobile Page Indicator */}
      <span className="sm:hidden px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
        {dictionary.page} {currentPage} {dictionary.of} {totalPages}
      </span>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || isLastPage}
        aria-label={dictionary.next}
        className="p-2"
      >
        <span className="sr-only sm:not-sr-only sm:mr-1">{dictionary.next}</span>
        <ChevronRightIcon />
      </Button>

      {/* Last Page Button */}
      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || isLastPage}
          aria-label={dictionary.last}
          className="p-2"
        >
          <DoubleChevronRightIcon />
        </Button>
      )}
    </nav>
  );
};

export default Pagination;
