# Samadhan - समाधान
*Your Voice, Your City*

A mobile-first civic issue reporting platform that empowers citizens to report local problems, track their resolution, and earn rewards for community engagement.

## 🚀 Features

### Core Functionality
- **Issue Reporting**: Capture photos and report civic problems with location data
- **Progress Tracking**: Monitor the status of reported issues in real-time
- **Gamification**: Earn credits for resolved issues that can be redeemed for utility payments
- **Mobile-First**: Optimized for mobile devices with native capabilities

### Mobile Capabilities (via Capacitor)
- **Camera Integration**: Native camera access for capturing issue photos
- **GPS Location**: Automatic location detection and mapping
- **Push Notifications**: Real-time updates on issue status
- **Haptic Feedback**: Enhanced mobile user experience
- **Offline Support**: Queue actions when offline, sync when connected

### User Experience
- **Onboarding Flow**: Smooth introduction to app features
- **Authentication**: Multiple login options (email, phone, social)
- **Multi-language Support**: English, Hindi, and Marathi
- **Dark/Light Mode**: Adaptive theming
- **Accessibility**: Screen reader support and keyboard navigation

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Mobile**: Capacitor for native mobile capabilities
- **State Management**: React hooks + Context API
- **Icons**: Lucide React
- **Animations**: Custom CSS animations + Tailwind

## 📱 Mobile Setup with Capacitor

This project is configured to run as a native mobile app using Capacitor.

### Prerequisites
- Node.js & npm installed
- For iOS: Xcode (macOS required)
- For Android: Android Studio

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd samadhan
   npm install
   ```

2. **Run Web Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Mobile**
   ```bash
   npm run build
   npx cap sync
   ```

4. **Add Mobile Platforms** (first time only)
   ```bash
   npx cap add ios
   npx cap add android
   ```

5. **Run on Mobile**
   ```bash
   # For iOS (requires macOS)
   npx cap run ios
   
   # For Android
   npx cap run android
   ```

### Mobile Features Integration

The app integrates these native capabilities:
- **@capacitor/camera**: Photo capture and gallery access
- **@capacitor/geolocation**: GPS location services
- **@capacitor/push-notifications**: Push notification handling
- **@capacitor/haptics**: Haptic feedback for better UX

## 🎯 Implementation Phases

Following the 8-phase development plan:

### ✅ Phase 1: Project Setup & Core UI Framework
- [x] React + Vite project setup
- [x] Capacitor mobile configuration
- [x] Core UI components with mobile optimization
- [x] Navigation structure
- [x] Design system with civic-themed colors

### ✅ Phase 2: Authentication & Onboarding
- [x] Splash screen with animations
- [x] 3-step onboarding flow
- [x] Authentication screens (email/phone)
- [x] Form validation and error handling

### 🚧 Phase 3: Main Navigation & Home Screen
- [x] Bottom tab navigation
- [x] Mobile-optimized home screen
- [x] Issue cards and list views
- [x] Floating Action Button
- [ ] Map integration (requires backend)

### 📋 Phase 4: Report Issue Flow
- [x] Multi-step reporting wizard
- [x] Camera integration
- [x] Location selection
- [x] Issue details form
- [x] Review and submit flow

### 🔄 Phase 5-8: Backend Integration (Requires Supabase)
- [ ] Authentication integration
- [ ] Database setup
- [ ] Real-time updates
- [ ] Push notifications
- [ ] Credits system
- [ ] Multi-language support

## 🔧 Backend Integration

To enable full functionality, connect to Supabase:

1. Click the Supabase button in the Lovable interface
2. Connect your Supabase project
3. Configure authentication providers
4. Set up the database schema
5. Enable real-time subscriptions

## 🌐 Deployment

### Web Deployment
The app can be deployed as a standard web application to any hosting platform.

### Mobile App Store
After testing with Capacitor, the app can be published to:
- Apple App Store (iOS)
- Google Play Store (Android)

## 🎨 Design System

The app uses a civic-themed design system:
- **Primary**: Deep blue (#1e40af) for trust and reliability
- **Accent**: Green (#059669) for success and positive actions  
- **Warning**: Orange (#ea580c) for pending states
- **Success**: Green for resolved issues
- **Semantic Colors**: All colors use HSL format for consistent theming

## 📄 License

This project is part of the Lovable platform and follows its terms of service.

---

Built with ❤️ for civic engagement and community improvement.