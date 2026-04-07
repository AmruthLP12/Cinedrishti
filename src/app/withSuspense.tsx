// src/app/withSuspense.tsx
import { Suspense, type ReactNode } from "react";

export const withSuspense = (children: ReactNode) => (
  <Suspense fallback={<div className="p-4">Loading...</div>}>
    {children}
  </Suspense>
);