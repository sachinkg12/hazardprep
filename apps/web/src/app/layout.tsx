import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'HazardPrep — Know Your Risk. Be Prepared.',
    template: '%s | HazardPrep',
  },
  description:
    'Free multi-hazard risk assessment for any US address. Combines FEMA, USGS, and NOAA data into a personalized risk dashboard.',
  keywords: [
    'hazard risk',
    'disaster preparedness',
    'flood risk',
    'earthquake risk',
    'wildfire risk',
    'hurricane risk',
    'tornado risk',
    'FEMA',
    'risk assessment',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  authors: [{ name: 'Sachin Gupta' }],
  openGraph: {
    title: 'HazardPrep — Know Your Risk. Be Prepared.',
    description:
      'Enter any US address to see your personalized multi-hazard risk score. Free, open-source, powered by federal data.',
    type: 'website',
    siteName: 'HazardPrep',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HazardPrep',
    description: 'Enter your address. Know your natural disaster risk. Get prepared.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
