import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyHazardProfile — Know Your Risk. Be Prepared.',
  description:
    'Free multi-hazard risk assessment for any US address. Combines FEMA, USGS, and NOAA data into a personalized risk dashboard.',
  openGraph: {
    title: 'MyHazardProfile',
    description: 'Enter your address. Know your natural disaster risk. Get prepared.',
    type: 'website',
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
