"use client";

import LoadingDots from "@/components/ui/loading-dots";

export default function Loading() {
  return (
    <main className="flex flex-1 justify-center pt-[92px] p-6 bg-gray-50">
      <LoadingDots />
    </main>
  );
}
