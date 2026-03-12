'use client';

interface SeasonInfo {
  message: string;
  bg: string;
  icon: string;
}

function getCurrentSeason(): SeasonInfo | null {
  const month = new Date().getMonth(); // 0-indexed

  // Hurricane season: June–November (months 5–10)
  if (month >= 5 && month <= 10) {
    return {
      message: "It's hurricane season (June–November). Check if your area is at risk.",
      bg: 'bg-blue-600',
      icon: '\u{1F300}',
    };
  }

  // Wildfire season: varies, but peak is July–October in the West (months 6–9)
  if (month >= 6 && month <= 9) {
    return {
      message: 'Peak wildfire season is underway. Is your home in a fire-prone area?',
      bg: 'bg-orange-600',
      icon: '\u{1F525}',
    };
  }

  // Winter storm season: December–February (months 11, 0, 1)
  if (month === 11 || month === 0 || month === 1) {
    return {
      message: 'Winter storm season is here. Know your risk for ice, snow, and freezing.',
      bg: 'bg-indigo-600',
      icon: '\u2744\uFE0F',
    };
  }

  // Tornado season: March–June (months 2–5)
  if (month >= 2 && month <= 5) {
    return {
      message: "It's tornado season in much of the US. Check your tornado risk.",
      bg: 'bg-gray-700',
      icon: '\u{1F32A}\uFE0F',
    };
  }

  // Earthquake Awareness Month: April (month 3)
  if (month === 3) {
    return {
      message: 'April is Earthquake Preparedness Month. Are you ready?',
      bg: 'bg-amber-700',
      icon: '\u{1F30B}',
    };
  }

  return null;
}

export function SeasonalBanner() {
  const season = getCurrentSeason();
  if (!season) return null;

  return (
    <div className={`${season.bg} text-white text-center py-2.5 px-4 text-sm`}>
      <span aria-hidden="true">{season.icon}</span>{' '}
      {season.message}{' '}
      <a href="/compare" className="underline font-medium ml-1">
        Compare locations &rarr;
      </a>
    </div>
  );
}
