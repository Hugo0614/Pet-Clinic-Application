import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../utils/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OwnerDashboardScreen from '../screens/OwnerDashboardScreen';
// import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Owner Tab Navigation
const OwnerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.slate[400],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.slate[200],
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={OwnerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'About',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

// Doctor Tab Navigation
const DoctorTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.slate[400],
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen} // Temporarily using HomeScreen
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null; // Or return a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary[500],
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!user ? (
          // Not logged in
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
          </>
        ) : user.role === 'OWNER' ? (
          // Owner logged in
          <Stack.Screen
            name="OwnerTabs"
            component={OwnerTabs}
            options={{ headerShown: false }}
          />
        ) : (
          // Doctor logged in
          <Stack.Screen
            name="DoctorTabs"
            component={DoctorTabs}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
