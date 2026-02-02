"use client";

import Link from "next/link";
import { ArrowLeft, Fuel, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Fuel className="h-4 w-4" />
          FuelSetu
        </div>

        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-foreground md:text-8xl">
          404
        </h1>

        <h2 className="mb-4 text-2xl font-semibold text-foreground md:text-3xl">
          Page Not Found
        </h2>

        <p className="mb-8 text-base text-muted-foreground md:text-lg">
          Oops! The page you’re looking for doesn’t exist or may have been
          moved. Let’s get you back on track.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact the administrator or
            try again later.
          </p>
        </div>
      </div>
    </section>
  );
}
