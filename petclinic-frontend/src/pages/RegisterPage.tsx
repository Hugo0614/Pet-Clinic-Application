import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register as registerService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PhoneInput from '../components/ui/PhoneInput';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('OWNER');
  const [identityCode, setIdentityCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [identityError, setIdentityError] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd: string): boolean => {
    if (pwd.length === 0) {
      setPasswordError('');
      return false;
    }
    
    if (pwd.length < 8 || pwd.length > 16) {
      setPasswordError('Password must be 8-16 characters long');
      return false;
    }
    
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(pwd)) {
      setPasswordError('Password must be a combination of letters and numbers');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const validateIdentityCode = (code: string): boolean => {
    if (code.length === 0) {
      setIdentityError('');
      return false;
    }
    
    const pattern = /^[A-Z]\d{3}$/;
    if (!pattern.test(code)) {
      setIdentityError('Format error: Must start with an uppercase letter followed by 3 digits');
      return false;
    }
    
    setIdentityError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    const isPasswordValid = validatePassword(password);
    const isIdentityValid = validateIdentityCode(identityCode);
    
    if (!isPasswordValid || !isIdentityValid || !isPhoneValid) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await registerService(username, password, role, identityCode, phoneNumber);
      login(data.token, { username: data.username, role: data.role });
      if (data.role === 'OWNER') navigate('/owner');
      else if (data.role === 'DOCTOR') navigate('/doctor');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      if (errorMessage.includes('already registered')) {
        setError('User already registered, please login');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    setIdentityCode(newCode);
    validateIdentityCode(newCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex w-full max-w-5xl min-h-[700px]">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-5/12 bg-secondary-50 items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 to-secondary-600 opacity-90"></div>
            <div className="absolute inset-0 paw-pattern opacity-10"></div>
            
            <div className="relative z-10 text-center text-white p-12">
                <div className="text-8xl mb-6 animate-float animation-delay-2000">🐱</div>
                <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
                <p className="text-secondary-100 text-lg">
                    Create an account to start your journey with us.
                </p>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative">
            <div className="absolute top-8 right-8">
                <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors">
                    Back to Home
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>

          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold mb-2 text-slate-800">Create Account</h2>
            <p className="text-slate-500 mb-8">Fill in your details to register.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <Input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full"
                    />
                </div>
                
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <Input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={`w-full ${passwordError ? 'border-red-300 focus:ring-red-200' : ''}`}
                    />
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    <p className="text-slate-400 text-xs mt-1">8-16 chars, 1 uppercase, letters & numbers</p>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Identity Code</label>
                    <Input
                    type="text"
                    placeholder="e.g. A123"
                    value={identityCode}
                    onChange={handleIdentityChange}
                    maxLength={4}
                    required
                    className={`w-full ${identityError ? 'border-red-300 focus:ring-red-200' : ''}`}
                    />
                    {identityError && <p className="text-red-500 text-xs mt-1">{identityError}</p>}
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <PhoneInput
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        onValidationChange={setIsPhoneValid}
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('OWNER')}
                            className={`p-3 rounded-lg border text-center transition-all ${
                                role === 'OWNER' 
                                ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className="block text-2xl mb-1">👤</span>
                            <span className="font-medium">Pet Owner</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('DOCTOR')}
                            className={`p-3 rounded-lg border text-center transition-all ${
                                role === 'DOCTOR' 
                                ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className="block text-2xl mb-1">👨‍⚕️</span>
                            <span className="font-medium">Doctor</span>
                        </button>
                    </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg flex items-center gap-2 animate-fade-in-up">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={isLoading || !!passwordError || !!identityError || !isPhoneValid} 
                className="w-full py-3 mt-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <p className="mt-6 text-center text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
