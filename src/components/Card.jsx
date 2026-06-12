import React from 'react';

/**
 * Reusable Card component for layout sections, questions, and detail panels.
 */
export default function Card({
  children,
  className = '',
  onClick,
  variant = 'default'
}) {


  const isClickable = typeof onClick === 'function';
  
  let baseStyles = 'bg-surface border rounded-xl p-gutter md:p-stack-md flex flex-col transition-all duration-200';
  let variantStyles = 'border-primary/10';
  
  if (variant === 'outlined') {
    variantStyles = 'border-outline-variant';
  } else if (variant === 'flat') {
    variantStyles = 'border-transparent bg-surface-container-low';
  }

  const clickableStyles = isClickable
    ? 'cursor-pointer hover:border-primary/30 active:scale-[0.99]'
    : '';




    
  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${clickableStyles} ${className}`}
    >
      {children}
    </div>
  );
}
