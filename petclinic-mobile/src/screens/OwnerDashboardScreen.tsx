import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

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
  petName?: string;
  doctorName?: string;
}

const OwnerDashboardScreen = ({ navigation }: any) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [petsRes, appointmentsRes] = await Promise.all([
        api.get('/pets'),
        api.get('/appointments'),
      ]);
      setPets(petsRes.data);
      
      // Only show upcoming appointments
      const now = new Date();
      const upcoming = appointmentsRes.data.filter(
        (apt: Appointment) => new Date(apt.appointmentTime) >= now
      );
      setAppointments(upcoming);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await api.delete(`/appointments/${appointmentId}`);
              loadData();
              Alert.alert('Success', 'Appointment cancelled');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Pet Clinic</Text>
        <Text style={styles.subtitle}>Manage your pets and appointments</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Button
          title="📅 Book Appointment"
          onPress={() => navigation.navigate('ScheduleAppointment')}
          size="large"
        />
      </View>

      {/* Pets Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Pets ({pets.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No pets added yet</Text>
            <Text style={styles.emptySubtext}>Click "Add" button above to add your pet</Text>
          </Card>
        ) : (
          pets.map((pet) => (
            <Card key={pet.id}>
              <View style={styles.petCard}>
                <View style={styles.petIcon}>
                  <Text style={styles.petEmoji}>
                    {pet.species.toLowerCase().includes('dog') ? '🐕' : '🐈'}
                  </Text>
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petDetails}>
                    {pet.species} · {pet.breed}
                  </Text>
                  <Text style={styles.petDetails}>
                    Birth Date: {formatDate(pet.birthDate)}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Appointments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments ({appointments.length})</Text>
        
        {appointments.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No appointments</Text>
            <Text style={styles.emptySubtext}>Click the button above to book an appointment</Text>
          </Card>
        ) : (
          appointments.map((apt) => (
            <Card key={apt.id}>
              <View style={styles.appointmentHeader}>
                <View>
                  <Text style={styles.appointmentTime}>
                    {formatDateTime(apt.appointmentTime)}
                  </Text>
                  <Text style={styles.appointmentDetails}>
                    Pet: {apt.petName || 'Unknown'}
                  </Text>
                  <Text style={styles.appointmentDetails}>
                    Doctor: {apt.doctorName || 'Unknown'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: colors.primary[100] }]}>
                  <Text style={[styles.statusText, { color: colors.primary[700] }]}>
                    {apt.status}
                  </Text>
                </View>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('EditAppointment', { appointmentId: apt.id })}
                >
                  <Text style={styles.actionButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteAppointment(apt.id)}
                >
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Cancel</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  header: {
    backgroundColor: colors.primary[500],
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.primary[100],
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.slate[900],
  },
  addButton: {
    fontSize: fontSize.base,
    color: colors.primary[600],
    fontWeight: '600',
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.slate[600],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.slate[400],
    textAlign: 'center',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  petEmoji: {
    fontSize: 32,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.slate[900],
    marginBottom: spacing.xs,
  },
  petDetails: {
    fontSize: fontSize.sm,
    color: colors.slate[600],
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  appointmentTime: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.slate[900],
    marginBottom: spacing.xs,
  },
  appointmentDetails: {
    fontSize: fontSize.sm,
    color: colors.slate[600],
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    height: 28,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.slate[100],
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    color: colors.slate[700],
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error + '15',
  },
  deleteButtonText: {
    color: colors.error,
  },
});

export default OwnerDashboardScreen;
