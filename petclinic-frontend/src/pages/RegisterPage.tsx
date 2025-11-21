import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          
          <div>
            <Input
              type="password"
              placeholder="Password (8-16 chars, uppercase + numbers)"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>
          
          <div>
            <Input
              type="text"
              placeholder="Identity Code (e.g., A123)"
              value={identityCode}
              onChange={handleIdentityChange}
              maxLength={4}
              required
            />
            {identityError && (
              <div className="text-red-500 text-sm mt-1">{identityError}</div>
            )}
          </div>
          
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            onValidationChange={setIsPhoneValid}
          />
          
          <select
            className="border border-gray-300 px-3 py-2 rounded w-full"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="OWNER">Pet Owner</option>
            <option value="DOCTOR">Doctor</option>
          </select>
          
          {error && (
            <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}
          
          <Button type="submit">Register</Button>
          
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login here
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
