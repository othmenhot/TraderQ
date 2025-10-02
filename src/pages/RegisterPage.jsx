import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmailAndPassword, signInWithGoogle } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// A simple Google Icon component
const GoogleIcon = (props) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await registerWithEmailAndPassword(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else {
        setError('An error occurred during registration.');
      }
      console.error(err);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign up with Google.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary">Create an Account</h1>
        
        {error && <p className="text-destructive text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (Input fields remain the same) ... */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email Address</label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">Password</label>
            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2"/>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground">Confirm Password</label>
            <Input id="confirmPassword" type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-2"/>
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        {/* Google Sign Up Button */}
        <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
          <GoogleIcon className="mr-2 h-5 w-5" />
          Sign Up with Google
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
