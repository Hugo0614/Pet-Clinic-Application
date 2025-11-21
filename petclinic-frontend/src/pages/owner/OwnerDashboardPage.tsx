import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Link, useNavigate } from 'react-router-dom';

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  lastVisitDate?: string | null;
}

interface Appointment {
  id: number;
  appointmentTime: string;
  status: string;
  petId: number;
  doctorId: number;
  petName?: string;
  doctorName?: string;
}

const OwnerDashboardPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petBirthDate, setPetBirthDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get('/pets').then(res => setPets(res.data));
    api.get('/appointments').then(res => {
      // Filter for upcoming appointments only
      const now = new Date();
      const upcoming = res.data.filter((apt: Appointment) => 
        new Date(apt.appointmentTime) >= now
      );
      setAppointments(upcoming);
    });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${appointmentId}`);
        loadData(); // Reload appointments after deletion
      } catch (err) {
        console.error('Failed to delete appointment', err);
        alert('Failed to delete appointment. Please try again.');
      }
    }
  };

  const handleEditAppointment = (appointmentId: number) => {
    navigate(`/owner/edit-appointment/${appointmentId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
      
      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Panel: Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
            <Link to="/owner/schedule">
              <Button>Schedule New</Button>
            </Link>
          </div>
          
          {appointments.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No upcoming appointments
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map(apt => (
                <Card key={apt.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold text-lg text-blue-600">
                      Pet: {apt.petName || `ID ${apt.petId}`}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Date:</span> {formatDateTime(apt.appointmentTime)}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Doctor:</span> {apt.doctorName || `ID ${apt.doctorId}`}
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded ${
                        apt.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                        apt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                      <Button 
                        onClick={() => handleEditAppointment(apt.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel: My Pets */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">My Pets</h2>
            <Button onClick={() => setIsModalOpen(true)}>Add Pet</Button>
          </div>
          
          {pets.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No pets added yet
            </div>
          ) : (
            <div className="space-y-3">
              {pets.map(pet => (
                <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-xl text-purple-600">
                      {pet.name}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Species:</span>
                        <span className="ml-2 text-gray-800">{pet.species}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Birth Date:</span>
                        <span className="ml-2 text-gray-800">{formatDate(pet.birthDate)}</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-600">Last Visit:</span>
                      <span className="ml-2 text-gray-800">
                        {pet.lastVisitDate ? formatDate(pet.lastVisitDate) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Pet Modal */}
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
          <select
            className="border border-gray-300 px-3 py-2 rounded w-full"
            value={petSpecies}
            onChange={e => setPetSpecies(e.target.value)}
            required
          >
            <option value="">Select Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
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
