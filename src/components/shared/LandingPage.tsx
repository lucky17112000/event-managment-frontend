"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  TicketIcon,
  UsersIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  ZapIcon,
  StarIcon,
  MailIcon,
  SearchIcon,
  PencilLineIcon,
  RocketIcon,
  GlobeIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  QuoteIcon,
  MicIcon,
  TrophyIcon,
  PaletteIcon,
  UtensilsIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";
import { Footer2 } from "../footer2";
import { useQuery } from "@tanstack/react-query";
import { getLimitedidea } from "@/services/idea.services";
import { ideaInfiniteSlider } from "./IdeaInfiniteSlider";
import { getBlogs, GetBlogResponse } from "@/services/blog.service";

// ── hero slides ───────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    src: "/pexels-cottonbro-6565761.jpg",
    alt: "Live music festival crowd",
    category: "Music Festival",
    title: "Feel the Beat,\nLive the Moment",
    subtitle:
      "Immerse yourself in 3 days of world-class performances across 5 iconic stages in the heart of the city.",
    location: "Madison Square Garden, New York",
    date: "Jun 14–16, 2025",
    eventCard: {
      title: "International Music Festival",
      badge: "LIVE",
      seats: 234,
      soldPct: 78,
      price: "From $49",
    },
  },
  {
    src: "/pic3.jpg",
    alt: "Community event gathering",
    category: "Community Event",
    title: "Together We\nBuild Something Great",
    subtitle:
      "From intimate gatherings to city-wide festivals — every great event starts with a passionate community.",
    location: "City Park Amphitheater, Austin",
    date: "Aug 22, 2025",
    eventCard: {
      title: "City Art Walk & Exhibition",
      badge: "FREE",
      seats: 512,
      soldPct: 43,
      price: "Free Entry",
    },
  },
  {
    src: "/2222222.jpg",
    alt: "Premium event experience",
    category: "Premium Event",
    title: "Experience\nUnforgettable Moments",
    subtitle:
      "Discover curated events designed to create lasting memories and meaningful connections.",
    location: "Downtown Event Center",
    date: "Sep 5–7, 2025",
    eventCard: {
      title: "Exclusive Experience Showcase",
      badge: "NEW",
      seats: 156,
      soldPct: 62,
      price: "From $129",
    },
  },
];

// ── marquee items ─────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  { label: "Music Festivals" },
  { label: "Tech Conferences" },
  { label: "Art Exhibitions" },
  { label: "Sports Events" },
  { label: "Food Fairs" },
  { label: "Business Summits" },
  { label: "Workshop Series" },
  { label: "Community Meetups" },
  { label: "Film Screenings" },
  { label: "Charity Galas" },
];

const getInitial = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 1).toUpperCase() : "?";
};

// ── static data ───────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Active Attendees",
    countTo: 24,
    format: (n: number) => `${n}K+`,
    icon: UsersIcon,
  },
  {
    label: "Events Listed",
    countTo: 12,
    format: (n: number) => `${(n / 10).toFixed(1)}K+`,
    icon: CalendarDaysIcon,
  },
  {
    label: "Satisfaction Rate",
    countTo: 99,
    format: (n: number) => `${n}%`,
    icon: StarIcon,
  },
  {
    label: "Cities Covered",
    countTo: 50,
    format: (n: number) => `${n}+`,
    icon: GlobeIcon,
  },
];

// ── count-up hook ─────────────────────────────────────────────────────────────

export function useCountUp(
  target: number,
  duration: number,
  started: boolean,
): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf: number;
    const startMs = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startMs) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return count;
}

// ── animated stat card ────────────────────────────────────────────────────────

function AnimatedStatCard({
  label,
  countTo,
  format,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  countTo: number;
  format: (n: number) => string;
  icon: ComponentType<{ className?: string }>;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(countTo, 2000, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          if (delay > 0) setTimeout(() => setVisible(true), delay);
          else setVisible(true);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "group flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-500/10",
        visible ? "animate-eco-fade-down" : "opacity-0",
      )}
    >
      <div className="inline-flex size-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-colors duration-300 group-hover:bg-zinc-500 group-hover:text-white">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-heading text-4xl font-bold tabular-nums tracking-tight text-black">
          {format(count)}
        </p>
        <p className="mt-1 text-sm text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: CalendarDaysIcon,
    title: "Create Events",
    description:
      "Set up and publish your event in minutes. Add schedules, ticketing, and all the details your attendees need.",
  },
  {
    icon: UsersIcon,
    title: "Community-Driven",
    description:
      "Events are discovered, voted on, and reviewed by a real community of engaged attendees.",
  },
  {
    icon: TrendingUpIcon,
    title: "Track Performance",
    description:
      "Monitor ticket sales, attendance rates, and engagement metrics all in one dashboard.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Verified Events",
    description:
      "Every event goes through our review process so attendees can trust what they're signing up for.",
  },
  {
    icon: ZapIcon,
    title: "Instant Notifications",
    description:
      "Get real-time alerts for ticket purchases, event updates, and community engagement.",
  },
  {
    icon: TicketIcon,
    title: "Smart Ticketing",
    description:
      "Sell tickets, manage capacity, and handle check-ins seamlessly through our platform.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: SearchIcon,
    title: "Discover Events",
    description:
      "Browse hundreds of events across music, tech, sports, arts, and more — all in your area.",
  },
  {
    step: "02",
    icon: PencilLineIcon,
    title: "Create Your Event",
    description:
      "Have an event to host? List it in minutes with details, images, and ticketing options.",
  },
  {
    step: "03",
    icon: RocketIcon,
    title: "Make It Happen",
    description:
      "Sell tickets, build your audience, and deliver an unforgettable experience.",
  },
];

const CATEGORIES = [
  { icon: MicIcon, label: "Music", count: 128 },
  { icon: TrophyIcon, label: "Sports", count: 94 },
  { icon: GraduationCapIcon, label: "Tech & Education", count: 76 },
  { icon: PaletteIcon, label: "Arts & Culture", count: 112 },
  { icon: UtensilsIcon, label: "Food & Drink", count: 85 },
  { icon: BriefcaseIcon, label: "Business", count: 67 },
  { icon: GlobeIcon, label: "Community", count: 143 },
  { icon: HeartIcon, label: "Charity", count: 91 },
];

const HIGHLIGHTS = [
  {
    title: "International Music Festival 2025",
    category: "Music",
    votes: 342,
    author: "Sarah M.",
    description:
      "Three days of live performances from over 50 artists across 5 stages in the heart of the city.",
  },
  {
    title: "Global Tech Summit: AI & Beyond",
    category: "Technology",
    votes: 289,
    author: "James K.",
    description:
      "Join 2,000+ developers and entrepreneurs for talks, workshops, and networking sessions.",
  },
  {
    title: "Community Art Walk & Exhibition",
    category: "Arts",
    votes: 214,
    author: "Amira P.",
    description:
      "An open-air gallery experience celebrating local artists across 12 city blocks.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "EventHub completely transformed how we run our annual conference. Ticket sales doubled and the check-in process was seamless.",
    name: "Farida Hossain",
    role: "Event Organizer",
    rating: 5,
  },
  {
    quote:
      "I found three incredible local events I never would have discovered otherwise. The platform is clean, fast, and genuinely useful.",
    name: "James Nguyen",
    role: "Regular Attendee",
    rating: 5,
  },
  {
    quote:
      "We used EventHub to promote our charity gala and sold out in 48 hours. The community engagement is unmatched.",
    name: "Amira Patel",
    role: "Non-profit Director",
    rating: 5,
  },
];

const ARTICLES = [
  {
    category: "Event Planning",
    title: "How to Sell Out Your Event in 48 Hours",
    date: "Apr 18, 2025",
    description:
      "The proven strategies top organizers use to fill seats fast — from pre-launch buzz to last-minute urgency.",
  },
  {
    category: "Trends",
    title: "The Rise of Hybrid Events in 2025",
    date: "Apr 10, 2025",
    description:
      "In-person and online attendees together — why hybrid is the new standard and how to do it right.",
  },
  {
    category: "Community",
    title: "Building a Loyal Attendee Community",
    date: "Apr 3, 2025",
    description:
      "Beyond the event itself: how to keep your audience engaged year-round and coming back for more.",
  },
];

// const FAQS = [
//   {
//     q: "What is EventHub?",
//     a: "EventHub is a platform where anyone can discover, create, and manage events — from intimate community meetups to large-scale conferences and festivals.",
//   },
//   {
//     q: "How do I list my event?",
//     a: "Create a free account, navigate to your dashboard, and click 'Create Event'. Fill in your event details and it will go live after a brief review.",
//   },
//   {
//     q: "Is EventHub free to use?",
//     a: "Browsing and attending free events is completely free. Event organizers can list events and sell tickets — we only charge a small fee on paid ticket transactions.",
//   },
//   {
//     q: "How does ticketing work?",
//     a: "Set your ticket types, prices, and capacity. Attendees purchase directly through EventHub and receive digital tickets instantly. You get paid after your event.",
//   },
//   {
//     q: "Can I buy or gift tickets?",
//     a: "Yes — once an event is published, you can purchase tickets and transfer them to others directly through the platform.",
//   },
//   {
//     q: "How do I contact the team?",
//     a: "Reach us via the Contact page or email us directly. We respond within 1–2 business days.",
//   },
// ];

// ── page component ────────────────────────────────────────────────────────────

const LandingPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["ideaLimit"],
    queryFn: () => getLimitedidea(),
  });

  const { data: blogData, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogShow"],
    queryFn: () => getBlogs(),
  });

  const liveIdeas = Array.isArray(data?.data) ? data.data : [];

  const rawBlogData = blogData?.data;
  const allBlogs: GetBlogResponse[] = Array.isArray(rawBlogData)
    ? rawBlogData
    : Array.isArray(
          (rawBlogData as unknown as { data: GetBlogResponse[] })?.data,
        )
      ? (rawBlogData as unknown as { data: GetBlogResponse[] }).data
      : [];
  const featuredBlogs = allBlogs.slice(0, 3);

  // ── hero slider state ──────────────────────────────────────────────────────

  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActiveSlide((s) => (s + 1) % HERO_SLIDES.length),
      5000,
    );
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // ── scroll progress tracking ──────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToSlide = useCallback(
    (idx: number) => {
      setActiveSlide(idx);
      startTimer();
    },
    [startTimer],
  );

  const nextSlide = useCallback(
    () => goToSlide((activeSlide + 1) % HERO_SLIDES.length),
    [activeSlide, goToSlide],
  );

  const prevSlide = useCallback(
    () =>
      goToSlide((activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length),
    [activeSlide, goToSlide],
  );

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* ═══════════════════════════════════════════════════════════════════
            1. CINEMATIC HERO SLIDER
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen overflow-hidden bg-black">
          {/* ════════════════════════════════════════════════════════════════
              SLIDE 0 — MUSIC FESTIVAL  (sound-wave rings + EQ bars)
          ════════════════════════════════════════════════════════════════ */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              activeSlide === 0 ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={HERO_SLIDES[0].src}
              alt={HERO_SLIDES[0].alt}
              fill
              sizes="100vw"
              className="object-cover animate-eco-ken-burns"
              priority
            />
            <div className="absolute inset-0 bg-black/72" />
            {/* Main orb — left */}
            <div
              className="pointer-events-none absolute"
              style={{
                width: "80vw",
                height: "80vw",
                left: "-15vw",
                top: "50%",
                transform: "translateY(-50%)",
                background:
                  "radial-gradient(circle,rgba(113,113,122,.24) 0%,rgba(113,113,122,.06) 38%,transparent 68%)",
              }}
            />
            {/* Secondary orb — top-right */}
            <div
              className="pointer-events-none absolute"
              style={{
                width: "38vw",
                height: "38vw",
                right: "-4vw",
                top: "-6vw",
                background:
                  "radial-gradient(circle,rgba(113,113,122,.14) 0%,transparent 65%)",
              }}
            />
            {/* Warm bottom glow */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: "45vh",
                background:
                  "radial-gradient(ellipse at 30% 100%,rgba(82,82,91,.2) 0%,transparent 60%)",
              }}
            />
            {/* Expanding sound rings — centred at left-third */}
            <div
              className="pointer-events-none absolute"
              style={{ width: 0, height: 0, left: "20vw", top: "50%" }}
            >
              {[
                { w: "14vw", ml: "-7vw", mt: "-7vw" },
                { w: "26vw", ml: "-13vw", mt: "-13vw" },
                { w: "38vw", ml: "-19vw", mt: "-19vw" },
                { w: "50vw", ml: "-25vw", mt: "-25vw" },
              ].map((r, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full border border-zinc-500/20 animate-eco-ring-${i + 1}`}
                  style={{
                    width: r.w,
                    height: r.w,
                    marginLeft: r.ml,
                    marginTop: r.mt,
                  }}
                />
              ))}
            </div>
            {/* Equalizer bars — decorative bottom-right */}
            <div
              className="pointer-events-none absolute bottom-20 right-10 hidden xl:flex items-end gap-1"
              style={{ opacity: 0.12 }}
            >
              {[55, 78, 42, 91, 64, 82, 48, 73, 87, 51, 79, 44, 93, 60].map(
                (h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-t bg-zinc-500"
                    style={{
                      height: `${h}px`,
                      transformOrigin: "bottom",
                      animation: `eco-eq-bar 1.3s ease-in-out ${i % 2 === 0 ? "" : "reverse"} infinite alternate`,
                      animationDelay: `${i * 0.09}s`,
                    }}
                  />
                ),
              )}
            </div>
            {/* Dot pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[.022]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,#71717a 1px,transparent 1px)",
                backgroundSize: "38px 38px",
              }}
            />
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SLIDE 1 — TECH CONFERENCE  (grid + nodes + scan line)
          ════════════════════════════════════════════════════════════════ */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              activeSlide === 1 ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={HERO_SLIDES[1].src}
              alt={HERO_SLIDES[1].alt}
              fill
              sizes="100vw"
              className="object-cover animate-eco-ken-burns"
            />
            <div className="absolute inset-0 bg-black/72" />
            <div
              className="pointer-events-none absolute"
              style={{
                width: "58vw",
                height: "58vw",
                right: "-10vw",
                top: "40%",
                transform: "translateY(-50%)",
                background:
                  "radial-gradient(circle,rgba(113,113,122,.22) 0%,rgba(113,113,122,.05) 42%,transparent 68%)",
              }}
            />
            <div
              className="pointer-events-none absolute"
              style={{
                width: "32vw",
                height: "32vw",
                left: "-4vw",
                top: "-4vw",
                background:
                  "radial-gradient(circle,rgba(113,113,122,.1) 0%,transparent 65%)",
              }}
            />
            {/* Grid lines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[.045]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(113,113,122,1) 1px,transparent 1px),linear-gradient(90deg,rgba(113,113,122,1) 1px,transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
            {/* Network nodes */}
            {[
              { x: 27, y: 22, d: 0 },
              { x: 52, y: 44, d: 0.45 },
              { x: 40, y: 68, d: 0.9 },
              { x: 72, y: 19, d: 0.22 },
              { x: 18, y: 53, d: 1.3 },
              { x: 79, y: 66, d: 0.65 },
              { x: 60, y: 31, d: 1.05 },
              { x: 84, y: 42, d: 0.3 },
            ].map((n, i) => (
              <div
                key={i}
                className="pointer-events-none absolute rounded-full bg-zinc-500"
                style={{
                  width: "5px",
                  height: "5px",
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  animation: "eco-node-pulse 3s ease-in-out infinite",
                  animationDelay: `${n.d}s`,
                }}
              />
            ))}
            {/* Scan line */}
            <div
              className="pointer-events-none absolute inset-y-0 w-px"
              style={{
                background:
                  "linear-gradient(transparent,rgba(113,113,122,.55) 50%,transparent)",
                animation: "eco-scan-line 5s linear infinite",
              }}
            />
            {/* Corner brackets */}
            <div className="pointer-events-none absolute top-16 left-8 hidden lg:block">
              <div className="h-px w-10 bg-zinc-500/25" />
              <div className="h-10 w-px bg-zinc-500/25" />
            </div>
            <div className="pointer-events-none absolute bottom-16 right-8 hidden lg:flex flex-col items-end">
              <div className="h-px w-10 bg-zinc-500/25 ml-auto" />
              <div className="h-10 w-px bg-zinc-500/25 ml-auto" />
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SLIDE 2 — COMMUNITY EVENT  (rising particles + warm glow)
          ════════════════════════════════════════════════════════════════ */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              activeSlide === 2 ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={HERO_SLIDES[2].src}
              alt={HERO_SLIDES[2].alt}
              fill
              sizes="100vw"
              className="object-cover animate-eco-ken-burns"
            />
            <div className="absolute inset-0 bg-black/72" />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: "85vh",
                background:
                  "radial-gradient(ellipse at 50% 100%,rgba(113,113,122,.3) 0%,rgba(82,82,91,.1) 28%,transparent 62%)",
              }}
            />
            <div
              className="pointer-events-none absolute"
              style={{
                width: "48vw",
                height: "48vw",
                left: "-10vw",
                bottom: "18%",
                background:
                  "radial-gradient(circle,rgba(113,113,122,.14) 0%,transparent 68%)",
              }}
            />
            <div
              className="pointer-events-none absolute"
              style={{
                width: "36vw",
                height: "36vw",
                right: "-4vw",
                top: "18%",
                background:
                  "radial-gradient(circle,rgba(113,113,122,.1) 0%,transparent 65%)",
              }}
            />
            {/* Rising particles */}
            {[
              { x: 10, d: 0, s: 3 },
              { x: 24, d: 1.2, s: 2 },
              { x: 37, d: 0.4, s: 4 },
              { x: 51, d: 1.8, s: 3 },
              { x: 62, d: 0.7, s: 2 },
              { x: 73, d: 2.2, s: 3 },
              { x: 84, d: 0.3, s: 2 },
              { x: 90, d: 1.5, s: 4 },
              { x: 43, d: 0.9, s: 2 },
              { x: 69, d: 1.1, s: 3 },
              { x: 20, d: 2, s: 2 },
              { x: 57, d: 0.5, s: 3 },
            ].map((p, i) => (
              <div
                key={i}
                className="pointer-events-none absolute rounded-full bg-zinc-400"
                style={{
                  width: `${p.s}px`,
                  height: `${p.s}px`,
                  left: `${p.x}%`,
                  bottom: "6%",
                  opacity: 0,
                  animation: "eco-float-particle 7s ease-in-out infinite",
                  animationDelay: `${p.d}s`,
                }}
              />
            ))}
            {/* Larger blur particles */}
            {[
              { x: 18, d: 0.6 },
              { x: 54, d: 1.4 },
              { x: 79, d: 2.1 },
            ].map((p, i) => (
              <div
                key={i}
                className="pointer-events-none absolute rounded-full bg-zinc-500 blur-sm"
                style={{
                  width: "9px",
                  height: "9px",
                  left: `${p.x}%`,
                  bottom: "10%",
                  opacity: 0,
                  animation: "eco-float-particle 9s ease-in-out infinite",
                  animationDelay: `${p.d}s`,
                }}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-0 opacity-[.02]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,#71717a 1.5px,transparent 1.5px)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          {/* ── Global top→bottom vignette ── */}
          <div
            className="pointer-events-none absolute inset-0 z-1"
            style={{
              background:
                "linear-gradient(to bottom,rgba(0,0,0,.38) 0%,transparent 22%,transparent 68%,rgba(0,0,0,.75) 100%)",
            }}
          />

          {/* ── Slide counter top-right ── */}
          <div className="absolute top-6 right-6 z-20 hidden items-center gap-3 sm:flex md:top-8 md:right-10">
            <span
              className="select-none font-mono text-5xl font-black leading-none"
              style={{ color: "rgba(255,255,255,.06)" }}
            >
              {String(activeSlide + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <div className="h-px w-6 bg-white/20" />
              <span className="font-mono text-[10px] text-white/35">
                {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ── Main content — two columns ── */}
          <div className="relative z-10 flex min-h-screen flex-col justify-center pb-36 pt-28">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <div className="grid items-center gap-10 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px]">
                {/* LEFT — text (re-animates per slide via key) */}
                <div
                  key={`text-${activeSlide}`}
                  className="max-w-2xl animate-eco-hero-text-in"
                >
                  {/* Badge row */}
                  <div className="mb-7 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-500/40 bg-zinc-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 backdrop-blur-sm">
                      <span className="relative flex size-1.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-zinc-500" />
                      </span>
                      {HERO_SLIDES[activeSlide].category}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-white/40">
                      <CalendarDaysIcon className="size-3.5 text-zinc-500/60" />
                      {HERO_SLIDES[activeSlide].date}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="mb-6 whitespace-pre-line text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                    {HERO_SLIDES[activeSlide].title}
                  </h1>

                  {/* Subtitle */}
                  <p className="mb-8 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">
                    {HERO_SLIDES[activeSlide].subtitle}
                  </p>

                  {/* Location */}
                  <div className="mb-10 flex items-center gap-2 text-sm text-white/45">
                    <MapPinIcon className="size-4 shrink-0 text-zinc-500" />
                    {HERO_SLIDES[activeSlide].location}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/idea"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-zinc-500/30 transition-all duration-200 hover:gap-3 hover:bg-zinc-600 hover:shadow-zinc-500/50"
                    >
                      Browse Events <ArrowRightIcon className="size-4" />
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/10"
                    >
                      Create an Event
                    </Link>
                  </div>
                </div>

                {/* RIGHT — floating event card (re-animates per slide via key) */}
                <div
                  key={`card-${activeSlide}`}
                  className="hidden animate-eco-hero-text-in lg:block"
                >
                  <div className="relative">
                    {/* Main glassmorphism card */}
                    <div className="animate-eco-float relative rounded-2xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/60 backdrop-blur-2xl">
                      {/* Card header */}
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Featured Event
                          </p>
                          <h3 className="mt-1 text-base font-bold leading-snug text-white">
                            {HERO_SLIDES[activeSlide].eventCard.title}
                          </h3>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white",
                            HERO_SLIDES[activeSlide].eventCard.badge ===
                              "LIVE" && "bg-red-500",
                            HERO_SLIDES[activeSlide].eventCard.badge ===
                              "HOT" && "bg-zinc-500",
                            HERO_SLIDES[activeSlide].eventCard.badge ===
                              "FREE" && "bg-zinc-500",
                          )}
                        >
                          {HERO_SLIDES[activeSlide].eventCard.badge ===
                            "LIVE" && (
                            <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-white" />
                          )}
                          {HERO_SLIDES[activeSlide].eventCard.badge}
                        </span>
                      </div>

                      {/* Gradient image area with category icon */}
                      <div className="relative mb-4 h-36 overflow-hidden rounded-xl">
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(135deg,rgba(113,113,122,.35) 0%,rgba(0,0,0,.85) 100%)",
                          }}
                        />
                        {/* Animated shimmer sweep */}
                        <div
                          className="absolute inset-y-0 w-16 -left-4"
                          style={{
                            background:
                              "linear-gradient(90deg,transparent,rgba(113,113,122,.18),transparent)",
                            animation:
                              "eco-shimmer-slide 2.5s ease-in-out infinite",
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {activeSlide === 0 && (
                            <MicIcon className="size-14 text-zinc-500/45" />
                          )}
                          {activeSlide === 1 && (
                            <ZapIcon className="size-14 text-zinc-500/45" />
                          )}
                          {activeSlide === 2 && (
                            <PaletteIcon className="size-14 text-zinc-500/45" />
                          )}
                        </div>
                        {/* Corner category label */}
                        <span className="absolute top-2.5 left-2.5 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold text-white/70 backdrop-blur-sm">
                          {HERO_SLIDES[activeSlide].category}
                        </span>
                      </div>

                      {/* Event meta */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-white/55">
                          <MapPinIcon className="size-3.5 shrink-0 text-zinc-500" />
                          {HERO_SLIDES[activeSlide].location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/55">
                          <CalendarDaysIcon className="size-3.5 shrink-0 text-zinc-500" />
                          {HERO_SLIDES[activeSlide].date}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/55">
                          <TicketIcon className="size-3.5 shrink-0 text-zinc-500" />
                          {HERO_SLIDES[activeSlide].eventCard.seats} seats
                          remaining
                        </div>
                      </div>

                      {/* Sold progress bar */}
                      <div className="mb-4">
                        <div className="mb-1.5 flex justify-between text-[10px] text-white/40">
                          <span>Tickets sold</span>
                          <span className="font-bold text-zinc-400">
                            {HERO_SLIDES[activeSlide].eventCard.soldPct}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-zinc-500 transition-all duration-700"
                            style={{
                              width: `${HERO_SLIDES[activeSlide].eventCard.soldPct}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-white/40">
                            Starting from
                          </p>
                          <p className="text-lg font-black text-white">
                            {HERO_SLIDES[activeSlide].eventCard.price}
                          </p>
                        </div>
                        <Link
                          href="/idea"
                          className="rounded-xl bg-zinc-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-zinc-500/30 transition-all hover:bg-zinc-600"
                        >
                          Get Tickets →
                        </Link>
                      </div>
                    </div>

                    {/* Floating attendees pill */}
                    <div
                      className="absolute -bottom-4 -left-5 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-xl backdrop-blur-xl"
                      style={{
                        animation: "eco-float 8s ease-in-out infinite reverse",
                      }}
                    >
                      <div className="flex -space-x-2">
                        {["#71717a", "#a1a1aa", "#d4d4d8"].map((c, i) => (
                          <div
                            key={i}
                            className="size-7 rounded-full border-2 border-black/60"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          +2.4K going
                        </p>
                        <p className="text-[10px] text-white/40">
                          already registered
                        </p>
                      </div>
                    </div>

                    {/* "Selling fast" floating tag */}
                    <div
                      className="absolute -top-3 -right-3 rounded-xl border border-zinc-500/30 bg-zinc-500/15 px-3 py-1.5 backdrop-blur-xl"
                      style={{
                        animation: "eco-float 7s ease-in-out infinite 1s",
                      }}
                    >
                      <p className="text-xs font-bold text-zinc-400">
                        ⚡ Selling fast
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Arrow navigation ── */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex size-12 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:border-zinc-500/50 hover:bg-zinc-500/20 hover:text-zinc-400 sm:left-6 md:left-8"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex size-12 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:border-zinc-500/50 hover:bg-zinc-500/20 hover:text-zinc-400 sm:right-6 md:right-8"
          >
            <ChevronRightIcon className="size-5" />
          </button>

          {/* ── Bottom: progress bars + stat strip ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            {/* Scroll Indicator */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
              <div className="flex flex-col items-center gap-3">
                {/* Smooth scroll progress line */}
                <div className="h-12 w-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-b from-zinc-400 to-zinc-500 transition-all duration-300 ease-out"
                    style={{ height: `${scrollProgress * 100}%` }}
                  />
                </div>
                {/* Bouncing chevron */}
                <div className="animate-bounce">
                  <ChevronDownIcon className="size-5 text-zinc-400 drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Scroll Down Button removed per request */}

            <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6">
              <div className="mb-5 flex items-center gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/25"
                  >
                    {i < activeSlide && (
                      <span className="absolute inset-0 rounded-full bg-white/50" />
                    )}
                    {i === activeSlide && (
                      <span
                        key={`p${activeSlide}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-zinc-500 animate-slide-progress"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
                <span className="flex items-center gap-1.5">
                  <UsersIcon className="size-3.5 text-zinc-500/70" />
                  24K+ attendees
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="size-3.5 text-zinc-500/70" />
                  1,200+ events listed
                </span>
                <span className="flex items-center gap-1.5">
                  <StarIcon className="size-3.5 text-zinc-500/70" />
                  Free to join
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            2. VIDEO SHOWCASE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-black py-20 sm:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            {/* Heading */}
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-500/30 bg-zinc-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <SparklesIcon className="size-3" />
                Experience
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Feel the Energy{" "}
                <span className="text-zinc-500">Before You Arrive</span>
              </h2>
              <p className="mt-4 text-base text-white/45">
                See what happens when world-class events meet an unforgettable
                audience.
              </p>
            </div>

            {/* Video container with glow */}
            <div className="group relative mx-auto max-w-7xl">
              {/* Ambient glow layer */}
              <div className="absolute -inset-2 rounded-3xl bg-zinc-500/20 blur-2xl transition-all duration-700 animate-eco-glow-pulse group-hover:bg-zinc-500/35" />

              {/* Video card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/80">
                {/* 16:9 video */}
                <div className="relative aspect-video w-full bg-zinc-950">
                  <iframe
                    src="https://www.youtube.com/embed/d77TQupCENc?autoplay=1&mute=1&loop=1&playlist=d77TQupCENc&controls=1&rel=0&modestbranding=1"
                    title="EventHub — Event Management Platform Showcase"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                    style={{ border: 0 }}
                  />

                  {/* Top overlay: brand pill */}
                  <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/10">
                      <CalendarDaysIcon className="size-3.5 text-zinc-500" />
                      EventHub Platform Demo
                    </span>
                  </div>
                </div>

                {/* Bottom strip inside card */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 bg-black/40 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1.5">
                      <CalendarDaysIcon className="size-3.5 text-zinc-500" />
                      Event Management Platform
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="size-3.5 text-zinc-500" />
                      Trusted by 10,000+ organizers
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TicketIcon className="size-3.5 text-zinc-500" />
                      End-to-end event solution
                    </span>
                  </div>
                  <Link
                    href="/idea"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-zinc-500/30 transition-all hover:bg-zinc-600"
                  >
                    Get Tickets
                    <ArrowRightIcon className="size-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature pills below video */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: ZapIcon, label: "Real-time ticketing" },
                { icon: UsersIcon, label: "24K+ attendees" },
                { icon: StarIcon, label: "Curated experiences" },
                { icon: GlobeIcon, label: "50+ cities" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/55 transition-all hover:border-zinc-500/30 hover:bg-zinc-500/10 hover:text-white/80"
                >
                  <Icon className="size-3.5 text-zinc-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            3. MARQUEE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Trending categories
                </p>
                <p className="text-lg font-bold text-black">
                  Discover what's happening near you.
                </p>
              </div>
              <span className="self-start rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-500 sm:self-auto">
                Live feed
              </span>
            </div>

            <div className="eco-marquee mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="eco-marquee-track flex w-max items-center gap-2 p-3">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                  <span
                    key={`${item.label}-${idx}`}
                    className="inline-flex cursor-default items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
                  >
                    <span className="inline-flex size-2 shrink-0 rounded-full bg-zinc-500" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            4. STATS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {STATS.map(({ label, countTo, format, icon }, idx) => (
                <AnimatedStatCard
                  key={label}
                  label={label}
                  countTo={countTo}
                  format={format}
                  icon={icon}
                  delay={idx * 150}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            5. FEATURES
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-100 bg-zinc-50 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-600">
                Why EventHub?
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl animate-eco-fade-up animate-delay-200">
                Everything you need to run great events
              </h2>
              <p className="mt-4 text-zinc-500 animate-eco-fade-up animate-delay-200">
                A powerful platform built for organizers, attendees, and
                communities who want to make real connections.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-500/10"
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-all duration-300 group-hover:bg-zinc-500 group-hover:text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-black">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            6. HOW IT WORKS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 animate-eco-fade-up animate-delay-200">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-600">
                How it works
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                From idea to event in 3 steps
              </h2>
            </div>

            <div className="relative grid gap-10 sm:grid-cols-3">
              <div className="absolute top-10 left-[25%] right-[25%] hidden h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent sm:block" />

              {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
                <div
                  key={step}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6 inline-flex size-20 items-center justify-center rounded-2xl border-2 border-zinc-100 bg-white shadow-md">
                    <Icon className="size-8 text-zinc-500" />
                    <span className="absolute -top-3 -right-3 inline-flex size-7 items-center justify-center rounded-full bg-zinc-500 text-xs font-bold text-white shadow-sm">
                      {step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-black">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-zinc-800"
              >
                Get Started Free
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            7. CATEGORIES
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-100 bg-black py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-zinc-500/30 bg-zinc-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
                Categories
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Explore by event type
              </h2>
              <p className="mt-4 text-white/50">
                Find events in the category you love most.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {CATEGORIES.map(({ icon: Icon, label, count }) => (
                <Link
                  key={label}
                  href="/idea"
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500/40 hover:bg-zinc-500/10"
                >
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-white/10 text-white/60 transition-all duration-300 group-hover:bg-zinc-500 group-hover:text-white">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="mt-0.5 text-xs text-white/40">
                      {count} events
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            8. LIVE EVENTS SLIDER
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-100 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600">
                  <span className="relative inline-flex size-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-zinc-500" />
                  </span>
                  Live from the community
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  Events happening now
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Real submissions from our community ·
                </p>
              </div>
              <Link
                href="/idea"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
              >
                Browse all events
                <ChevronRightIcon className="size-4" />
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            {ideaInfiniteSlider({ ideas: liveIdeas, isLoading })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            9. COMMUNITY HIGHLIGHTS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-zinc-50 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-3 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600">
                  Community highlights
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  Top-rated events this week
                </h2>
              </div>
              <Link
                href="/idea"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
              >
                View all events
                <ChevronRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {HIGHLIGHTS.map(
                ({ title, category, votes, author, description }) => (
                  <div
                    key={title}
                    className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-500/10"
                  >
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                        {category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                        <HeartIcon className="size-3.5 fill-zinc-100 stroke-zinc-500" />
                        {votes}
                      </span>
                    </div>
                    <h3 className="mb-2 font-bold leading-snug text-black transition-colors group-hover:text-zinc-500">
                      {title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-zinc-500">
                      {description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-zinc-100 text-[0.65rem] font-bold text-zinc-600">
                        {getInitial(author)}
                      </span>
                      {author}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            10. TESTIMONIALS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-black py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full border border-zinc-500/30 bg-zinc-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
                Testimonials
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Loved by organizers &amp; attendees
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map(({ quote, name, role, rating }) => (
                <div
                  key={name}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500/30"
                >
                  <QuoteIcon className="mb-4 size-8 text-zinc-500/40" />
                  <p className="flex-1 text-sm leading-relaxed text-white/60">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="mb-2 flex items-center gap-0.5">
                      {Array.from({ length: rating }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className="size-3.5 fill-zinc-500 stroke-zinc-500"
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-white/40">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            11. BLOG
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-3 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600">
                  Latest articles
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  From the EventHub blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600"
              >
                View all posts
                <ChevronRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {blogsLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white animate-pulse"
                  >
                    <div className="h-48 bg-zinc-100" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-3/4 rounded bg-zinc-100" />
                      <div className="h-4 w-full rounded bg-zinc-100" />
                      <div className="h-4 w-5/6 rounded bg-zinc-100" />
                    </div>
                  </div>
                ))}

              {!blogsLoading &&
                (featuredBlogs.length > 0
                  ? featuredBlogs
                  : ARTICLES.map(
                      (a) =>
                        ({
                          id: a.title,
                          title: a.title,
                          content: a.description,
                          authorName: "EventHub Team",
                        }) as GetBlogResponse,
                    )
                ).map((blog, i) => {
                  const authorName =
                    blog.authorName ?? blog.author?.name ?? "EventHub Team";
                  const preview =
                    blog.content?.length > 130
                      ? blog.content.slice(0, 130) + "…"
                      : blog.content;
                  return (
                    <div
                      key={blog.id ?? i}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-500/10"
                    >
                      <div className="relative flex h-44 items-center justify-center bg-zinc-50 transition-colors duration-300 group-hover:bg-zinc-50">
                        <CalendarDaysIcon className="size-16 text-zinc-200 transition-all duration-300 group-hover:scale-110 group-hover:text-zinc-200" />
                        <div className="absolute top-3 left-3">
                          <span className="rounded-full bg-zinc-500 px-2.5 py-1 text-xs font-bold text-white">
                            Blog
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <h3 className="font-bold leading-snug text-black line-clamp-2 transition-colors group-hover:text-zinc-500">
                          {blog.title}
                        </h3>
                        <p className="flex-1 text-sm leading-relaxed text-zinc-500 line-clamp-3">
                          {preview}
                        </p>
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[0.65rem] font-bold text-zinc-600">
                              {authorName.slice(0, 1).toUpperCase()}
                            </span>
                            <span className="max-w-30 truncate">
                              {authorName}
                            </span>
                          </span>
                          <Link
                            href="/blog"
                            className="flex items-center gap-1 text-xs font-semibold text-zinc-500 transition-all hover:gap-2"
                          >
                            Read more <ArrowRightIcon className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            12. NEWSLETTER
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-100 bg-zinc-500 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold text-white">
              <MailIcon className="size-3" />
              Stay updated
            </span>
            <h2 className="mb-4 mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Never miss an event again
            </h2>
            <p className="mb-8 text-white/80">
              Join 24,000+ readers who get our weekly digest of the best events
              near them.
            </p>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-12 w-full rounded-xl border-0 bg-white px-4 text-sm text-black outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-white/50 sm:max-w-xs"
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-black px-7 text-sm font-bold text-white transition-all hover:bg-zinc-800"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-white/60">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            13. FAQ
        ═══════════════════════════════════════════════════════════════════ */}
        {/* <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-600">
                FAQ
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Common questions
              </h2>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <Accordion multiple={false}>
                {FAQS.map(({ q, a }, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="px-5">
                    <AccordionTrigger className="text-sm font-bold text-black hover:text-zinc-500 hover:no-underline">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-zinc-500">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section> */}

        {/* ═══════════════════════════════════════════════════════════════════
            14. FINAL CTA
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="border-t border-zinc-100">
          <div className="relative overflow-hidden bg-black py-24 sm:py-32">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -right-32 size-96 rounded-full bg-zinc-500/15 blur-3xl animate-eco-glow-pulse" />
              <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-zinc-500/10 blur-3xl animate-eco-glow-pulse animation-duration-[4s]" />
            </div>
            <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
              <CalendarDaysIcon className="mx-auto mb-4 size-14 text-zinc-500" />
              <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ready to experience something{" "}
                <span className="text-zinc-500">amazing?</span>
              </h2>
              <p className="mb-10 text-lg text-white/45">
                Join thousands of organizers and attendees already on EventHub.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-zinc-500/30 transition-all hover:bg-zinc-600 hover:shadow-zinc-500/50"
                >
                  Get Started Free
                  <ArrowRightIcon className="size-4" />
                </Link>
                <Link
                  href="/idea"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer2
        logo={{
          src: "/globe.svg",
          alt: "EventHub",
          title: "EventHub",
          url: "/",
        }}
        tagline="Discover, create, and manage events that bring people together."
        copyright="© 2025 EventHub. All rights reserved."
        menuItems={[
          {
            title: "Platform",
            links: [
              { text: "Browse Events", url: "/idea" },
              { text: "Create Event", url: "/dashboard/create-idea" },
              { text: "Dashboard", url: "/dashboard" },
              { text: "Categories", url: "/idea" },
            ],
          },
          {
            title: "Company",
            links: [
              { text: "About", url: "/about" },
              { text: "Contact", url: "/contact" },
              { text: "Blog", url: "/blog" },
              { text: "Careers", url: "#" },
            ],
          },
          {
            title: "Account",
            links: [
              { text: "Login", url: "/login" },
              { text: "Register", url: "/register" },
              { text: "My Profile", url: "/my-profile" },
            ],
          },
          {
            title: "Social",
            links: [
              { text: "Twitter", url: "#" },
              { text: "Instagram", url: "#" },
              { text: "LinkedIn", url: "#" },
              { text: "GitHub", url: "#" },
            ],
          },
        ]}
        bottomLinks={[
          { text: "Terms of Service", url: "#" },
          { text: "Privacy Policy", url: "#" },
        ]}
      />
    </div>
  );
};

export default LandingPage;
