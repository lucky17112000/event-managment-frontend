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
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  MenuIcon,
  Home,
  Lightbulb,
  LayoutDashboard,
  BookOpen,
  Info,
  MessageSquare,
  MapPin,
  User,
} from "lucide-react";
import { ModeToggle } from "./ThemeShare";
import LogoutButton from "./LogoutButton";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/services/auth.service";
import { useTheme } from "next-themes";
import { useState as useStateEffect } from "react";

export type LandingNavLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export type LandingNavbarProps = {
  brandName?: string;
  brandHref?: string;
  links?: LandingNavLink[];
  loginHref?: string;
  registerHref?: string;
  className?: string;
};

const DEFAULT_LINKS: LandingNavLink[] = [
  { label: "Home", href: "/", icon: <Home className="size-4" /> },
  { label: "Events", href: "/idea", icon: <Lightbulb className="size-4" /> },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="size-4" />,
  },
  { label: "Blog", href: "/blog", icon: <BookOpen className="size-4" /> },
  { label: "About", href: "/about", icon: <Info className="size-4" /> },
];

const EXPLORE_LINKS: LandingNavLink[] = [
  {
    label: "Contact",
    href: "/contact",
    icon: <MessageSquare className="size-4" />,
  },
  {
    label: "Our Mission",
    href: "/mission",
    icon: <MapPin className="size-4" />,
  },
  {
    label: "My Profile",
    href: "/my-profile",
    icon: <User className="size-4" />,
  },
];

const isLinkActive = (href: string, pathname: string): boolean => {
  const base = href.split("?")[0];
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
};

function NavLink({
  href,
  label,
  isActive,
  icon,
}: LandingNavLink & { isActive: boolean }) {
  const [hovered, setHovered] = useStateEffect(false);
  const { theme } = useTheme();

  // Light mode colors: warm neutral gray, dark mode colors: zinc
  const baseColor =
    theme === "light"
      ? "text-gray-600 hover:text-gray-800"
      : "text-white/80 hover:text-white";
  const activeColor = theme === "light" ? "text-gray-800" : "text-zinc-400";
  const underlineColor = theme === "light" ? "bg-blue-400" : "bg-zinc-500";

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300",
        isActive ? activeColor : baseColor,
        (hovered || isActive) && "scale-105",
      )}
    >
      {/* Icon with animation - show on hover or active */}
      <span
        className={cn(
          "transition-all duration-300",
          hovered || isActive
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0",
        )}
      >
        {icon}
      </span>

      {/* Label */}
      <span>{label}</span>

      {/* Active indicator - aligned with icon and text */}
      {isActive && (
        <span
          className={cn(
            "absolute bottom-1 left-4 right-4 h-1 rounded-full transition-all duration-300",
            underlineColor,
          )}
        />
      )}

      {/* Hover background effect */}
      {hovered && !isActive && (
        <span
          className={cn(
            "absolute inset-0 -z-10 rounded-lg transition-all duration-300",
            theme === "light" ? "bg-gray-50" : "bg-white/5",
          )}
        />
      )}
    </Link>
  );
}

const LandingNavbar = ({
  brandName = "EVENT HUB",
  brandHref = "/",
  links = DEFAULT_LINKS,
  loginHref = "/login",
  registerHref = "/register",
  className,
}: LandingNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const exploreActive = EXPLORE_LINKS.some(({ href }) =>
    isLinkActive(href, pathname),
  );

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        const contentType = response.headers.get("content-type") || "";
        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        if (!contentType.includes("application/json")) {
          // Non-JSON response (likely HTML) — treat as unauthenticated.
          console.warn("Auth check returned non-JSON response");
          setIsAuthenticated(false);
          return;
        }

        const data = await response.json();
        setIsAuthenticated(Boolean(data?.isAuthenticated));
      } catch (error) {
        console.warn("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes (logout event)
    const handleAuthStateChanged = () => {
      checkAuth();
    };

    // Listen for window focus (e.g., after redirect from logout)
    const handleFocus = () => {
      checkAuth();
    };

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-state-changed", handleAuthStateChanged);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChanged);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        theme === "light"
          ? "bg-white shadow-sm shadow-gray-200/30"
          : "bg-black shadow-lg shadow-black/40",
        scrolled && "shadow-lg",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Brand */}
        <Link
          href={brandHref}
          className={cn(
            "group flex shrink-0 items-center gap-2.5 transition-colors duration-300",
          )}
        >
          <span
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg shadow-sm transition-all duration-200 group-hover:scale-105",
              theme === "light"
                ? "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                : "bg-zinc-600 text-white group-hover:bg-zinc-700",
            )}
          >
            <CalendarDaysIcon className="size-5" aria-hidden="true" />
          </span>
          <span
            className={cn(
              "text-lg font-bold tracking-tight transition-colors duration-300",
              theme === "light" ? "text-gray-800" : "text-white",
            )}
          >
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
              icon={item.icon}
              isActive={isLinkActive(item.href, pathname)}
            />
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "group flex select-none items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium outline-none transition-all duration-300",
                exploreActive
                  ? theme === "light"
                    ? "text-gray-800"
                    : "text-zinc-400"
                  : theme === "light"
                    ? "text-gray-600 hover:text-gray-800"
                    : "text-white/80 hover:text-white",
                "hover:scale-105",
              )}
            >
              Explore
              <ChevronDownIcon className="size-3.5 opacity-70 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className={cn(
                "w-48",
                theme === "light"
                  ? "border-gray-200 bg-gray-50"
                  : "border-zinc-800 bg-zinc-900",
              )}
            >
              {EXPLORE_LINKS.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} />}
                  className={cn(
                    "flex items-center gap-2 transition-colors duration-300",
                    theme === "light"
                      ? "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      : "text-white/80 hover:bg-zinc-800 hover:text-white",
                    isLinkActive(item.href, pathname) &&
                      (theme === "light" ? "text-gray-800" : "text-zinc-400"),
                  )}
                >
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop actions */}
        <div
          className={cn(
            "hidden items-center gap-3 md:flex",
            theme === "light" ? "text-gray-800" : "text-white",
          )}
        >
          <div className="flex items-center h-10">
            <ModeToggle />
          </div>

          {!loading && isAuthenticated ? (
            <button
              onClick={async () => {
                try {
                  await logoutAction();
                  window.dispatchEvent(new Event("auth-state-changed"));
                  router.replace("/");
                  router.refresh();
                } catch (error) {
                  console.error("Logout failed:", error);
                }
              }}
              className={cn(
                "inline-flex items-center h-10 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 active:scale-95",
                theme === "light"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-600 text-white hover:bg-red-700",
              )}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href={loginHref}
                className={cn(
                  "inline-flex items-center h-10 px-3 py-2 text-sm font-medium transition-colors",
                  theme === "light"
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-white/80 hover:text-white",
                )}
              >
                Login
              </Link>
              <Link
                href={registerHref}
                className={cn(
                  "inline-flex items-center h-10 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200",
                  theme === "light"
                    ? "bg-slate-400 shadow-slate-400/25 hover:bg-slate-500 hover:shadow-slate-500/40"
                    : "bg-zinc-500 shadow-zinc-500/25 hover:bg-zinc-600 hover:shadow-zinc-500/40",
                )}
              >
                Get Started →
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div
          className={cn(
            "flex items-center gap-2 md:hidden",
            theme === "light" ? "text-slate-900" : "text-white",
          )}
        >
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className={cn(
                  "size-9 transition-colors",
                  theme === "light"
                    ? "text-slate-900 hover:bg-slate-100"
                    : "text-white hover:bg-white/10",
                )}
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={cn(
                "w-72",
                theme === "light"
                  ? "border-slate-200 bg-slate-50"
                  : "border-zinc-800 bg-black",
              )}
            >
              <SheetHeader className="pb-3">
                <SheetTitle
                  className={cn(
                    "flex items-center gap-2 text-base",
                    theme === "light" ? "text-slate-900" : "text-white",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-7 items-center justify-center rounded-md",
                      theme === "light"
                        ? "bg-slate-200 text-slate-900"
                        : "bg-zinc-600 text-white",
                    )}
                  >
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
                        "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? theme === "light"
                            ? "bg-slate-200 text-slate-900"
                            : "bg-zinc-500/10 text-zinc-400"
                          : theme === "light"
                            ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}

                <div
                  className={cn(
                    "my-2 border-t",
                    theme === "light" ? "border-slate-200" : "border-white/10",
                  )}
                />

                <p
                  className={cn(
                    "px-3 py-1 text-xs font-semibold uppercase tracking-widest",
                    theme === "light" ? "text-slate-500" : "text-white/40",
                  )}
                >
                  Explore
                </p>
                {EXPLORE_LINKS.map((item) => {
                  const active = isLinkActive(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? theme === "light"
                            ? "text-slate-900"
                            : "text-zinc-400"
                          : theme === "light"
                            ? "text-slate-600 hover:text-slate-900"
                            : "text-white/60 hover:text-white",
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}

                <div
                  className={cn(
                    "my-3 flex items-center justify-between border-t pt-4",
                    theme === "light" ? "border-slate-200" : "border-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase tracking-widest",
                      theme === "light" ? "text-slate-500" : "text-white/40",
                    )}
                  >
                    Theme
                  </span>
                </div>

                {!loading && isAuthenticated ? (
                  <button
                    onClick={async () => {
                      try {
                        await logoutAction();
                        window.dispatchEvent(new Event("auth-state-changed"));
                        router.replace("/");
                        router.refresh();
                      } catch (error) {
                        console.error("Logout failed:", error);
                      }
                    }}
                    className="w-full rounded-lg bg-red-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={loginHref}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors",
                        theme === "light"
                          ? "border-slate-300 text-slate-900 hover:bg-slate-100"
                          : "border-white/20 text-white hover:bg-white/10",
                      )}
                    >
                      Login
                    </Link>
                    <Link
                      href={registerHref}
                      className={cn(
                        "rounded-lg px-3 py-2 text-center text-sm font-semibold text-white transition-colors",
                        theme === "light"
                          ? "bg-slate-400 hover:bg-slate-500"
                          : "bg-zinc-600 hover:bg-zinc-700",
                      )}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
