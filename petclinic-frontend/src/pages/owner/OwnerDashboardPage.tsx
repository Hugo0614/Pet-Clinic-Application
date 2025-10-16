import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Link } from 'react-router-dom';

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
}

interface Appointment {
  id: number;
  appointmentTime: string;
  status: string;
  petId: number;
  doctorId: number;
}

const OwnerDashboardPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petBirthDate, setPetBirthDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get('/pets').then(res => setPets(res.data));
    api.get('/appointments').then(res => setAppointments(res.data));
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pets', {
        name: petName,
        species: petSpecies,
        breed: petBreed,
        birthDate: petBirthDate,
      });
      setPetName('');
      setPetSpecies('');
      setPetBreed('');
      setPetBirthDate('');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to add pet', err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Pets</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Pet</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {pets.map(pet => (
          <Card key={pet.id}>
            <div className="font-bold text-lg">{pet.name}</div>
            <div>Species: {pet.species}</div>
            <div>Breed: {pet.breed}</div>
            <div>Birth Date: {pet.birthDate}</div>
          </Card>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-4">Appointments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {appointments.map(app => (
          <Card key={app.id}>
            <div>Date: {new Date(app.appointmentTime).toLocaleString()}</div>
            <div>Status: {app.status}</div>
            <div>Pet ID: {app.petId}</div>
            <div>Doctor ID: {app.doctorId}</div>
          </Card>
        ))}
      </div>
      <Link to="/owner/schedule">
        <Button>Schedule New Appointment</Button>
      </Link>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Pet</h2>
        <form onSubmit={handleAddPet} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Pet Name"
            value={petName}
            onChange={e => setPetName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Species (e.g., Dog, Cat)"
            value={petSpecies}
            onChange={e => setPetSpecies(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Breed"
            value={petBreed}
            onChange={e => setPetBreed(e.target.value)}
            required
          />
          <Input
            type="date"
            placeholder="Birth Date"
            value={petBirthDate}
            onChange={e => setPetBirthDate(e.target.value)}
            required
          />
          <Button type="submit">Add Pet</Button>
        </form>
      </Modal>
    </div>
  );
};

export default OwnerDashboardPage;
