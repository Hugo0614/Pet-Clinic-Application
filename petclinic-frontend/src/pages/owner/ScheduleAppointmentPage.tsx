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

const ScheduleAppointmentPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [petId, setPetId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/pets').then(res => {
      setPets(res.data);
      if (res.data.length > 0) {
        setPetId(res.data[0].id.toString());
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments', {
        petId: Number(petId),
        doctorId: Number(doctorId),
        appointmentTime,
      });
      navigate('/owner');
    } catch (err) {
      setError('Failed to schedule appointment');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Schedule Appointment</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            className="border border-gray-300 px-3 py-2 rounded w-full"
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
          <Input
            type="number"
            placeholder="Doctor ID"
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
            required
          />
          <Input
            type="datetime-local"
            placeholder="Appointment Time"
            value={appointmentTime}
            onChange={e => setAppointmentTime(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit">Schedule</Button>
        </form>
      </Card>
    </div>
  );
};

export default ScheduleAppointmentPage;
