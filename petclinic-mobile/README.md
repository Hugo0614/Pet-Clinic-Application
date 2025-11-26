# Pet Clinic Mobile App (React Native)

This is the native mobile application for the Pet Clinic system, built with React Native and Expo.

## Features

- 🔐 User Registration and Login (Pet Owner/Doctor)
- 🐕 Pet Management (Add, View pet information)
- 📅 Appointment Management (Create, Edit, Cancel appointments)
- 👨‍⚕️ Doctor Dashboard
- 📱 Native Mobile Experience
- 🎨 Beautiful UI Design (Consistent design language with Web app)

## Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: React Navigation 6
- **State Management**: Context API
- **HTTP Client**: Axios
- **UI Components**: Custom component library
- **Language**: TypeScript

## Installation

### 1. Install Dependencies

```bash
cd petclinic-mobile
npm install
```

### 2. Configure Backend API URL

Edit `src/services/api.ts` file and modify `API_BASE_URL`:

- **Android Emulator**: `http://10.0.2.2:8080/api`
- **iOS Simulator**: `http://localhost:8080/api`
- **Physical Device**: `http://YOUR_IP:8080/api` (Replace YOUR_IP with your computer's IP address)

### 3. Start the App

```bash
# Start Expo development server
npm start

# Or run directly on Android
npm run android

# Or run directly on iOS
npm run ios
```

### 4. Test with Expo Go

1. Install Expo Go app on your phone
2. Scan the QR code displayed in terminal
3. The app will open in Expo Go

## Project Structure

```
petclinic-mobile/
├── src/
│   ├── components/        # UI Components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── screens/          # Screen Components
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── OwnerDashboardScreen.tsx
│   ├── navigation/       # Navigation Configuration
│   │   └── AppNavigator.tsx
│   ├── context/          # Context State
│   │   └── AuthContext.tsx
│   ├── services/         # API Services
│   │   ├── api.ts
│   │   └── authService.ts
│   └── utils/            # Utility Functions
│       └── theme.ts      # Theme Configuration
├── App.tsx               # App Entry Point
├── package.json
└── README.md
```

## Theme Colors

The app uses the same color scheme as the Web app:

- **Primary**: Indigo
- **Secondary**: Pink
- **Accent**: Orange
- **Neutral**: Slate

## API Integration

The app communicates with the Spring Boot backend via RESTful API:

- `/api/auth/login` - Login
- `/api/auth/register` - Register
- `/api/pets` - Pet Management
- `/api/appointments` - Appointment Management

Authentication uses JWT Token, automatically stored in AsyncStorage.

## Development Notes

### Adding New Screens

1. Create new screen component in `src/screens/`
2. Add route in `src/navigation/AppNavigator.tsx`
3. Update related navigation links

### Customizing Theme

Edit `src/utils/theme.ts` to modify colors, spacing, fonts, etc.

### Debugging

- Use `console.log()` to view logs
- Shake device to open developer menu
- Use React Native Debugger

## Building Production Version

```bash
# Build Android APK
eas build --platform android

# Build iOS IPA
eas build --platform ios
```

Note: Requires Expo Application Services (EAS) account setup.

## Troubleshooting

### 1. Cannot connect to backend

- Ensure backend service is running
- Check API address configuration is correct
- Android emulator uses `10.0.2.2` instead of `localhost`

### 2. Expo Go cannot open app

- Ensure phone and computer are on the same network
- Try restarting Expo server
- Check firewall settings

## Related Links

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
