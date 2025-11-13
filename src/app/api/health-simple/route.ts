export async function GET() {
  return Response.json({
    status: 'OK',
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    deployment: 'vercel',
    version: '1.0.0'
  });
}