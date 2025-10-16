import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';

interface Appointment {
  id: number;
  appointmentTime: string;
  status: string;
  petId: number;
  doctorId: number;
}

const DoctorDashboardPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api.get('/appointments').then(res => setAppointments(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Today's Appointments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {appointments.map(app => (
          <Card key={app.id}>
            <div>Date: {app.appointmentTime}</div>
            <div>Status: {app.status}</div>
            <div>Pet ID: {app.petId}</div>
            <Link to={`/doctor/pet/${app.petId}`} className="text-blue-600 underline">View Medical History</Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
