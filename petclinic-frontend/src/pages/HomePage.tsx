import React from 'react';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <Card className="max-w-lg w-full">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Pet Clinic</h1>
      <p className="text-center mb-4">A modern platform for pet owners and doctors to manage pets, appointments, and medical records.</p>
      <div className="flex justify-center gap-4">
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</a>
        <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded">Register</a>
      </div>
    </Card>
  </div>
);

export default HomePage;
