import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/hero-car.jpg.asset.json";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x, y });
      });
    };
    const reset = () => setTilt({ x: 0, y: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${tilt.x * -14}px, ${tilt.y * -10}px, 0) scale(1.06)`,
        }}
      >
        <img
          src={heroAsset.url}
          alt="Premium imported performance car in a dark showroom"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div
        className="pointer-events-none absolute right-[8%] top-1/3 h-64 w-64 rounded-full bg-primary/25 blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${tilt.x * 40}px, ${tilt.y * 30}px, 0)` }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-center px-5 sm:px-8 lg:px-12 py-24">
        <p className="eyebrow animate-rise">Imported. Inspected. Ready to drive.</p>
        <h1 className="animate-rise mt-5 max-w-3xl text-5xl leading-[0.92] sm:text-7xl lg:text-8xl">
          YOUR NEXT CAR
          <br />
          <span className="text-gradient-steel">STARTS HERE.</span>
        </h1>
        <p className="animate-rise mt-6 max-w-md text-lg text-muted-foreground">
          Premium imported vehicles. Quality cars, straightforward service, no pressure.
        </p>
        <div className="animate-rise mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg" className="px-8 tracking-widest uppercase">
            <Link to="/cars">View our cars</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border bg-transparent px-8 uppercase tracking-widest"
          >
            <Link to="/contact">Get in touch</Link>
          </Button>
        </div>

        <a
          href="#featured"
          className="mt-16 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Scroll to stock <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
