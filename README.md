# ALX Polly

A modern polling application built with Next.js and Supabase that enables users to create, manage and participate in polls seamlessly.

## 🚀 Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Backend**: Supabase (PostgreSQL + Authentication) 
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Testing**: Jest + React Testing Library

## 🛠️ Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/alx-polly.git
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
copy .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. Run development server:
```bash
npm run dev
```
