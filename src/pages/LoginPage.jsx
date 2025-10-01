import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmailAndPassword, signInWithGoogle, signInAsGuest } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C42.47 39.19 46.98 32.61 46.98 24.55z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await loginWithEmailAndPassword(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google.');
      console.error(err);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    try {
      await signInAsGuest();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in as a guest.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary">Log In</h1>
        
        {error && <p className="text-destructive text-center">{error}</p>}

        <div className="space-y-4">
          <Button variant="secondary" className="w-full" onClick={handleGoogleLogin}>
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
            Continue as Guest
          </Button>
        </div>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs text-muted-foreground">OR CONTINUE WITH EMAIL</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email Address</label>
            <Input 
              id="email"
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">Password</label>
            <Input 
              id="password"
              type="password" 
              placeholder="********" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="mt-2"
            />
          </div>

          <Button type="submit" className="w-full">
            Log In with Email
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
