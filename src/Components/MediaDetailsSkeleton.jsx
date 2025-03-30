import React from "react";

function MediaDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-zinc-900 animate-pulse font-Figtree pb-2">
      <div className="mt-6 flex justify-center">
        <div className="w-[340px] h-[500px] max-md:w-[280px] max-md:h-[420px] bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
      </div>
      <div className="flex flex-col gap-4 pt-6 pr-4 items-center md:items-start px-4 max-md:px-2 w-full">
        <div className="h-10 bg-zinc-300 dark:bg-zinc-700 rounded w-4/5" />
        <div className="space-y-3 w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-full" />
          ))}
          <div className="h-48 bg-zinc-300 dark:bg-zinc-700 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

export default MediaDetailsSkeleton;
