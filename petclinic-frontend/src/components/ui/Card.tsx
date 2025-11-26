import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white shadow-md rounded-xl p-6 transition-all ${className}`}>
    {children}
  </div>
);

export default Card;
