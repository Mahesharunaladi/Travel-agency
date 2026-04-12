'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FlightSearchState {
  tripType: 'oneway' | 'roundtrip';
  from: string;
  to: string;
  departure: string;
  passengers: number;
}

export default function Home() {
  const [searchState, setSearchState] = useState<FlightSearchState>({
    tripType: 'oneway',
    from: 'DEL - New Delhi',
    to: 'BOM - Mumbai',
    departure: '15/04/2026',
    passengers: 1,
  });

  const handleTripTypeChange = (type: 'oneway' | 'roundtrip') => {
    setSearchState(prev => ({ ...prev, tripType: type }));
  };

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l6.5-6.5M12 11l6.5 6.5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">SkyWings</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition">Home</a>
            <a href="#" className="text-slate-300 hover:text-white transition">Search Flights</a>
            <a href="#" className="text-slate-300 hover:text-white transition">My Bookings</a>
            <a href="#" className="text-slate-300 hover:text-white transition">Tier Benefits</a>
            <Link href="/login" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-2 rounded-lg transition">
              Sign In
            </Link>
            <Link href="/login" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-2 rounded-lg transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        
        <div className="absolute inset-0 bg-slate-900/60" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Fly Beyond <span className="text-yellow-400">Expectations</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Premium airline experiences with three-tiered benefits. From essential travel to ultimate luxury — choose your journey.
              </p>
              <div className="flex space-x-4">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-8 py-3 rounded-lg transition transform hover:scale-105">
                  Book Your Flight
                </button>
                <button className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 font-bold px-8 py-3 rounded-lg transition">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mt-12">
                <div>
                  <div className="text-4xl font-bold text-white">120+</div>
                  <div className="text-slate-400 text-sm">Destinations</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">2M+</div>
                  <div className="text-slate-400 text-sm">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">500+</div>
                  <div className="text-slate-400 text-sm">Daily Flights</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white">98%</div>
                  <div className="text-slate-400 text-sm">On-time Rate</div>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => handleTripTypeChange('oneway')}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    searchState.tripType === 'oneway'
                      ? 'bg-slate-700 text-white'
                      : 'bg-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  One Way
                </button>
                <button
                  onClick={() => handleTripTypeChange('roundtrip')}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    searchState.tripType === 'roundtrip'
                      ? 'bg-slate-700 text-white'
                      : 'bg-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Round Trip
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="block text-sm text-slate-300 mb-2">From</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option>DEL - New Delhi</option>
                      <option>BOM - Mumbai</option>
                      <option>BLR - Bangalore</option>
                    </select>
                  </div>
                  <div className="flex flex-col items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-slate-300 mb-2">To</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option>BOM - Mumbai</option>
                      <option>DEL - New Delhi</option>
                      <option>BLR - Bangalore</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Departure</label>
                    <input type="text" defaultValue="15/04/2026" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Passengers</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option>1 Passenger</option>
                      <option>2 Passengers</option>
                      <option>3 Passengers</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 rounded-lg transition transform hover:scale-105"
              >
                Search Flights
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Why Choose SkyWings</h2>
          <p className="text-slate-400 text-center mb-12">Enterprise-grade security meets world-class travel experience</p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Secure Booking', desc: 'PCI-DSS compliant payments with fraud detection' },
              { title: 'Instant Confirmation', desc: 'Get your e-ticket within seconds of booking' },
              { title: 'Loyalty Rewards', desc: 'Earn points on every flight, redeem for upgrades' },
              { title: 'Premium Support', desc: '24/7 priority support for Plus & Premium tiers' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-blue-500 transition">
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Choose Your Experience</h2>
          <p className="text-slate-400 text-center mb-12">Three tiers designed for every kind of traveler</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Standard',
                subtitle: 'Essential Travel',
                features: ['Web check-in', 'Standard boarding', 'Economy class seating', 'Basic support (email)', '1x loyalty points']
              },
              {
                name: 'Plus',
                subtitle: 'Enhanced Comfort',
                badge: 'MOST POPULAR',
                features: ['Web & counter check-in', 'Priority boarding', 'Economy+ seating', 'Priority support (chat)', '2x loyalty points', 'Extra baggage (10kg)', 'Free seat selection']
              },
              {
                name: 'Premium',
                subtitle: 'Ultimate Luxury',
                features: ['Express check-in', 'Priority boarding', 'Business class seating', 'Dedicated support agent', '3x loyalty points', 'Extra baggage (20kg)', 'Free seat selection', 'Lounge access', 'Complimentary meals']
              },
            ].map((tier, idx) => (
              <div key={idx} className={`rounded-lg border transition ${
                tier.badge
                  ? 'border-yellow-500 bg-slate-700/80 ring-2 ring-yellow-500/20'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              } p-8`}>
                {tier.badge && (
                  <div className="bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    {tier.badge}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-slate-400 mb-6">{tier.subtitle}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full font-bold py-2 px-4 rounded-lg transition ${
                  tier.badge
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900'
                    : 'border border-slate-500 text-white hover:border-slate-400'
                }`}>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready for Takeoff?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join millions of travelers who trust SkyWings for their journeys.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-8 py-4 rounded-lg transition transform hover:scale-105 text-lg">
            Book Your Flight →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">QUICK LINKS</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Search Flights</a></li>
                <li><a href="#" className="hover:text-white transition">My Bookings</a></li>
                <li><a href="#" className="hover:text-white transition">Tier Benefits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">LEGAL</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l6.5-6.5M12 11l6.5 6.5" />
                  </svg>
                </div>
                <span className="text-white font-bold">SkyWings</span>
              </div>
              <p className="text-slate-400 text-sm">Your premium airline partner for seamless travel experiences across the globe.</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>© 2026 SkyWings Airlines. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
