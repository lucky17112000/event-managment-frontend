"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  EyeIcon,
  GlobeIcon,
  HeartIcon,
  LeafIcon,
  LightbulbIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { AnimatedStatCard } from "@/components/modules/mission/MissonPage";

// ── static data ──────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: RocketIcon,
    title: "Event Creation",
    description:
      "Easily create, manage, and launch events that bring people together with powerful tools.",
  },
  {
    icon: UsersIcon,
    title: "Community Engagement",
    description:
      "Connect attendees, speakers, and organizers in a vibrant ecosystem of shared experiences.",
  },
  {
    icon: TrendingUpIcon,
    title: "Real-Time Analytics",
    description:
      "Track attendance, engagement, and ROI with comprehensive event analytics and insights.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Ticketing",
    description:
      "Verified tickets and secure payments ensure trust for every attendee and organizer.",
  },
  {
    icon: GlobeIcon,
    title: "Global Events",
    description:
      "Host events locally or reach audiences worldwide with our multi-region event platform.",
  },
  {
    icon: SparklesIcon,
    title: "Interactive Experiences",
    description:
      "Engage attendees with live polls, networking tools, and immersive event features.",
  },
];

const STATS = [
  { label: "Events Hosted", value: "12,500+", icon: RocketIcon },
  { label: "Active Users", value: "450K+", icon: UsersIcon },
  { label: "Attendees Connected", value: "2.5M+", icon: TrendingUpIcon },
  { label: "Countries Active", value: "87+", icon: GlobeIcon },
];

const TEAM = [
  {
    initial: "A",
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Visionary event entrepreneur building the future of global event management and community connection.",
  },
  {
    initial: "M",
    name: "Maria Rodriguez",
    role: "Head of Events",
    bio: "Expert event curator connecting organizers with passionate audiences and creating unforgettable experiences.",
  },
  {
    initial: "J",
    name: "James Kumar",
    role: "VP of Technology",
    bio: "Tech innovator building scalable infrastructure powering millions of event attendees worldwide.",
  },
];

const MILESTONES = [
  {
    year: "2022",
    title: "Event Hub Founded",
    description:
      "Launched with a vision to democratize event management and empower organizers worldwide.",
  },
  {
    year: "2023",
    title: "100,000 Users",
    description:
      "Reached massive milestone connecting organizers and attendees across five continents.",
  },
  {
    year: "2024",
    title: "1 Million Attendees",
    description:
      "First major achievement: facilitated one million attendees across hosted events globally.",
  },
  {
    year: "2025",
    title: "Global Leader",
    description:
      "Became the #1 event management platform with 450K users and 2.5M+ attendees connected.",
  },
];

// ── page ─────────────────────────────────────────────────────────────────────

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background  animate-eco-fade-up animate-delay-1000">
      <main>
        {/* ── 1. Hero ── */}
        <section className="relative overflow-hidden">
          <div className="pointer-ideas-none absolute inset-0 select-none ">
            <div className="absolute -top-40 -right-32 size-125 rounded-full bg-zinc-100/60 blur-3xl dark:bg-zinc-900/20" />
            <div className="absolute bottom-0 -left-24 size-80 rounded-full bg-teal-50/80 blur-2xl dark:bg-teal-900/10" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:flex lg:min-h-[65vh] lg:items-center">
            <div className="grid w-full items-center gap-12 lg:grid-cols-2">
              {/* Left: copy */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 animate-eco-fade-up animate-delay-100">
                  <Badge className="rounded-full border-zinc-200 bg-zinc-50 px-3 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                    <SparklesIcon className="mr-1.5 size-3" />
                    About Event Hub
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    Connecting the world
                  </Badge>
                </div>

                <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-eco-fade-up animate-delay-200">
                  We&apos;re revolutionizing how people{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    connect and celebrate together.
                  </span>
                </h1>

                <p className="max-w-lg text-lg text-muted-foreground animate-eco-fade-up animate-delay-300">
                  Event Hub is the world's most powerful event management
                  platform where organizers create unforgettable experiences and
                  attendees discover events that matter to them.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row animate-eco-fade-up animate-delay-400">
                  <Link
                    href="/book"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "bg-zinc-600 text-white shadow-md shadow-zinc-600/20 hover:bg-zinc-700",
                    )}
                  >
                    Explore Events
                    <ArrowRightIcon
                      className="ml-2 size-4"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href="/register"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Start Organizing
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 animate-eco-fade-up animate-delay-500">
                  {[
                    { label: "Events", value: "12,500+" },
                    { label: "Attendees", value: "2.5M+" },
                    { label: "Reach", value: "87 Countries" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border bg-card px-4 py-3"
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: image card (existing) */}
              <div className="relative animate-eco-fade-up animate-delay-500">
                <div className="pointer-ideas-none absolute -inset-6 hidden md:block">
                  <div className="absolute top-8 left-10 size-24 rounded-full border border-zinc-200 bg-zinc-50/40 animation-duration-[22s] animate-spin" />
                  <div className="absolute bottom-10 right-10 size-20 rounded-full border border-zinc-200 bg-zinc-50/40 animate-pulse" />
                </div>

                <Card className="relative overflow-hidden shadow-xl shadow-zinc-600/5 ring-zinc-100 dark:ring-zinc-900/30">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Our promise
                        </p>
                        <p className="font-heading text-lg font-semibold">
                          Powerful events, inspired communities
                        </p>
                      </div>
                      <Badge className="animate-eco-float bg-zinc-600 text-white">
                        Events
                      </Badge>
                    </div>

                    <div className="relative mt-4 aspect-16/10 w-full overflow-hidden rounded-xl border bg-muted/30">
                      <Image
                        src="/pexels-cottonbro-6565761.jpg"
                        alt="Event Hub community"
                        fill
                        className={cn(
                          "animate-eco-float object-cover opacity-95",
                        )}
                        sizes="(max-width: 1024px) 100vw, 520px"
                        priority
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">Connect</Badge>
                          <Badge variant="secondary">Celebrate</Badge>
                          <Badge variant="secondary">Grow</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Mission & Vision ── */}
        <section className="border-t bg-muted/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 animate-eco-fade-up animate-delay-100">
                What drives us
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Core values that guide our platform
              </h2>
              <p className="mt-4 text-muted-foreground animate-eco-fade-up animate-delay-300">
                Every feature we build is rooted in our commitment to you.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {[
                {
                  icon: RocketIcon,
                  label: "Mission",
                  title: "Empower event creators",
                  description:
                    "Give organizers the tools to create amazing experiences and reach audiences that inspire them.",
                },
                {
                  icon: EyeIcon,
                  label: "Vision",
                  title: "Global event community",
                  description:
                    "Build a world where every event creates meaningful connections and lasting memories.",
                },
                {
                  icon: HeartIcon,
                  label: "Values",
                  title: "Accessibility & trust",
                  description:
                    "Simple technology, transparent practices, and genuine care for every user.",
                },
              ].map(({ icon: Icon, label, title, description }, idx) => (
                <div
                  key={label}
                  className={cn(
                    "group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg dark:hover:border-zinc-800",
                    "animate-eco-fade-up",
                    idx === 0 && "animate-delay-300",
                    idx === 1 && "animate-delay-400",
                    idx === 2 && "animate-delay-500",
                  )}
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-all duration-300 group-hover:bg-zinc-600 group-hover:text-white dark:bg-zinc-900/40 dark:text-zinc-400">
                    <Icon className="size-5" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    {label}
                  </p>
                  <h3 className="font-heading mb-2 text-base font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Services ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 animate-eco-fade-up animate-delay-100">
                What we offer
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Everything to host world-class events
              </h2>
              <p className="mt-4 text-muted-foreground animate-eco-fade-up animate-delay-300">
                Comprehensive tools and features to bring your event vision to
                life.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {SERVICES.map(({ icon: Icon, title, description }, idx) => (
                <div
                  key={title}
                  className={cn(
                    "group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg dark:hover:border-zinc-800 animate-eco-fade-up",
                    idx === 0 && "animate-delay-300",
                    idx === 1 && "animate-delay-400",
                    idx === 2 && "animate-delay-500",
                    idx === 3 && "animate-delay-600",
                    idx === 4 && "animate-delay-700",
                    idx === 5 && "animate-delay-800",
                  )}
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-all duration-300 group-hover:bg-zinc-600 group-hover:text-white dark:bg-zinc-900/40 dark:text-zinc-400">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-heading mb-2 text-base font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Stats ── */}
        <section className="border-t bg-muted/10 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 animate-eco-fade-up animate-delay-100">
                Our scale
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Trusted by millions worldwide
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 animate-eco-fade-up animate-delay-300">
              <AnimatedStatCard
                label="Events Hosted"
                countTo={12500}
                format={(n) => `${n.toLocaleString()}+`}
                icon={RocketIcon}
                delay={0 * 150}
              />
              <AnimatedStatCard
                label="Active Users"
                countTo={450000}
                format={(n) => `${(n / 1000).toFixed(0)}K+`}
                icon={UsersIcon}
                delay={1 * 150}
              />
              <AnimatedStatCard
                label="Attendees Connected"
                countTo={2500000}
                format={(n) => `${(n / 1000000).toFixed(1)}M+`}
                icon={TrendingUpIcon}
                delay={2 * 150}
              />
              <AnimatedStatCard
                label="Countries Active"
                countTo={87}
                format={(n) => `${n}+`}
                icon={GlobeIcon}
                delay={3 * 150}
              />
            </div>
          </div>
        </section>

        {/* ── 5. Team ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge className="mb-4 rounded-full border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 animate-eco-fade-up animate-delay-100">
                Our team
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                Visionaries behind Event Hub
              </h2>
              <p className="mt-4 text-muted-foreground animate-eco-fade-up animate-delay-300">
                A world-class team committed to revolutionizing event management
                globally.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-eco-fade-up animate-delay-200">
              {TEAM.map(({ initial, name, role, bio }, idx) => (
                <div
                  key={name}
                  className={cn(
                    "group rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg dark:hover:border-zinc-800",
                    "animate-eco-fade-up",
                    idx === 0 && "animate-delay-300",
                    idx === 1 && "animate-delay-400",
                    idx === 2 && "animate-delay-500",
                  )}
                >
                  <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-full bg-zinc-600 text-2xl font-bold text-white shadow-md shadow-zinc-600/20">
                    {initial}
                  </div>
                  <h3 className="font-heading text-base font-semibold">
                    {name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Journey / Milestones ── */}
        <section className="border-t bg-muted/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <Badge className="mb-4 rounded-full border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 animate-eco-fade-up animate-delay-100">
                Our journey
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl animate-eco-fade-up animate-delay-200">
                From startup to global leader
              </h2>
            </div>

            <div className="relative animate-eco-fade-up animate-delay-300">
              {/* Vertical timeline line */}
              <div className="absolute left-7.5 top-0 h-full w-px bg-zinc-100 dark:bg-zinc-900/40 sm:left-1/2 sm:-ml-px" />

              <div className="space-y-10">
                {MILESTONES.map(({ year, title, description }, i) => (
                  <div
                    key={year + title}
                    className={cn(
                      "relative flex gap-6 animate-eco-fade-up",
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
                      i === 0 && "animate-delay-100",
                      i === 1 && "animate-delay-200",
                      i === 2 && "animate-delay-300",
                      i === 3 && "animate-delay-400",
                    )}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 top-2 size-4 rounded-full border-2 border-zinc-600 bg-background shadow-sm sm:left-1/2 sm:-ml-2" />

                    <div
                      className={cn(
                        "w-full pl-14 sm:w-1/2 sm:pl-0",
                        i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12",
                      )}
                    >
                      <span className="mb-2 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                        {year}
                      </span>
                      <h3 className="font-heading mt-1 text-base font-semibold">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>

                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. CTA ── */}
        <section className="border-t">
          <div className="relative overflow-hidden bg-linear-to-br from-zinc-600 to-zinc-700 py-20 sm:py-28">
            <div className="pointer-ideas-none absolute inset-0">
              <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl" />
            </div>
            <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
              <LeafIcon className="mx-auto mb-4 size-12 text-zinc-200 animate-eco-fade-up animate-delay-100" />
              <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl animate-eco-fade-up animate-delay-200">
                Type to Event Keyword?
              </h2>
              <p className="mb-8 text-lg text-zinc-100 animate-eco-fade-up animate-delay-300">
                Join Event Hub and post something helpful today. Together, we
                can change the world.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center animate-eco-fade-up animate-delay-400">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-white text-zinc-700 shadow-lg hover:bg-zinc-50",
                  )}
                >
                  Get Started Free
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
                <Link
                  href="/idea"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "border-white/40 text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  Explore ideas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
