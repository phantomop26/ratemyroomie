import { NextResponse } from 'next/server';
import { DEFAULT_HALLS } from '@/lib/halls';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const halls = DEFAULT_HALLS;
  return NextResponse.json(halls, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
