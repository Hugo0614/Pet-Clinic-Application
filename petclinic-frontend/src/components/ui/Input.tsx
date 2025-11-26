import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`border border-slate-300 px-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400 ${className}`}
    {...props}
  />
);

export default Input;
