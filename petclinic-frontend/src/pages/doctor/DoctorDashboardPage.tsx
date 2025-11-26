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
  petName?: string;
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Doctor Dashboard</h1>
            <p className="text-slate-500 text-lg">Manage your appointments and patients</p>
          </div>
          <Button 
            onClick={loadAppointments} 
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            {loading ? 'Refreshing...' : 'Refresh List'}
          </Button>
        </header>
      
        {appointments.length === 0 ? (
            <Card className="p-16 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                <div className="text-6xl mb-6">📅</div>
                <h3 className="text-2xl font-medium text-slate-700 mb-2">No appointments found</h3>
                <p className="text-slate-500 text-lg">You don't have any upcoming appointments scheduled.</p>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map(app => (
                <Card key={app.id} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary-500 group p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div className="text-xl font-bold text-slate-800">
                            Appointment #{app.id}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            app.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                            app.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {app.status}
                        </span>
                    </div>
                    
                    <div className="space-y-3 text-slate-600">
                        <div className="flex items-center gap-3">
                            <span className="text-lg">🕒</span>
                            <span className="font-medium">{formatDateTime(app.appointmentTime)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-lg">🐾</span>
                            <span>Pet: {app.petName || `ID ${app.petId}`}</span>
                        </div>
                    </div>

                    <div className="pt-6 mt-2 border-t border-slate-100">
                        <Link 
                            to={`/doctor/pet/${app.petId}`}
                            state={{ appointmentId: app.id, appointmentDate: app.appointmentTime }}
                        >
                            <Button variant="secondary" className="w-full justify-center group-hover:bg-secondary-600 py-3">
                                View Medical History
                            </Button>
                        </Link>
                    </div>
                </div>
                </Card>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
