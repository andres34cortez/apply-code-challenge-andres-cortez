# Frontend Technical Test

Welcome to the Frontend Technical Test! This test is designed to assess your knowledge and skills in frontend development.

The detailed instructions and requirements for this test are defined in the [`CHALLENGE.md`](/CHALLENGE.md) file. Please read it carefully before you start.

## 🚀 Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

The app automatically handles API URLs:
- **Local development**: Uses `http://localhost:3000` by default
- **Production (Vercel)**: Automatically uses relative URLs (same domain) - no configuration needed!

If you need to override the API URL, you can set `NEXT_PUBLIC_API_URL` in Vercel Dashboard → Settings → Environment Variables, but it's not required since the API route is in the same Next.js app.

## 📦 Deployment to Vercel

1. Push your code to a GitHub repository
2. Import the repository in [Vercel](https://vercel.com)
3. Configure environment variables (if needed)
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

Good luck!
