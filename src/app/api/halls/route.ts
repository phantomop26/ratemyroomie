import { NextResponse } from 'next/server';
import { getHalls } from '@/lib/halls';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const halls = await getHalls();
  return NextResponse.json(halls, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
