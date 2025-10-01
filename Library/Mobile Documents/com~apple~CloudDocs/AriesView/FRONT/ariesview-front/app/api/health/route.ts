import { NextResponse } from 'next/server';

export async function GET() {
  // Simple health check endpoint for Docker
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}

// Change from dynamic to static for compatibility with Azure Static Web Apps
export const dynamic = 'error';
export const runtime = 'edge'; 