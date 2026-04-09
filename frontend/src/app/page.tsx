'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Airline Booking System
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Book your flights with exclusive benefits
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/search"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search Flights
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
}
