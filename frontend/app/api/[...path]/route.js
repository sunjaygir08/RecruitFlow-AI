import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return proxyToBackend(request, params.path);
}

export async function POST(request, { params }) {
  return proxyToBackend(request, params.path);
}

export async function PUT(request, { params }) {
  return proxyToBackend(request, params.path);
}

export async function DELETE(request, { params }) {
  return proxyToBackend(request, params.path);
}

async function proxyToBackend(request, pathSegments = []) {
  const backendBaseUrl = process.env.BACKEND_API_URL || 'https://your-backend-url.example.com';
  const path = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
  const url = new URL(`${backendBaseUrl}/api/${path}${request.nextUrl.search}`);

  const headers = new Headers(request.headers);
  headers.delete('host');

  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer();

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
  });

  const responseBody = await response.arrayBuffer();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    },
  });
}
