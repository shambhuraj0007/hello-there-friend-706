import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/authServices';

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [resendEmail, setResendEmail] = useState<string>('');
  const [resending, setResending] = useState<boolean>(false);
  const [resendResult, setResendResult] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }

    const run = async () => {
      setStatus('loading');
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email/${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || 'Verification failed');
        }
        setStatus('success');
        setMessage('Your email has been verified successfully. You can now sign in.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.message || 'Verification failed');
      }
    };

    run();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Verify Email</h1>
        {status === 'loading' && (
          <p className="text-muted-foreground">Verifying your email, please wait...</p>
        )}
        {status === 'success' && (
          <>
            <p className="text-success">{message}</p>
            <Button className="w-full" onClick={() => navigate('/')}>Go to Sign In</Button>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-destructive">{message}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="w-1/2" onClick={() => navigate('/')}>Back to Home</Button>
              <Button className="w-1/2" onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </>
        )}

        {/* Resend verification section */}
        {status !== 'success' && (
          <div className="text-left space-y-2 pt-2">
            <h2 className="text-lg font-semibold">Didn't receive the email?</h2>
            <p className="text-sm text-muted-foreground">Enter your email to resend verification.</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
              />
              <Button
                onClick={async () => {
                  try {
                    setResending(true);
                    setResendResult('');
                    await authService.resendVerification({ email: resendEmail, authMethod: 'email' });
                    setResendResult('Verification email sent successfully. Please check your inbox.');
                  } catch (err: any) {
                    setResendResult(err?.message || 'Failed to resend verification.');
                  } finally {
                    setResending(false);
                  }
                }}
                disabled={resending || !resendEmail}
              >
                {resending ? 'Sending...' : 'Resend Email'}
              </Button>
            </div>
            {resendResult && <p className="text-sm">{resendResult}</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
