import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg'; // Added size prop
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', // Default size is 'md'
  className = '', 
  ...props 
}) => {
  const baseStyle = "flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 text-white';
      break;
    case 'secondary':
      variantStyle = 'bg-slate-700 hover:bg-slate-600 focus:ring-slate-500 text-slate-100';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyle = 'px-6 py-3 text-base';
      break;
    case 'lg':
      sizeStyle = 'px-8 py-4 text-lg';
      break;
  }

  return (
    <button
      type="button"
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};