// SuspenseWrapper.jsx
import { Suspense } from "react";

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-400/40 h-80 w-full rounded-lg mb-2" />
      <div className="h-4 bg-gray-400/30 rounded w-3/4" />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
    <div className="w-60 h-10 bg-gray-300 dark:bg-zinc-700 animate-pulse rounded-md mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default function SuspenseWrapper({ children }) {
  return <Suspense fallback={<SkeletonGrid />}>{children}</Suspense>;
}
