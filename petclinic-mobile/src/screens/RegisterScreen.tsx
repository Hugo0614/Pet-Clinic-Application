import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { register as registerService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'OWNER' | 'DOCTOR'>('OWNER');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    // Validation
    if (!username || !password || !email || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await registerService({
        username,
        password,
        email,
        phone,
        role,
      });
      login(data.token, { username: data.username, role: data.role });
      Alert.alert('Success', 'Registration successful!');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🐾</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Pet Clinic family</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Username *"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          
          <Input
            label="Email *"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Phone *"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Role *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue: 'OWNER' | 'DOCTOR') => setRole(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Select Role" value="" enabled={false} />
                <Picker.Item label="🐾 Pet Owner" value="OWNER" />
                <Picker.Item label="👨‍⚕️ Doctor" value="DOCTOR" />
              </Picker>
            </View>
            <Text style={styles.selectedRole}>
              Selected: {role === 'OWNER' ? '🐾 Pet Owner' : role === 'DOCTOR' ? '👨‍⚕️ Doctor' : 'None'}
            </Text>
          </View>
          
          <Input
            label="Password *"
            placeholder="Enter password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Input
            label="Confirm Password *"
            placeholder="Enter password again"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.slate[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.slate[600],
  },
  form: {
    width: '100%',
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.slate[700],
    marginBottom: spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    fontSize: fontSize.base,
    height: 120,
  },
  selectedRole: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: '600',
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
});

export default RegisterScreen;
