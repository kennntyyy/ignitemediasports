export default function handler(request, response) {
  response.status(200).json({
    hasUrl: Boolean(process.env.KV_REST_API_URL),
    hasToken: Boolean(process.env.KV_REST_API_TOKEN),
    urlLength: process.env.KV_REST_API_URL ? process.env.KV_REST_API_URL.length : 0,
    // Shows the exact key names Vercel injected that contain "KV" or "REDIS" or "UPSTASH",
    // so we can spot typos without ever printing the actual secret values.
    matchingEnvKeys: Object.keys(process.env).filter(
      (k) => k.includes('KV') || k.includes('REDIS') || k.includes('UPSTASH')
    ),
  });
}