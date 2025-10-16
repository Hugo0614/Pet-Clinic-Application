import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link to="/">Pet Clinic</Link>
      </div>
      <div className="flex gap-4 items-center">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && user.role === 'OWNER' && (
          <>
            <Link to="/owner">Dashboard</Link>
            <Link to="/owner/schedule">Schedule Appointment</Link>
          </>
        )}
        {user && user.role === 'DOCTOR' && (
          <Link to="/doctor">Doctor Dashboard</Link>
        )}
        {user && (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
