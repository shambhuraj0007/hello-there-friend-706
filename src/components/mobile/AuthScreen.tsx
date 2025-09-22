import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Phone, Mail } from 'lucide-react';
import { useCapacitor } from '@/hooks/useCapacitor';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'phone'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const { hapticFeedback } = useCapacitor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await hapticFeedback();
    // Here you would integrate with Supabase authentication
    onLogin();
  };

  const switchMode = async (mode: typeof authMode) => {
    await hapticFeedback();
    setAuthMode(mode);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">समाधान</h1>
        <p className="text-muted-foreground">Your Voice, Your City</p>
      </div>

      {/* Auth Form */}
      <div className="flex-1 px-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">
                {authMode === 'login' && 'Welcome Back'}
                {authMode === 'signup' && 'Create Account'}
                {authMode === 'phone' && 'Phone Login'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {authMode === 'login' && 'Sign in to continue reporting issues'}
                {authMode === 'signup' && 'Join the community of active citizens'}
                {authMode === 'phone' && 'Enter your phone number to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              {authMode !== 'phone' ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              )}

              {authMode !== 'phone' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full text-lg h-12" size="lg">
                {authMode === 'login' && 'Sign In'}
                {authMode === 'signup' && 'Create Account'}
                {authMode === 'phone' && 'Send OTP'}
              </Button>
            </form>

            {/* Auth Mode Switcher */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => switchMode(authMode === 'phone' ? 'login' : 'phone')}
                >
                  {authMode === 'phone' ? (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Login
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Phone Login
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => switchMode(authMode === 'signup' ? 'login' : 'signup')}
                >
                  {authMode === 'signup' 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};