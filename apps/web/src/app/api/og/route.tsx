import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function getLevelColor(level: string): string {
  switch (level) {
    case 'very_high': return '#ef4444';
    case 'high': return '#f97316';
    case 'moderate': return '#eab308';
    case 'low': return '#84cc16';
    case 'very_low': return '#22c55e';
    default: return '#6b7280';
  }
}

function getLevelLabel(level: string): string {
  return level.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get('address') || 'Unknown Address';
  const score = searchParams.get('score') || '0';
  const level = searchParams.get('level') || 'very_low';

  const color = getLevelColor(level);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937' }}>
            Hazura
          </div>

          {/* Score circle */}
          <div
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: `8px solid ${color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}
          >
            <div style={{ fontSize: '56px', fontWeight: 800, color }}>{score}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>/100</div>
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {getLevelLabel(level)} Risk
          </div>

          <div
            style={{
              fontSize: '18px',
              color: '#4b5563',
              textAlign: 'center',
              maxWidth: '500px',
            }}
          >
            {address}
          </div>

          <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
            Multi-hazard risk assessment powered by FEMA, USGS, NOAA data
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
