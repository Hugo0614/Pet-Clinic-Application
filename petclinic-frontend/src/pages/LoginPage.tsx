import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login as loginService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await loginService(username, password);
      login(data.token, { username: data.username, role: data.role });
      if (data.role === 'OWNER') navigate('/owner');
      else if (data.role === 'DOCTOR') navigate('/doctor');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex w-full max-w-4xl h-[600px]">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
            <div className="absolute top-8 left-8">
                <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                </Link>
            </div>

          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold mb-2 text-slate-800">Welcome Back!</h2>
            <p className="text-slate-500 mb-8">Please login to access your account.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg flex items-center gap-2 animate-fade-in-up">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
              )}
              
              <Button type="submit" disabled={isLoading} className="w-full py-3 mt-2 btn-primary">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="mt-8 text-center text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-primary-50 items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 opacity-90"></div>
            <div className="absolute inset-0 paw-pattern opacity-10"></div>
            
            <div className="relative z-10 text-center text-white p-12">
                <div className="text-8xl mb-6 animate-float">🐕</div>
                <h3 className="text-3xl font-bold mb-4">Professional Pet Care</h3>
                <p className="text-primary-100 text-lg">
                    Manage your pet's health records and appointments with ease.
                </p>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
