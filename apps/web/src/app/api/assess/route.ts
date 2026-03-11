import { NextRequest, NextResponse } from 'next/server';
import { HazardScorer } from '@myhazardprofile/core';

const scorer = new HazardScorer();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a valid US address.' },
        { status: 400 },
      );
    }

    const profile = await scorer.assess(address.trim());
    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Assessment failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
