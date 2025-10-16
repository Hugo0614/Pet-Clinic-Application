import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/medical-records/pet/${petId}`).then(res => setRecords(res.data));
  }, [petId]);

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Medical History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {records.map(record => (
          <Card key={record.id}>
            <div>Date: {record.visitDate}</div>
            <div>Diagnosis: {record.diagnosis}</div>
            <div>Prescription: {record.prescription}</div>
          </Card>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-4">Add Medical Record</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <Input
          type="date"
          placeholder="Visit Date"
          value={visitDate}
          onChange={e => setVisitDate(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Prescription"
          value={prescription}
          onChange={e => setPrescription(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={e => setAppointmentId(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit">Add Record</Button>
      </form>
    </div>
  );
};

export default PetMedicalHistoryPage;
