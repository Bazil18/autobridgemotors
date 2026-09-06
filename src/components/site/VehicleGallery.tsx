import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { imageUrl } from "@/lib/images";

export function VehicleGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : [""];
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const touchStart = useRef<number | null>(null);

  const go = (delta: number) => setIndex((i) => (i + delta + list.length) % list.length);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, list.length]);

  return (
    <div>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-black sm:aspect-[16/10]"
        onTouchStart={(e) => (touchStart.current = e.touches[0]!.clientX)}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const dx = e.changedTouches[0]!.clientX - touchStart.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <img
          src={imageUrl(list[index])}
          alt={`${alt} — photo ${index + 1}`}
          className="h-full w-full object-cover"
          width={1280}
          height={853}
        />
        {list.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur transition-colors hover:bg-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur transition-colors hover:bg-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <button
          type="button"
          aria-label="View full screen"
          onClick={() => setFull(true)}
          className="absolute bottom-3 right-3 rounded-md bg-background/70 p-2 backdrop-blur transition-colors hover:bg-primary"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-20 w-28 flex-none overflow-hidden rounded-md border transition-colors ${
                i === index ? "border-primary" : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={imageUrl(src)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {full && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            aria-label="Close full screen"
            onClick={() => setFull(false)}
            className="absolute right-5 top-5 rounded-full border border-border p-2"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={imageUrl(list[index])}
            alt={`${alt} — photo ${index + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          {list.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => go(-1)}
                className="absolute left-4 rounded-full bg-background/70 p-3"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => go(1)}
                className="absolute right-4 rounded-full bg-background/70 p-3"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
