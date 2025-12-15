import React, { useState } from 'react';
import { Menu, X, Check, Instagram, Twitter, Facebook, ArrowRight, Star } from 'lucide-react';
import { Button } from './components/Button';
import { SectionTitle } from './components/SectionTitle';
import { AIWorkoutGenerator } from './components/AIWorkoutGenerator';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'AI Trainer', href: '#ai-trainer' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-gray-100 font-sans selection:bg-brand-accent selection:text-brand-dark">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tighter text-white">
            APEX<span className="text-brand-accent">PERFORMANCE</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-sm font-semibold uppercase tracking-wider text-gray-300 hover:text-brand-accent transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-surface border-t border-gray-800 absolute w-full p-6 flex flex-col gap-4 shadow-2xl">
            {navigation.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-lg font-semibold text-white hover:text-brand-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
             <Button fullWidth onClick={() => {
               setIsMenuOpen(false);
               document.getElementById('contact')?.scrollIntoView();
             }}>
              Start Now
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop" 
            alt="Gym Background" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded border border-brand-accent text-brand-accent text-sm font-bold uppercase tracking-[0.2em] mb-6 animate-pulse">
            Accepting New Clients for Oct 2025
          </span>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-white uppercase leading-none mb-6 tracking-tight">
            Redefine Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">Limits</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Elite personal training tailored to your physiology and goals. 
            Stop guessing, start transforming.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={() => document.getElementById('ai-trainer')?.scrollIntoView({ behavior: 'smooth' })}>
              Try AI Generator Free
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              View Programs
            </Button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 bg-brand-dark">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 relative">
               <div className="absolute -inset-4 bg-brand-accent/20 rounded-lg transform rotate-3"></div>
               <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                alt="Trainer" 
                className="relative rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-500 w-full object-cover aspect-[3/4]"
              />
            </div>
            <div className="md:w-1/2">
              <SectionTitle subtitle="About Me" title="More Than Just A Trainer" center={false} />
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                I'm Alex "Apex" Mercer. With over 10 years of experience coaching professional athletes and busy executives, 
                I believe fitness isn't just about the hour you spend in the gym—it's about building a lifestyle 
                that fuels your ambition.
              </p>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                My methodology combines data-driven strength training, metabolic conditioning, and sustainable nutrition 
                strategies. No fad diets. No burnout workouts. Just results.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-brand-accent pl-4">
                  <h4 className="font-display text-3xl font-bold text-white">500+</h4>
                  <p className="text-gray-500 uppercase text-sm font-semibold">Clients Transformed</p>
                </div>
                <div className="border-l-4 border-brand-accent pl-4">
                  <h4 className="font-display text-3xl font-bold text-white">10yr</h4>
                  <p className="text-gray-500 uppercase text-sm font-semibold">Industry Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-brand-surface">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Programs" title="Choose Your Path" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "1-on-1 Training",
                price: "$120",
                period: "/session",
                features: ["Customized Workout Plan", "Real-time Form Correction", "Nutrition Guidance", "24/7 Support"]
              },
              {
                title: "Online Coaching",
                price: "$250",
                period: "/month",
                recommended: true,
                features: ["App-Based Programming", "Weekly Check-ins", "Video Form Analysis", "Macro/Meal Planning"]
              },
              {
                title: "Hybrid Model",
                price: "$400",
                period: "/month",
                features: ["2 In-Person Sessions/mo", "Full Online Access", "Advanced Metrics Tracking", "Priority Scheduling"]
              }
            ].map((plan, index) => (
              <div key={index} className={`relative p-8 rounded-2xl transition-transform duration-300 hover:-translate-y-2 flex flex-col ${plan.recommended ? 'bg-white text-brand-dark' : 'bg-brand-dark border border-gray-800'}`}>
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold uppercase mb-4">{plan.title}</h3>
                <div className="flex items-end mb-6">
                  <span className={`text-4xl font-bold ${plan.recommended ? 'text-brand-dark' : 'text-white'}`}>{plan.price}</span>
                  <span className={`text-sm mb-1 ml-1 ${plan.recommended ? 'text-gray-600' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className={plan.recommended ? 'text-brand-accent' : 'text-brand-accent'} />
                      <span className={plan.recommended ? 'text-gray-700' : 'text-gray-400'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.recommended ? 'primary' : 'outline'} fullWidth>
                  Select Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Trainer Section */}
      <AIWorkoutGenerator />

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-brand-dark">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Success Stories" title="Real Results" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Marketing Director",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                text: "I was skeptical about online coaching, but Alex's app and weekly check-ins kept me more accountable than any in-person trainer I've had. Down 20lbs!"
              },
              {
                name: "Marcus Thorne",
                role: "Software Engineer",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "The science-based approach is exactly what I needed. No guesswork, just a clear plan that fits my schedule. My lifts have gone up significantly."
              },
              {
                name: "Elena Rodriguez",
                role: "Teacher",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                text: "Apex Performance changed my relationship with food and exercise. It's sustainable. I feel stronger and more energetic than ever."
              }
            ].map((t, i) => (
              <div key={i} className="bg-brand-surface p-8 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full border-2 border-brand-accent" />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="flex mb-4 text-brand-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-400 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 bg-brand-accent text-brand-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-8">Ready to Dominate?</h2>
          <p className="text-xl md:text-2xl font-semibold max-w-2xl mx-auto mb-12 opacity-80">
            Spaces are limited. Book your free consultation call today and take the first step towards your peak potential.
          </p>
          
          <div className="max-w-md mx-auto bg-white p-2 rounded-full shadow-2xl flex pl-6">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
            />
            <button className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors flex items-center gap-2">
              Join Now <ArrowRight size={18} />
            </button>
          </div>
          <p className="mt-4 text-sm font-semibold opacity-60">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <a href="#" className="font-display text-2xl font-bold tracking-tighter text-white">
              APEX<span className="text-brand-accent">PERFORMANCE</span>
            </a>
            <p className="text-gray-500 text-sm mt-2">© 2024 Apex Performance Training. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors"><Instagram size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors"><Twitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors"><Facebook size={24} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
