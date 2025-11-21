import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
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
  const [loading, setLoading] = useState(false);

  const loadAppointments = () => {
    setLoading(true);
    api.get('/appointments')
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load appointments', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Upcoming Appointments</h1>
        <Button onClick={loadAppointments} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p className="text-xl">No upcoming appointments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {appointments.map(app => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="text-lg font-semibold text-blue-600">
                  Appointment #{app.id}
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">Date & Time:</span> {formatDateTime(app.appointmentTime)}
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded ${
                    app.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                    app.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">Pet ID:</span> {app.petId}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <Link 
                    to={`/doctor/pet/${app.petId}`} 
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    View Medical History
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;
