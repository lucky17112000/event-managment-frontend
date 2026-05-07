"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon, ChevronDownIcon, MenuIcon } from "lucide-react";

export type LandingNavLink = { label: string; href: string };

export type LandingNavbarProps = {
  brandName?: string;
  brandHref?: string;
  links?: LandingNavLink[];
  loginHref?: string;
  registerHref?: string;
  className?: string;
};

const DEFAULT_LINKS: LandingNavLink[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/idea" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const EXPLORE_LINKS: LandingNavLink[] = [
  { label: "Contact", href: "/contact" },
  { label: "Our Mission", href: "/mission" },
  { label: "My Profile", href: "/my-profile" },
];

const isLinkActive = (href: string, pathname: string): boolean => {
  const base = href.split("?")[0];
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
};

function NavLink({ href, label, isActive }: LandingNavLink & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
        isActive
          ? "text-zinc-400"
          : "text-white/80 hover:text-white",
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-zinc-500" />
      )}
    </Link>
  );
}

const LandingNavbar = ({
  brandName = "EventHub",
  brandHref = "/",
  links = DEFAULT_LINKS,
  loginHref = "/login",
  registerHref = "/register",
  className,
}: LandingNavbarProps) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const exploreActive = EXPLORE_LINKS.some(({ href }) =>
    isLinkActive(href, pathname),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-black transition-all duration-300",
        scrolled ? "shadow-lg shadow-black/40" : "",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Brand */}
        <Link href={brandHref} className="group flex shrink-0 items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-zinc-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:bg-zinc-600">
            <CalendarDaysIcon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            {brandName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isLinkActive(item.href, pathname)}
            />
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex select-none items-center gap-1 px-4 py-2 text-sm font-medium outline-none transition-colors duration-200",
                exploreActive ? "text-zinc-400" : "text-white/80 hover:text-white",
              )}
            >
              Explore
              <ChevronDownIcon className="size-3.5 opacity-70 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 border-zinc-800 bg-zinc-900">
              {EXPLORE_LINKS.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} />}
                  className={cn(
                    "text-white/80 transition-colors hover:bg-zinc-800 hover:text-white",
                    isLinkActive(item.href, pathname) && "text-zinc-400",
                  )}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={loginHref}
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Login
          </Link>
          <Link
            href={registerHref}
            className="rounded-lg bg-zinc-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-zinc-500/25 transition-all duration-200 hover:bg-zinc-600 hover:shadow-zinc-500/40"
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="size-9 text-white hover:bg-white/10 hover:text-white"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-zinc-800 bg-black">
              <SheetHeader className="pb-3">
                <SheetTitle className="flex items-center gap-2 text-base text-white">
                  <span className="inline-flex size-7 items-center justify-center rounded-md bg-zinc-500 text-white">
                    <CalendarDaysIcon className="size-4" />
                  </span>
                  {brandName}
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-1 pt-1">
                {links.map((item) => {
                  const active = isLinkActive(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-zinc-500/10 text-zinc-400"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="my-2 border-t border-white/10" />

                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Explore
                </p>
                {EXPLORE_LINKS.map((item) => {
                  const active = isLinkActive(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-lg px-3 py-2.5 pl-5 text-sm font-medium transition-colors",
                        active ? "text-zinc-400" : "text-white/60 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                  <Link
                    href={loginHref}
                    className="rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    href={registerHref}
                    className="rounded-lg bg-zinc-500 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-zinc-600"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
