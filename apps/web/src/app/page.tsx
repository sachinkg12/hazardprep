'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EXAMPLE_ADDRESSES = [
  { label: 'San Francisco, CA', address: '1 Market St, San Francisco, CA 94105' },
  { label: 'Miami, FL', address: '100 Biscayne Blvd, Miami, FL 33132' },
  { label: 'Oklahoma City, OK', address: '100 N Broadway Ave, Oklahoma City, OK 73102' },
  { label: 'Los Angeles, CA', address: '200 N Spring St, Los Angeles, CA 90012' },
];

export default function HomePage() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Assessment failed');
      }

      const profile = await res.json();
      // Store in sessionStorage and navigate
      sessionStorage.setItem('hazardProfile', JSON.stringify(profile));
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleExample(addr: string) {
    setAddress(addr);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Know Your Risk.
            <br />
            <span className="text-blue-600">Be Prepared.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Enter any US address to get a personalized multi-hazard risk assessment.
            <br />
            Floods, earthquakes, wildfires, hurricanes, tornadoes — all in one profile.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter a US address..."
                className="flex-1 px-5 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !address.trim()}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Assessing...
                  </span>
                ) : (
                  'Assess Risk'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {/* Example addresses */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-400">Try:</span>
            {EXAMPLE_ADDRESSES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => handleExample(ex.address)}
                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="bg-white border-t py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Enter Your Address</h3>
              <p className="text-gray-500 text-sm">
                Any US street address. We geocode it using the US Census Bureau API.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">We Analyze the Data</h3>
              <p className="text-gray-500 text-sm">
                FEMA, USGS, NOAA, and NIFC data are queried in parallel to build your risk profile.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Your Profile</h3>
              <p className="text-gray-500 text-sm">
                See your composite risk score, per-hazard breakdown, map, and personalized checklist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-400 mb-4">Powered by federal open data</p>
          <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-500 font-medium">
            <span>FEMA</span>
            <span>USGS</span>
            <span>NOAA</span>
            <span>NIFC</span>
            <span>US Census Bureau</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-sm text-gray-400">
        <p>
          Open source &middot;{' '}
          <a href="https://github.com/myhazardprofile" className="underline hover:text-gray-600">
            GitHub
          </a>{' '}
          &middot; MIT License
        </p>
      </footer>
    </main>
  );
}
