import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

const HomeScreen = ({ navigation }: any) => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: '🐕',
      title: 'Pet Management',
      description: 'Easily manage your pet information and health records',
      color: colors.primary[500],
    },
    {
      icon: '📅',
      title: 'Appointments',
      description: 'Book appointments online, save time',
      color: colors.secondary[500],
    },
    {
      icon: '👨‍⚕️',
      title: 'Expert Doctors',
      description: 'Experienced veterinarians at your service',
      color: colors.accent[500],
    },
    {
      icon: '📋',
      title: 'Medical Records',
      description: 'Complete medical history, access anytime',
      color: colors.primary[600],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🏥</Text>
        <Text style={styles.heroTitle}>Pet Clinic</Text>
        <Text style={styles.heroSubtitle}>
          {user ? `Welcome, ${user.username}!` : 'Your Pet Health Partner'}
        </Text>
        
        {!user && (
          <View style={styles.ctaButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                <Text style={styles.featureEmoji}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Our Achievements</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Pet Owners</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Expert Doctors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100K+</Text>
            <Text style={styles.statLabel}>Treatments</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  hero: {
    backgroundColor: colors.primary[500],
    padding: spacing.xxl,
    paddingTop: spacing.xxl * 1.5,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.lg,
    color: colors.primary[100],
    marginBottom: spacing.xl,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  primaryButtonText: {
    color: colors.primary[600],
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.slate[900],
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.slate[900],
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fontSize.sm,
    color: colors.slate[600],
    lineHeight: 20,
  },
  statsSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    ...shadows.medium,
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.slate[600],
  },
});

export default HomeScreen;
