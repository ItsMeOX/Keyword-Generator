import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    a: 'a',
  });
}

export async function POST() {
  return NextResponse.json({
    a: 'a',
  });
}
