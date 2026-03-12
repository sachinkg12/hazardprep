'use client';

import { useState } from 'react';

interface HazardProfile {
  location: { address: string; state?: string; county?: string };
  overallScore: number;
  overallLevel: string;
  topRisks: Array<{ type: string; score: number; level: string; description: string }>;
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'very_high': return 'text-red-600';
    case 'high': return 'text-orange-600';
    case 'moderate': return 'text-yellow-600';
    case 'low': return 'text-lime-600';
    case 'very_low': return 'text-green-600';
    default: return 'text-gray-600';
  }
}

function getLevelBg(level: string): string {
  switch (level) {
    case 'very_high': return 'bg-red-50 border-red-200';
    case 'high': return 'bg-orange-50 border-orange-200';
    case 'moderate': return 'bg-yellow-50 border-yellow-200';
    case 'low': return 'bg-lime-50 border-lime-200';
    case 'very_low': return 'bg-green-50 border-green-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}

function getBarColor(level: string): string {
  switch (level) {
    case 'very_high': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'moderate': return 'bg-yellow-500';
    case 'low': return 'bg-lime-500';
    case 'very_low': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
}

function formatType(type: string): string {
  return type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatLevel(level: string): string {
  return level.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ComparePage() {
  const [addressA, setAddressA] = useState('');
  const [addressB, setAddressB] = useState('');
  const [profileA, setProfileA] = useState<HazardProfile | null>(null);
  const [profileB, setProfileB] = useState<HazardProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchProfile(address: string): Promise<HazardProfile> {
    const res = await fetch('/api/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Assessment failed');
    }
    return res.json();
  }

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!addressA.trim() || !addressB.trim()) return;

    setLoading(true);
    setError('');
    setProfileA(null);
    setProfileB(null);

    try {
      const [a, b] = await Promise.all([
        fetchProfile(addressA.trim()),
        fetchProfile(addressB.trim()),
      ]);
      setProfileA(a);
      setProfileB(b);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
    } finally {
      setLoading(false);
    }
  }

  // Merge all hazard types from both profiles
  const allTypes = profileA && profileB
    ? [...new Set([
        ...profileA.topRisks.map((r) => r.type),
        ...profileB.topRisks.map((r) => r.type),
      ])]
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <a href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
          &larr; Back to Home
        </a>
        <h1 className="text-4xl font-bold mb-2">Compare Addresses</h1>
        <p className="text-gray-600 mb-8">
          See how two locations stack up side-by-side on natural hazard risk.
        </p>

        <form onSubmit={handleCompare} className="space-y-4 mb-10">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address-a" className="block text-sm font-medium text-gray-700 mb-1">
                Address A
              </label>
              <input
                id="address-a"
                type="text"
                value={addressA}
                onChange={(e) => setAddressA(e.target.value)}
                placeholder="e.g., 1 Market St, San Francisco, CA"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="address-b" className="block text-sm font-medium text-gray-700 mb-1">
                Address B
              </label>
              <input
                id="address-b"
                type="text"
                value={addressB}
                onChange={(e) => setAddressB(e.target.value)}
                placeholder="e.g., 100 Biscayne Blvd, Miami, FL"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !addressA.trim() || !addressB.trim()}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Comparing...' : 'Compare Risk'}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl" role="alert">
            {error}
          </div>
        )}

        {profileA && profileB && (
          <div className="space-y-8">
            {/* Overall score comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {[profileA, profileB].map((profile, i) => (
                <div
                  key={i}
                  className={`rounded-xl border-2 p-6 text-center ${getLevelBg(profile.overallLevel)}`}
                >
                  <p className="text-sm text-gray-500 mb-1">
                    {i === 0 ? 'Address A' : 'Address B'}
                  </p>
                  <p className="font-medium text-gray-800 mb-3 text-sm truncate">
                    {profile.location.address}
                  </p>
                  <div className={`text-5xl font-bold ${getLevelColor(profile.overallLevel)}`}>
                    {profile.overallScore}
                  </div>
                  <p className={`text-sm font-semibold mt-1 ${getLevelColor(profile.overallLevel)}`}>
                    {formatLevel(profile.overallLevel)} Risk
                  </p>
                </div>
              ))}
            </div>

            {/* Verdict */}
            {profileA.overallScore !== profileB.overallScore && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center text-blue-800">
                <span className="font-semibold">
                  {profileA.overallScore < profileB.overallScore ? 'Address A' : 'Address B'}
                </span>{' '}
                has lower overall risk by{' '}
                <span className="font-semibold">
                  {Math.abs(profileA.overallScore - profileB.overallScore)} points
                </span>
              </div>
            )}

            {/* Per-hazard comparison */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Hazard-by-Hazard Comparison</h2>
              <div className="space-y-3">
                {allTypes.map((type) => {
                  const scoreA = profileA.topRisks.find((r) => r.type === type)?.score ?? 0;
                  const scoreB = profileB.topRisks.find((r) => r.type === type)?.score ?? 0;
                  const levelA = profileA.topRisks.find((r) => r.type === type)?.level ?? 'very_low';
                  const levelB = profileB.topRisks.find((r) => r.type === type)?.level ?? 'very_low';

                  return (
                    <div key={type} className="bg-white rounded-xl border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{formatType(type)}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`font-bold ${getLevelColor(levelA)}`}>{scoreA}</span>
                          <span className="text-gray-300">vs</span>
                          <span className={`font-bold ${getLevelColor(levelB)}`}>{scoreB}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getBarColor(levelA)} transition-all duration-700`}
                            style={{ width: `${scoreA}%` }}
                          />
                        </div>
                        <div className="bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getBarColor(levelB)} transition-all duration-700`}
                            style={{ width: `${scoreB}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <span className="text-xs text-gray-400">A</span>
                        <span className="text-xs text-gray-400">B</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
