"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { Button } from "./button";
import { Logo } from "./logo";
import { mainNav } from "@/content/site";
import { clsx } from "@/lib/clsx";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {mainNav.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-full px-3.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-surface font-semibold text-ink"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex">
            <Button href="/download">Get the app</Button>
          </div>

          <button
            type="button"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-canvas md:hidden">
          <Container width="wide">
            <nav className="flex flex-col py-3">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-3 text-sm text-ink-muted hover:bg-surface hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-line pt-4 pb-2">
                <Button href="/download" className="w-full">
                  Get the app
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
