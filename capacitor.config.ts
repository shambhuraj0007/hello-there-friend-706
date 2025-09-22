import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.378f110b46a64bf889c2838f4e8d8835',
  appName: 'Samadhan',
  webDir: 'dist',
  server: {
    url: 'https://378f110b-46a6-4bf8-89c2-838f4e8d8835.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;