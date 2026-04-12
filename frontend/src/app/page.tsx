'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FlightSearchState {
  tripType: 'oneway' | 'roundtrip';
  from: string;
  to: string;
  departure: string;
  return_date?: string;
  passengers: number;
}

export default function Home() {
  const [searchState, setSearchState] = useState<FlightSearchState>({
    tripType: 'oneway',
    from: 'DEL',
    to: 'BOM',
    departure: '2026-04-15',
    return_date: '2026-04-20',
    passengers: 1,
  });

  const handleTripTypeChange = (type: 'oneway' | 'roundtrip') => {
    setSearchState(prev => ({ ...prev, tripType: type }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results
    console.log('Search:', searchState);
  };

  const airports = [
    { code: 'DEL', city: 'Delhi' },
    { code: 'BOM', city: 'Mumbai' },
    { code: 'BLR', city: 'Bangalore' },
    { code: 'HYD', city: 'Hyderabad' },
    { code: 'CCU', city: 'Kolkata' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-700 to-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l6.5-6.5M12 11l6.5 6.5" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">
                SkyWings
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#flights" className="text-gray-200 hover:text-white font-medium transition">
                Home
              </a>
              <a href="#benefits" className="text-gray-200 hover:text-white font-medium transition">
                Search Flights
              </a>
              <a href="#contact" className="text-gray-200 hover:text-white font-medium transition">
                My Bookings
              </a>
              <a href="#contact" className="text-gray-200 hover:text-white font-medium transition">
                Tier Benefits
              </a>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-200 hover:text-white font-medium transition"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-md transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <section id="flights" className="relative h-screen bg-gradient-to-b from-slate-800 via-blue-900 to-slate-900 overflow-hidden flex items-center">
        {/* Background Image with Airplane */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(30,58,138);stop-opacity:0.5" /><stop offset="100%" style="stop-color:rgb(59,130,246);stop-opacity:0.3" /></linearGradient></defs><rect width="1200" height="600" fill="url(%23grad1)"/><path d="M 1000 200 Q 800 150 600 200 Q 400 250 200 200" stroke="%23ffffff" stroke-width="100" fill="none" opacity="0.1"/></svg>')`,
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-blue-900/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="mt-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Fly Beyond
                <br />
                <span className="text-yellow-400">Expectations</span>
              </h1>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                Premium airline experiences with three-tiered benefits. From essential travel to ultimate luxury — choose your journey.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-lg transition transform hover:scale-105">
                  Book Flight
                </button>
                <button className="px-8 py-3 border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-gray-900 font-bold rounded-lg transition">
                  Learn More
                </button>
              </div>
            </div>

            {/* Search Form */}
            <div className="bg-slate-700/40 backdrop-blur-md rounded-2xl p-8 border border-slate-600/50 shadow-2xl max-w-4xl">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type */}
              <div className="flex gap-6 mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value="oneway"
                    checked={searchState.tripType === 'oneway'}
                    onChange={() => handleTripTypeChange('oneway')}
                    className="w-4 h-4 text-yellow-500"
                  />
                  <span className="ml-2 text-white font-medium">One Way</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value="roundtrip"
                    checked={searchState.tripType === 'roundtrip'}
                    onChange={() => handleTripTypeChange('roundtrip')}
                    className="w-4 h-4 text-yellow-500"
                  />
                  <span className="ml-2 text-white font-medium">Round Trip</span>
                </label>
              </div>

              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* From */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    From
                  </label>
                  <select
                    value={searchState.from}
                    onChange={(e) =>
                      setSearchState((prev) => ({ ...prev, from: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {airports.map((airport) => (
                      <option key={airport.code} value={airport.code}>
                        {airport.code} - {airport.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    To
                  </label>
                  <select
                    value={searchState.to}
                    onChange={(e) =>
                      setSearchState((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {airports.map((airport) => (
                      <option key={airport.code} value={airport.code}>
                        {airport.code} - {airport.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Departure */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Departure
                  </label>
                  <input
                    type="date"
                    value={searchState.departure}
                    onChange={(e) =>
                      setSearchState((prev) => ({ ...prev, departure: e.target.value }))
                    }
                    className="w-full px-4 py-3 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Return Date (if round trip) */}
                {searchState.tripType === 'roundtrip' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Return
                    </label>
                    <input
                      type="date"
                      value={searchState.return_date || ''}
                      onChange={(e) =>
                        setSearchState((prev) => ({
                          ...prev,
                          return_date: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Passengers
                  </label>
                  <select
                    value={searchState.passengers}
                    onChange={(e) =>
                      setSearchState((prev) => ({
                        ...prev,
                        passengers: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                Search Flights
              </button>
            </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">120+</div>
              <p className="text-blue-100">Destinations</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <p className="text-blue-100">Happy Travelers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-blue-100">Daily Flights</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-blue-100">On-time Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Why Fly With SkyWings
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Premium airline experience with world-class service
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: '✈️',
                title: 'Best Routes',
                desc: 'Flying to 120+ destinations worldwide',
              },
              {
                icon: '🛡️',
                title: 'Secure Booking',
                desc: 'PCI-DSS compliant with fraud protection',
              },
              {
                icon: '⚡',
                title: 'Instant Confirmation',
                desc: 'E-ticket within seconds of booking',
              },
              {
                icon: '⭐',
                title: 'Loyalty Rewards',
                desc: 'Earn miles and get exclusive perks',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Choose Your Travel Class
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Select the perfect experience for your journey
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Standard',
                price: 'Economy',
                features: [
                  'Web check-in',
                  'Standard boarding',
                  'Basic seat selection',
                  'Economy baggage',
                  'Email support',
                ],
                featured: false,
              },
              {
                name: 'Plus',
                price: 'Premium',
                features: [
                  'Priority check-in',
                  'Priority boarding',
                  'Extra baggage (15kg)',
                  'Seat selection free',
                  'Chat support',
                  'Free meals',
                ],
                featured: true,
              },
              {
                name: 'Premium',
                price: 'Business',
                features: [
                  'Express check-in',
                  'Premium lounge',
                  'Extra baggage (25kg)',
                  'Best seat selection',
                  'Dedicated support',
                  'Premium meals',
                  'Priority handling',
                ],
                featured: false,
              },
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-8 transition ${
                  tier.featured
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl transform scale-105'
                    : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {tier.featured && (
                  <div className="text-sm font-bold bg-yellow-400 text-gray-900 px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mb-6 ${tier.featured ? 'text-blue-100' : 'text-gray-600'}`}>
                  {tier.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fidx) => (
                    <li
                      key={fidx}
                      className={`flex items-center ${tier.featured ? 'text-blue-50' : 'text-gray-700'}`}
                    >
                      <svg
                        className={`w-5 h-5 mr-3 ${tier.featured ? 'text-yellow-300' : 'text-green-500'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full font-bold py-3 px-6 rounded-lg transition ${
                    tier.featured
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Fly?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your flight today and experience premium travel with SkyWings
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-lg shadow-lg transition transform hover:scale-105 text-lg">
            Start Searching
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">About SkyWings</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 SkyWings Airlines. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
