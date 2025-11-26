import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (user?.role === 'OWNER') {
      navigate('/owner');
    } else if (user?.role === 'DOCTOR') {
      navigate('/doctor');
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white pb-20 pt-20 lg:pt-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left z-10 animate-fade-in-up">
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary-600 uppercase bg-primary-100 rounded-full">
                Professional Pet Care
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                We Care for Your <br />
                <span className="text-primary-500 relative inline-block">
                  Little Friends
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary-400 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A modern platform for pet owners and doctors to manage pets, appointments, and medical records with ease and love.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <button 
                    onClick={handleGoToDashboard}
                    className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-200 hover:shadow-2xl hover:-translate-y-1"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate('/register')}
                      className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-200 hover:shadow-2xl hover:-translate-y-1"
                    >
                      Get Started
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="btn-secondary text-lg px-8 py-4"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Illustration */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              <div className="relative animate-float">
                {/* CSS Art / SVG Composition */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-white relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-w-4 aspect-h-3 bg-primary-50 rounded-2xl overflow-hidden flex items-center justify-center mb-6">
                    <svg className="w-48 h-48 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -right-6 -top-6 bg-white p-4 rounded-2xl shadow-xl animate-wiggle">
                    <div className="text-4xl">🐶</div>
                  </div>
                  <div className="absolute -left-6 -bottom-6 bg-white p-4 rounded-2xl shadow-xl animate-wiggle animation-delay-2000">
                    <div className="text-4xl">🐱</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We provide the best care for your pets with our professional doctors and easy-to-use platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📅",
                title: "Easy Scheduling",
                desc: "Book appointments with your favorite doctors in just a few clicks."
              },
              {
                icon: "🩺",
                title: "Expert Doctors",
                desc: "Our team of experienced veterinarians is here to help your pets."
              },
              {
                icon: "📋",
                title: "Digital Records",
                desc: "Keep track of your pet's medical history and prescriptions online."
              }
            ].map((feature, idx) => (
              <div key={idx} className="card group hover:-translate-y-2 hover:border-primary-200">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
