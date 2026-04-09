"use client";

import Link from "next/link";
import Icon from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-beige flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-deep-olive/5 flex items-center justify-center">
          <Icon name="vault" size={48} className="text-deep-olive/40" />
        </div>
        <h1 className="font-serif text-4xl text-deep-olive mb-4">404</h1>
        <p className="text-deep-olive/70 mb-8 max-w-md">
          This resource could not be found in the Logic Vault. It may have been moved or deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-deep-olive text-cream font-medium hover:bg-deep-olive-light transition-colors duration-300"
        >
          <Icon name="arrow" size={16} className="rotate-180" />
          Return to Vault
        </Link>
      </div>
    </div>
  );
}
