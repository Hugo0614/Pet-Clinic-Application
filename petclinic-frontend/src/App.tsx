import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import ScheduleAppointmentPage from './pages/owner/ScheduleAppointmentPage';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import PetMedicalHistoryPage from './pages/doctor/PetMedicalHistoryPage';

const App: React.FC = () => (
  <AuthProvider>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/owner" element={<ProtectedRoute role="OWNER"><OwnerDashboardPage /></ProtectedRoute>} />
      <Route path="/owner/schedule" element={<ProtectedRoute role="OWNER"><ScheduleAppointmentPage /></ProtectedRoute>} />
      <Route path="/doctor" element={<ProtectedRoute role="DOCTOR"><DoctorDashboardPage /></ProtectedRoute>} />
      <Route path="/doctor/pet/:petId" element={<ProtectedRoute role="DOCTOR"><PetMedicalHistoryPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AuthProvider>
);

export default App;
