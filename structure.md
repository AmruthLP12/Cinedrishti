src/
│
├── app/                  # App-level setup
│   ├── App.tsx
│   ├── providers.tsx     # React Query, theme, etc.
│   └── router.tsx        # Routes config
│
├── components/           # Reusable UI components
│   ├── ui/               # shadcn components
│   ├── common/           # Buttons, loaders, etc.
│   └── layout/           # Navbar, sidebar
│
├── features/             # Feature-based modules 🔥
│   ├── auth/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── components/
│   │
│   ├── movies/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── components/
│   │
│   ├── tracking/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── components/
│
├── pages/                # Route pages
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   │
│   ├── dashboard/
│   │   ├── Home.tsx
│   │   ├── Movies.tsx
│   │   └── Tracking.tsx
│   │
│   └── admin/
│       ├── AddMovie.tsx
│       └── ManageMovies.tsx
│
├── lib/                  # Config & utilities
│   ├── appwrite.ts       # Appwrite client
│   ├── queryClient.ts    # TanStack setup
│   └── utils.ts
│
├── hooks/                # Global hooks (if needed)
│   └── useAuth.ts
│
├── types/                # Global types
│   └── index.ts
│
├── constants/            # Static values
│   └── genres.ts
│
├── assets/               # Images, icons
│
└── main.tsx