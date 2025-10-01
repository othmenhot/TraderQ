import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmailAndPassword } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary">Create an Account</h1>
        
        {error && <p className="text-destructive text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground">Confirm Password</label>
            <Input 
              id="confirmPassword"
              type="password" 
              placeholder="********" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className="mt-2"
            />
          </div>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>

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
