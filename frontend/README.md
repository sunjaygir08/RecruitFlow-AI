This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project is configured for a Vercel-only deployment.

1. Connect the repository root to Vercel.
2. Set these environment variables in Vercel:
   - `NEXT_PUBLIC_API_URL=/api/v1`
   - `BACKEND_API_URL=https://your-backend-url.example.com`
   - `SECRET_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
3. Deploy the project. API routes are handled by [api/index.py](../api/index.py), and the frontend is served from the Next.js app.

Docker, Railway, and Kubernetes artifacts were removed for this simplified deployment path.
