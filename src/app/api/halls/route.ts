import { NextResponse } from 'next/server';
import { getHalls } from '@/lib/halls';

export async function GET() {
  const halls = await getHalls();
  return NextResponse.json(halls);
}
