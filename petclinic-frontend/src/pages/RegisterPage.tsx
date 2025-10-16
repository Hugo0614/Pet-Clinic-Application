import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register as registerService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('OWNER');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerService(username, password, role);
      login(data.token, { username: data.username, role: data.role });
      if (data.role === 'OWNER') navigate('/owner');
      else if (data.role === 'DOCTOR') navigate('/doctor');
    } catch (err) {
      setError('Registration failed');
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
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <select
            className="border border-gray-300 px-3 py-2 rounded w-full"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="OWNER">Pet Owner</option>
            <option value="DOCTOR">Doctor</option>
          </select>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit">Register</Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
