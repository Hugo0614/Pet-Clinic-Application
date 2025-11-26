import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface MedicalRecord {
  id: number;
  visitDate: string;
  diagnosis: string;
  prescription: string;
  petId: number;
  appointmentId: number;
}

const PetMedicalHistoryPage: React.FC = () => {
  const { petId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [error, setError] = useState('');

  // Get appointment data from navigation state
  const appointmentData = location.state as { appointmentId?: number; appointmentDate?: string } | null;

  useEffect(() => {
    api.get(`/medical-records/pet/${petId}`).then(res => setRecords(res.data));
    
    // Auto-populate appointment data if available
    if (appointmentData) {
      if (appointmentData.appointmentId) {
        setAppointmentId(appointmentData.appointmentId.toString());
      }
      if (appointmentData.appointmentDate) {
        // Convert ISO datetime to date format (YYYY-MM-DD)
        const date = new Date(appointmentData.appointmentDate);
        const dateStr = date.toISOString().split('T')[0];
        setVisitDate(dateStr);
      }
    }
  }, [petId, appointmentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/medical-records', {
        visitDate,
        diagnosis,
        prescription,
        petId: Number(petId),
        appointmentId: Number(appointmentId),
      });
      setDiagnosis('');
      setPrescription('');
      setVisitDate('');
      setAppointmentId('');
      api.get(`/medical-records/pet/${petId}`).then(res => setRecords(res.data));
    } catch (err) {
      setError('Failed to add medical record');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - with proper spacing from navbar */}
        <div className="mb-10">
          <Button 
            onClick={() => navigate('/doctor')} 
            variant="outline"
            className="mb-6 flex items-center gap-2"
          >
            <span>←</span> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Medical History</h1>
          <p className="text-slate-500 text-lg">Pet ID: {petId}</p>
        </div>

        {/* Existing Records Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Previous Records</h2>
          {records.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-slate-500 text-lg">No medical records found for this pet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map(record => (
                <Card key={record.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary-500">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="text-lg">📅</span>
                      <span className="font-semibold">Date:</span>
                      <span>{new Date(record.visitDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <span className="text-lg">🩺</span>
                      <div>
                        <span className="font-semibold">Diagnosis:</span>
                        <p className="mt-1">{record.diagnosis}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <span className="text-lg">💊</span>
                      <div>
                        <span className="font-semibold">Prescription:</span>
                        <p className="mt-1">{record.prescription}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 pt-2 border-t">
                      Appointment ID: {record.appointmentId}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add New Record Section */}
        <Card className="max-w-3xl mx-auto p-8 border-t-4 border-t-secondary-500">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Medical Record</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visit Date - Auto-populated and read-only if from appointment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visit Date {appointmentData?.appointmentDate && <span className="text-green-600">(Auto-filled)</span>}
                </label>
                <Input
                  type="date"
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  required
                  disabled={!!appointmentData?.appointmentDate}
                  className={appointmentData?.appointmentDate ? 'bg-slate-100 cursor-not-allowed' : ''}
                />
              </div>

              {/* Appointment ID - Auto-populated and read-only if from appointment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Appointment ID {appointmentData?.appointmentId && <span className="text-green-600">(Auto-filled)</span>}
                </label>
                <Input
                  type="number"
                  value={appointmentId}
                  onChange={e => setAppointmentId(e.target.value)}
                  required
                  disabled={!!appointmentData?.appointmentId}
                  className={appointmentData?.appointmentId ? 'bg-slate-100 cursor-not-allowed' : ''}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Diagnosis
              </label>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                placeholder="Enter diagnosis details..."
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prescription
              </label>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                placeholder="Enter prescription details..."
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-500 text-sm rounded-lg flex items-center gap-3">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/doctor')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Save Medical Record
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PetMedicalHistoryPage;
