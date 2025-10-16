import React from 'react';

const NotFoundPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">Page Not Found</p>
      <a href="/" className="text-blue-600 underline">Go Home</a>
    </div>
  </div>
);

export default NotFoundPage;
