import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';

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

interface Appointment {
  id: number;
  appointmentTime: string;
  status: string;
  petId: number;
  doctorId: number;
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

const EditAppointmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    // Load pets, doctors, and current appointment data
    Promise.all([
      api.get('/pets'),
      api.get('/users/doctors'),
      api.get('/appointments')
    ]).then(([petsRes, doctorsRes, appointmentsRes]) => {
      setPets(petsRes.data);
      setDoctors(doctorsRes.data);
      
      // Find the current appointment
      const currentAppointment = appointmentsRes.data.find(
        (apt: Appointment) => apt.id === Number(id)
      );
      
      if (currentAppointment) {
        setPetId(currentAppointment.petId.toString());
        setDoctorId(currentAppointment.doctorId.toString());
        
        // Parse the appointment date and time
        const dateTime = new Date(currentAppointment.appointmentTime);
        const date = dateTime.toISOString().split('T')[0];
        const time = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;
        
        setAppointmentDate(date);
        setAppointmentTime(time);
      } else {
        setError('Appointment not found');
      }
      
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load data', err);
      setError('Failed to load appointment data');
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Combine date and time into ISO-8601 format (LocalDateTime)
    const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`;
    
    try {
      await api.put(`/appointments/${id}`, {
        petId: Number(petId),
        doctorId: Number(doctorId),
        appointmentTime: appointmentDateTime,
      });
      navigate('/owner');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update appointment';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="max-w-md w-full">
          <div className="text-center">Loading...</div>
        </Card>
      </div>
    );
  }

  if (error && !petId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Error</h2>
          <p className="text-center mb-4">{error}</p>
          <Button onClick={() => navigate('/owner')}>Go to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Appointment</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Pet Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Pet
            </label>
            <select
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            <select
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
              required
            >
              {doctors.map(doctor => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  Dr. {doctor.username}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <Input
              type="date"
              value={appointmentDate}
              onChange={e => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Time (Business Hours: 9:00 AM - 7:00 PM)
            </label>
            <select
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {error && (
            <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button type="button" onClick={() => navigate('/owner')} className="flex-1 bg-gray-500 hover:bg-gray-600">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Appointment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditAppointmentPage;
