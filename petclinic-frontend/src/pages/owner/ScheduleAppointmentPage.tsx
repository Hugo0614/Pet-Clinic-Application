import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
}

interface Doctor {
  doctorId: number;
  userId: number;
  username: string;
  specialization: string;
  active: boolean;
}

// Generate business hours time slots (09:00 - 19:00, 30-minute intervals)
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 19; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 19 && minute === 30) break; // Stop at 19:00
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
  }
  return slots;
};

const ScheduleAppointmentPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [petId, setPetId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    Promise.all([
      api.get('/pets'),
      api.get('/users/doctors')
    ]).then(([petsRes, doctorsRes]) => {
      setPets(petsRes.data);
      setDoctors(doctorsRes.data);
      
      if (petsRes.data.length > 0) {
        setPetId(petsRes.data[0].id.toString());
      }
      if (doctorsRes.data.length > 0) {
        setDoctorId(doctorsRes.data[0].doctorId.toString());
      }
      
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load data', err);
      setError('Failed to load pets or doctors');
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Combine date and time into ISO-8601 format (LocalDateTime)
    const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`;
    
    try {
      await api.post('/appointments', {
        petId: Number(petId),
        doctorId: Number(doctorId),
        appointmentTime: appointmentDateTime,
      });
      navigate('/owner');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to schedule appointment';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin text-4xl">🐾</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex items-center justify-center">
      <Card className="max-w-2xl w-full relative overflow-hidden p-8 md:p-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-secondary-400"></div>
        
        <div className="mb-10 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Schedule Appointment</h2>
            <p className="text-slate-500 text-lg">Book a visit for your pet</p>
        </div>

        {pets.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-slate-600 mb-6 text-lg">You need to add a pet before scheduling an appointment.</p>
                <Button onClick={() => navigate('/owner')} variant="primary" className="px-8 py-3">
                    Go to Dashboard
                </Button>
            </div>
        ) : doctors.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-slate-600 mb-6 text-lg">No doctors are currently available.</p>
                <Button onClick={() => navigate('/owner')} variant="primary" className="px-8 py-3">
                    Go to Dashboard
                </Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Pet</label>
                        <select
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                            value={petId}
                            onChange={e => setPetId(e.target.value)}
                            required
                        >
                            {pets.map(pet => (
                                <option key={pet.id} value={pet.id}>
                                    {pet.name} ({pet.species})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Doctor</label>
                        <select
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                            value={doctorId}
                            onChange={e => setDoctorId(e.target.value)}
                            required
                        >
                            {doctors.map(doc => (
                                <option key={doc.doctorId} value={doc.doctorId}>
                                    Dr. {doc.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                        <Input
                            type="date"
                            value={appointmentDate}
                            onChange={e => setAppointmentDate(e.target.value)}
                            required
                            className="w-full p-3"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                        <select
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                            value={appointmentTime}
                            onChange={e => setAppointmentTime(e.target.value)}
                            required
                        >
                            {timeSlots.map(slot => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-500 text-sm rounded-lg flex items-center gap-3">
                        <span className="text-lg">⚠️</span> {error}
                    </div>
                )}

                <div className="flex gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/owner')} className="flex-1 py-3">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1 py-3">
                        Confirm Booking
                    </Button>
                </div>
            </form>
        )}
      </Card>
    </div>
  );
};

export default ScheduleAppointmentPage;
