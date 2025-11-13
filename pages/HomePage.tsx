
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowRight, Zap, ShieldCheck, Package } from 'lucide-react';

// A simple SVG illustration component
const DeliveryIllustration = () => (
    <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="300" fill="#EBF4FF"/>
        <path d="M50,250 C150,200 350,200 450,250" stroke="#1E3A8A" strokeWidth="4" fill="none" />
        <circle cx="120" cy="250" r="20" fill="#F97316" />
        <circle cx="380" cy="250" r="20" fill="#F97316" />
        <rect x="90" y="150" width="320" height="100" rx="10" fill="#2563EB" />
        <rect x="180" y="100" width="140" height="50" rx="10" fill="#FFFFFF" />
        <path d="M200,125 h100" stroke="#1E3A8A" strokeWidth="3" />
        <path d="M110,180 l50,-30" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M130,190 l50,-30" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M150,200 l50,-30" stroke="#FFFFFF" strokeWidth="3" />
    </svg>
);


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
        <div className="text-primary inline-block bg-orange-100 p-3 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-secondary mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-secondary mb-4">
                Fast, Reliable, <span className="text-primary">Smart</span> Deliveries.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Smart Porter is your AI-powered partner for local deliveries. Get anything delivered, anytime, with real-time tracking and intelligent support.
            </p>
            <div className="flex justify-center items-center space-x-4">
                <Link to="/dashboard">
                    <Button size="lg" className="flex items-center gap-2">
                        Book a Delivery <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
                <Link to="/register">
                    <Button size="lg" variant="secondary">
                        Become a Rider
                    </Button>
                </Link>
            </div>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
            <DeliveryIllustration />
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-4xl font-bold text-secondary mb-2">Why Choose Smart Porter?</h2>
        <p className="text-gray-600 mb-12">We leverage technology to make your life easier.</p>
        <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Zap size={28} />}
                title="AI-Powered Efficiency"
                description="Our AI helps you describe items instantly and optimizes routes for the fastest delivery."
            />
            <FeatureCard 
                icon={<Package size={28} />}
                title="Real-Time Tracking"
                description="Watch your delivery move on the map from pickup to drop-off. Never lose sight of your package."
            />
            <FeatureCard 
                icon={<ShieldCheck size={28} />}
                title="Secure & Reliable"
                description="All our riders are verified. Your items are insured and handled with the utmost care."
            />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
