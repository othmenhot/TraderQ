import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { cn } from '../lib/utils';
import heroImage from '../assets/hero.png';
import { Map, Gamepad, LineChart, Book, Users, Award, UserPlus, BarChart, CheckCircle, Quote, XCircle, BrainCircuit } from 'lucide-react';
import SectionDivider from '../components/ui/SectionDivider';

const features = [
  { title: 'Roadmap & Lessons', description: 'Follow a structured, visual roadmap designed by trading experts.', icon: Map, imagePlaceholder: 'A stylized roadmap with interconnected nodes.' },
  { title: 'Gamified Experience', description: 'Earn XP, level up, and unlock badges as you master new skills.', icon: Gamepad, imagePlaceholder: 'A user profile showing XP bar, level, and badges.' },
  { title: 'Trading Simulator', description: 'Apply your knowledge in a real-time simulator without risking capital.', icon: LineChart, imagePlaceholder: 'A realistic trading interface with charts and order books.' },
  { title: 'Comprehensive Journal', description: 'Keep a detailed journal of your trades to analyze and improve performance.', icon: Book, imagePlaceholder: 'A digital journal with trade entries and performance analytics.' },
  { title: 'Engaged Community', description: 'Join a vibrant community, share insights, and learn with fellow traders.', icon: Users, imagePlaceholder: 'A forum-like interface with user discussions.' },
  { title: 'AI-Powered Insights', description: 'Receive AI-driven feedback on your trades to accelerate your learning curve.', icon: BrainCircuit, imagePlaceholder: "An AI assistant providing feedback on a user's trade." },
];

const howItWorksSteps = [
  { title: 'Create Your Account', description: 'Sign up in seconds. No credit card required to start.', icon: UserPlus },
  { title: 'Follow the Path', description: 'Start with the basics and unlock advanced modules with XP.', icon: Map },
  { title: 'Practice & Analyze', description: 'Use the simulator and journal to hone your skills.', icon: BarChart },
  { title: 'Achieve Mastery', description: 'Earn badges and become a confident, data-driven trader.', icon: Award },
];

const testimonials = [
  { name: 'Alex T.', role: 'Day Trader', quote: "Trader Quest transformed my understanding of the market. The gamified approach makes learning addictive and fun!" },
  { name: 'Jessica M.', role: 'Swing Trading Student', quote: "The simulator is a game-changer. I could practice my strategies risk-free until I was confident enough to trade live." },
  { name: 'David R.', role: 'New Investor', quote: "I was a complete beginner, and the roadmap gave me the clear, step-by-step guidance I desperately needed." },
];

const HomePage = () => {
  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-20 pb-10 md:pb-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 animate-fade-in">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-6 text-foreground">
              Embark on Your Trading Odyssey.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl md:mx-0 mx-auto mb-10">
              Uncover the secrets of the markets, master advanced strategies, and forge your path to financial freedom.
            </p>
            <Button asChild size="lg">
              <Link to="/register">Start Your Journey</Link>
            </Button>
          </div>
          <div className="hidden md:block md:w-1/2 mt-16 md:mt-0">
            <img 
              src={heroImage} 
              alt="Trader Quest Hero Illustration" 
              className="w-full h-auto scale-75"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 2. Features Overview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground">All the Tools You Need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <feature.icon className="h-12 w-12 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 3. How It Works Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">Your Path to Mastery in 4 Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                  <step.icon className="h-8 w-8" strokeWidth={1.5}/>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Grid Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">Dive Deeper into Every Aspect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <Card key={index} className="text-center animate-fade-in">
                <CardContent className="p-8 space-y-4">
                  <div className="h-48 bg-secondary rounded-md flex flex-col items-center justify-center p-4">
                    <feature.icon className="h-16 w-16 text-muted-foreground/50 mb-4" strokeWidth={1.5} />
                    <p className="text-muted-foreground text-sm italic">{feature.imagePlaceholder}</p>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* 5. Pricing Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">Choose Your Path</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">Start for free and upgrade when you're ready to go pro.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Guest Pass</CardTitle>
                <CardDescription>Perfect for beginners to get started.</CardDescription>
                <p className="text-4xl font-bold pt-4">Free</p>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500"/>Access to Foundational Modules</p>
                <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500"/>Earn XP and Level Up</p>
                <p className="flex items-center text-muted-foreground"><XCircle className="h-4 w-4 mr-2"/>Trading Simulator</p>
                <p className="flex items-center text-muted-foreground"><XCircle className="h-4 w-4 mr-2"/>Advanced Analytics</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/register">Start for Free</Link>
                </Button>
              </div>
            </Card>
            <Card className="border-primary flex flex-col">
              <CardHeader>
                <CardTitle>Pro Trader</CardTitle>
                <CardDescription>For serious learners aiming for mastery.</CardDescription>
                <p className="text-4xl font-bold pt-4">$19<span className="text-lg text-muted-foreground">/month</span></p>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500"/>Access to All Content</p>
                <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500"/>Unlimited Trading Simulator</p>
                <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500"/>Comprehensive Trading Journal</p>
                <p className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500"/>Community Access</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild size="lg">
                  <Link to="/register">Go Pro</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Social Proof Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">Don't Just Take Our Word For It</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <CardContent className="p-6 flex-grow">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call to Action Section */}
      <section className="py-20 text-center bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Become the Trader You've Always Dreamed of Being.</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Stop guessing. Learn with a proven path that builds your skills, confidence, and consistency. Your first module is free.
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-lg">
            <Link to="/register">Start Your Quest &gt;</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
