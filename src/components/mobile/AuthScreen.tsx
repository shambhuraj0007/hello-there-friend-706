import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Phone, Mail, User, Lock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { authService } from '@/services/authServices';
import { toast } from '@/components/ui/use-toast';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'phone' | 'verify-phone'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    verificationCode: ''
  });
  const { hapticFeedback } = useCapacitor();
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    }
  }, [formData.password]);

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'password':
        if (value && value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
      case 'name':
        if (value && value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await hapticFeedback();
    
    // Final validation
    if (Object.keys(validationErrors).length > 0) {
      toast({ 
        title: 'Please fix the errors', 
        description: 'Check the form for validation errors',
        variant: 'destructive' 
      });
      return;
    }

    try {
      setSubmitting(true);
      
      if (authMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          toast({ title: 'Passwords do not match', variant: 'destructive' });
          return;
        }
        
        const res = await authService.register({
          authMethod: 'email',
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        
        toast({ 
          title: '🎉 Registration Successful!', 
          description: 'Please check your email to verify your account.',
          duration: 5000
        });
        setAuthMode('login');
        
      } else if (authMode === 'login') {
        const res = await authService.login({
          authMethod: 'email',
          email: formData.email,
          password: formData.password,
        });
        
        if (res?.success) {
          toast({ 
            title: '✅ Welcome back!', 
            description: 'You have been signed in successfully.' 
          });
          onLogin();
        }
        
      } else if (authMode === 'phone') {
        const res = await authService.login({ 
          authMethod: 'phone', 
          phone: formData.phone 
        });
        
        if (res?.needsVerification) {
          toast({ 
            title: '📱 Verification Code Sent', 
            description: 'Please check your phone for the verification code.' 
          });
          setAuthMode('verify-phone');
        } else if (res?.success) {
          toast({ title: '✅ Signed in successfully!' });
          onLogin();
        }
        
      } else if (authMode === 'verify-phone') {
        const res = await authService.verifyPhone({
          phone: formData.phone,
          code: formData.verificationCode
        });
        
        if (res?.success) {
          toast({ title: '✅ Phone verified successfully!' });
          onLogin();
        }
      }
    } catch (err: any) {
      toast({ 
        title: '❌ Authentication Failed', 
        description: err?.message || 'Please try again', 
        variant: 'destructive' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = async (mode: typeof authMode) => {
    await hapticFeedback();
    setAuthMode(mode);
    setValidationErrors({});
    setFormData({
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      name: '',
      verificationCode: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Enhanced Header */}
      <div className="text-center pt-12 pb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-b-[3rem]" />
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">स</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            समाधान
          </h1>
          <p className="text-muted-foreground font-medium">Your Voice, Your City</p>
          <Badge variant="secondary" className="mt-2 text-xs">
            Building Better Communities Together
          </Badge>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 px-6 -mt-4">
        <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Mode Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                {authMode === 'login' && <Shield className="h-6 w-6 text-primary" />}
                {authMode === 'signup' && <User className="h-6 w-6 text-primary" />}
                {(authMode === 'phone' || authMode === 'verify-phone') && <Phone className="h-6 w-6 text-primary" />}
                
                <h2 className="text-2xl font-bold text-gray-900">
                  {authMode === 'login' && 'Welcome Back'}
                  {authMode === 'signup' && 'Join Our Community'}
                  {authMode === 'phone' && 'Phone Sign In'}
                  {authMode === 'verify-phone' && 'Verify Your Phone'}
                </h2>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {authMode === 'login' && 'Sign in to continue reporting civic issues and making a difference'}
                {authMode === 'signup' && 'Create your account to join thousands of active citizens'}
                {authMode === 'phone' && 'Enter your phone number for quick and secure access'}
                {authMode === 'verify-phone' && 'We sent a 6-digit code to your phone number'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field - Signup */}
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`h-12 transition-all duration-200 ${validationErrors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              {authMode !== 'phone' && authMode !== 'verify-phone' && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`h-12 transition-all duration-200 ${validationErrors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              )}

              {/* Phone Field */}
              {(authMode === 'phone' || authMode === 'verify-phone') && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`h-12 transition-all duration-200 ${validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                    disabled={authMode === 'verify-phone'}
                    required
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Verification Code Field */}
              {authMode === 'verify-phone' && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verification Code *
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.verificationCode}
                    onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                    className="h-12 text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Didn't receive the code? <button type="button" className="text-primary hover:underline">Resend</button>
                  </p>
                </div>
              )}

              {/* Password Field */}
              {authMode !== 'phone' && authMode !== 'verify-phone' && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`h-12 pr-12 transition-all duration-200 ${validationErrors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {authMode === 'signup' && formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Confirm Password Field */}
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`h-12 pr-12 transition-all duration-200 ${validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                  {formData.confirmPassword && !validationErrors.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-green-500 text-xs flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full text-lg h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                size="lg" 
                disabled={submitting || Object.keys(validationErrors).length > 0}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {authMode === 'login' && '🔐 Sign In'}
                    {authMode === 'signup' && '🚀 Create Account'}
                    {authMode === 'phone' && '📱 Send Code'}
                    {authMode === 'verify-phone' && '✅ Verify & Sign In'}
                  </>
                )}
              </Button>
            </form>

            {/* Auth Mode Switcher */}
            {authMode !== 'verify-phone' && (
              <div className="space-y-4 pt-2">
                <Separator className="my-4" />
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-dashed hover:border-solid transition-all duration-200"
                    onClick={() => switchMode(authMode === 'phone' ? 'login' : 'phone')}
                  >
                    {authMode === 'phone' ? (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Sign In
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4" />
                        Phone Sign In
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 underline-offset-4 hover:underline"
                    onClick={() => switchMode(authMode === 'signup' ? 'login' : 'signup')}
                  >
                    {authMode === 'signup' 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Create one"}
                  </button>
                </div>
              </div>
            )}

            {/* Back Button for Verify Phone */}
            {authMode === 'verify-phone' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => switchMode('phone')}
                >
                  ← Change phone number
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Enhanced Footer */}
      <div className="p-6 text-center">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <button className="text-primary hover:underline">Terms of Service</button>{' '}
            and{' '}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
