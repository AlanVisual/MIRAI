import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";

import { Header } from "@/components/layout/header";

export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }) {
  await connection();

  return (
    <div className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <div className="h-16 border-b border-black/[.08] dark:border-white/[.145]" />
        }
      >
        <Header />
      </Suspense>
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
