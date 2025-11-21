import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (user?.role === 'OWNER') {
      navigate('/owner');
    } else if (user?.role === 'DOCTOR') {
      navigate('/doctor');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Pet Clinic</h1>
        <p className="text-center mb-6 text-gray-600">
          A modern platform for pet owners and doctors to manage pets, appointments, and medical records.
        </p>
        
        {user ? (
          /* Logged In User */
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-lg">
              Welcome back, <span className="font-semibold text-blue-600">{user.username}</span>!
            </p>
            <Button 
              onClick={handleGoToDashboard}
              className="w-full max-w-xs py-3 text-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          /* Guest User */
          <div className="flex justify-center gap-4">
            <a 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </a>
            <a 
              href="/register" 
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
            >
              Register
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
