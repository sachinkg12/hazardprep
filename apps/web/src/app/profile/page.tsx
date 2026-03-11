'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiskGauge } from '@/components/RiskGauge';
import { HazardCard } from '@/components/HazardCard';
import { HazardMap } from '@/components/HazardMap';
import { Recommendations } from '@/components/Recommendations';

interface HazardProfile {
  location: {
    address: string;
    coordinates: { latitude: number; longitude: number };
    state?: string;
    county?: string;
  };
  overallScore: number;
  overallLevel: string;
  hazards: Array<{
    type: string;
    score: number;
    level: string;
    description: string;
    source: { name: string; url: string };
  }>;
  topRisks: Array<{
    type: string;
    score: number;
    level: string;
    description: string;
    source: { name: string; url: string };
  }>;
  recommendations: Array<{
    priority: string;
    hazardType: string;
    title: string;
    description: string;
    actionItems: string[];
  }>;
  meta: {
    assessedAt: string;
    engineVersion: string;
    providersUsed: string[];
    providerErrors: Array<{ providerId: string; error: string }>;
  };
}

function getLevelBg(level: string): string {
  switch (level) {
    case 'very_high': return 'from-red-500 to-red-600';
    case 'high': return 'from-orange-500 to-orange-600';
    case 'moderate': return 'from-yellow-500 to-yellow-600';
    case 'low': return 'from-lime-500 to-lime-600';
    case 'very_low': return 'from-green-500 to-green-600';
    default: return 'from-gray-500 to-gray-600';
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<HazardProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('hazardProfile');
    if (!stored) {
      router.push('/');
      return;
    }
    setProfile(JSON.parse(stored));
  }, [router]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading profile...</div>
      </div>
    );
  }

  const { location, overallScore, overallLevel, topRisks, recommendations, meta } = profile;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with overall score */}
      <header className={`bg-gradient-to-r ${getLevelBg(overallLevel)} text-white`}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <button
            onClick={() => router.push('/')}
            className="text-white/80 hover:text-white text-sm mb-4 flex items-center gap-1"
          >
            &larr; New Assessment
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Hazard Risk Profile</h1>
              <p className="text-white/90 text-lg">{location.address}</p>
              {location.county && location.state && (
                <p className="text-white/70 text-sm mt-1">
                  {location.county} County, {location.state}
                </p>
              )}
            </div>

            <div className="relative flex flex-col items-center">
              <RiskGauge score={overallScore} level={overallLevel} size="lg" />
              <p className="text-white/80 text-sm mt-2">Composite Risk Score</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Map */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Location</h2>
          <HazardMap
            latitude={location.coordinates.latitude}
            longitude={location.coordinates.longitude}
            address={location.address}
            overallScore={overallScore}
            overallLevel={overallLevel}
          />
        </section>

        {/* Hazard breakdown */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Hazard Breakdown</h2>
          <p className="text-gray-500 mb-4">
            Individual risk scores from {meta.providersUsed.length} federal data sources.
          </p>

          {topRisks.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {topRisks.map((hazard, i) => (
                <HazardCard key={i} hazard={hazard} />
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center text-green-700">
              No significant hazard risks detected for this location.
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section>
          <Recommendations items={recommendations} />
        </section>

        {/* Meta info */}
        <section className="border-t pt-8">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400">
            <span>Assessed: {new Date(meta.assessedAt).toLocaleString()}</span>
            <span>Engine: v{meta.engineVersion}</span>
            <span>Sources: {meta.providersUsed.join(', ')}</span>
          </div>
          {meta.providerErrors.length > 0 && (
            <div className="mt-3 text-sm text-yellow-600">
              Some data sources were unavailable:{' '}
              {meta.providerErrors.map((e) => e.providerId).join(', ')}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors"
            >
              Assess Another Address
            </button>
          </div>
        </section>
      </div>

      <footer className="border-t py-6 px-4 text-center text-sm text-gray-400">
        <p>
          MyHazardProfile &middot; Open source &middot;{' '}
          <a href="https://github.com/myhazardprofile" className="underline hover:text-gray-600">
            GitHub
          </a>{' '}
          &middot; Data from FEMA, USGS, NOAA, NIFC
        </p>
      </footer>
    </main>
  );
}
