import React from 'react';

/**
 * Reusable Button component styled with Tailwind.
 */
export default function Button({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon = null
}) {
  let baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      // Solid Primary (Navy / Black)
      variantStyles = 'bg-primary text-on-primary hover:bg-primary/90 px-8 py-3 text-label-sm tracking-wider uppercase';
      break;
    case 'secondary':
      // Outlined Primary
      variantStyles = 'border border-primary text-primary hover:bg-surface-container-low px-6 py-3 text-label-sm tracking-wider uppercase';
      break;
    case 'outlined':
      // Standard thin outline
      variantStyles = 'border border-outline-variant text-outline hover:border-primary hover:text-primary px-5 py-2.5 text-label-sm';
      break;
    case 'tertiary':
      // Text link / Underlined
      variantStyles = 'bg-transparent text-outline hover:text-primary underline px-2 py-1 text-label-sm';
      break;
    default:
      variantStyles = 'bg-primary text-on-primary px-8 py-3';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="material-symbols-outlined mr-2 !text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}
