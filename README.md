# SolterraGreen

Solar energy e-commerce site — Next.js App Router, Tailwind CSS, shadcn/ui, Prisma (SQLite), Zustand for cart state, Recharts for the savings calculator.

## Setup

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Open http://localhost:3000

## Structure

- `src/app` — routes and API endpoints (products, orders, calculator, newsletter)
- `src/components/sections` — page sections (Hero, Shop, Calculator, Impact, Contact, Footer, ...)
- `src/components/modals` — cart drawer, product modal, checkout modal
- `src/components/ui` — shadcn/ui primitives
- `src/lib` — store (Zustand), db client, product data helpers
- `prisma/schema.prisma` — database schema
