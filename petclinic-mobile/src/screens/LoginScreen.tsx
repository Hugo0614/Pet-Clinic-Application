import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const data = await loginService(username, password);
      login(data.token, { username: data.username, role: data.role });
    } catch (error: any) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🐕</Text>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to access your account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerTextBold}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 80,
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
  loginButton: {
    marginTop: spacing.md,
  },
  registerLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  registerText: {
    fontSize: fontSize.base,
    color: colors.slate[600],
  },
  registerTextBold: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});

export default LoginScreen;
