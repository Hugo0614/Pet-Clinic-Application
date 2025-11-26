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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Owner Dashboard</h1>
            <p className="text-slate-500 text-lg">Manage your pets and appointments</p>
          </div>
          <div className="flex gap-4">
             <Link to="/owner/schedule">
                <Button className="btn-primary flex items-center gap-2 px-6 py-3">
                  <span>📅</span> Schedule Appointment
                </Button>
             </Link>
             <Button onClick={() => setIsModalOpen(true)} className="bg-secondary-500 hover:bg-secondary-600 text-white flex items-center gap-2 px-6 py-3">
                <span>🐾</span> Add New Pet
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Pets Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="text-3xl">🐶</span> My Pets
                </h2>
            </div>
            
            {pets.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <div className="text-5xl mb-4">🐕</div>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">No pets added yet</h3>
                    <p className="text-slate-500 mb-6">Add your furry friends to get started!</p>
                    <Button onClick={() => setIsModalOpen(true)} variant="outline">Add Pet</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pets.map(pet => (
                        <Card key={pet.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary-400 overflow-hidden group p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-secondary-600 transition-colors">{pet.name}</h3>
                                    <p className="text-slate-500">{pet.species} • {pet.breed}</p>
                                </div>
                                <div className="bg-secondary-50 text-secondary-600 p-3 rounded-full">
                                    🐾
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 text-slate-600 space-y-2">
                                <div className="flex justify-between">
                                    <span>Born:</span>
                                    <span className="font-medium">{formatDate(pet.birthDate)}</span>
                                </div>
                                {pet.lastVisitDate && (
                                    <div className="flex justify-between">
                                        <span>Last Visit:</span>
                                        <span className="font-medium">{formatDate(pet.lastVisitDate)}</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
          </div>

          {/* Appointments Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <span className="text-3xl">🗓️</span> Upcoming Visits
            </h2>
            
            {appointments.length === 0 ? (
                <Card className="p-12 text-center bg-slate-50/50">
                    <p className="text-slate-500 text-lg">No upcoming appointments.</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {appointments.map(apt => (
                        <Card key={apt.id} className="relative overflow-hidden border-l-4 border-l-primary-500 p-6">
                            <div className="flex justify-between items-start mb-3">
                                <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {apt.status}
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEditAppointment(apt.id)}
                                        className="p-2 text-slate-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteAppointment(apt.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                        title="Cancel"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            
                            <h4 className="text-lg font-bold text-slate-800 mb-3">
                                {formatDateTime(apt.appointmentTime)}
                            </h4>
                            
                            <div className="text-slate-600 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span>🐾</span>
                                    <span>{apt.petName || 'Unknown Pet'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span>👨‍⚕️</span>
                                    <span>{apt.doctorName || 'Assigned Doctor'}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-2">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Pet</h2>
            <form onSubmit={handleAddPet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pet Name</label>
                <Input
                    type="text"
                    placeholder="e.g. Max"
                    value={petName}
                    onChange={e => setPetName(e.target.value)}
                    required
                    className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Species</label>
                    <Input
                        type="text"
                        placeholder="e.g. Dog"
                        value={petSpecies}
                        onChange={e => setPetSpecies(e.target.value)}
                        required
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
                    <Input
                        type="text"
                        placeholder="e.g. Golden Retriever"
                        value={petBreed}
                        onChange={e => setPetBreed(e.target.value)}
                        required
                        className="w-full"
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Birth Date</label>
                <Input
                    type="date"
                    value={petBirthDate}
                    onChange={e => setPetBirthDate(e.target.value)}
                    required
                    className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit" className="btn-primary">
                    Add Pet
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
