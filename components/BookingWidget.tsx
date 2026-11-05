"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { trackMeta } from "@/lib/meta";
import { site } from "@/lib/site";

/**
 * Site-wide "Book a call" launcher: a small calendar button in the bottom-right
 * corner that opens an anchored panel holding Calendly's inline scheduler.
 *
 * Calendly's own popup widget opens centred, so the panel is ours and only the
 * scheduler inside it is Calendly's (their supported `initInlineWidget` embed).
 *
 * Loading: nothing from Calendly is requested until the visitor shows intent
 * (hover/focus on the launcher starts the script; opening initialises the
 * embed). The embed is created once and kept alive while closed, so closing and
 * reopening, or moving between pages, never builds a second iframe.
 *
 * Tracking (no names or emails are ever sent):
 *  - every open      → Vercel event "Booking widget opened"
 *  - confirmed book  → Vercel event "Booking widget booked" + Meta `Schedule`,
 *    only from Calendly's `calendly.event_scheduled` message, only from
 *    https://calendly.com and only from our own iframe, de-duplicated by the
 *    invitee URI. Choosing a date or time is never counted.
 * If the event type then redirects to /call-booked, TrackSchedule sees the
 * hand-off flag below and does not fire `Schedule` a second time.
 */

const CALENDLY_ORIGIN = "https://calendly.com";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const STYLE_HREF = "https://assets.calendly.com/assets/external/widget.css";

/** sessionStorage keys. */
const UTM_KEY = "ds_utm";
const BOOKED_KEY = "ds_booked_invitees";
/** Read by TrackSchedule on /call-booked so the booking is not counted twice. */
export const WIDGET_BOOKED_FLAG = "ds_widget_booked_at";

/** Funnel and internal routes that have their own booking flow or no CTA. */
const HIDDEN_ROUTES = [
  "/studio",
  "/onboarding",
  "/call-booked",
  "/ai-visibility-report",
  "/ai-visibility-roadmap",
  "/taxd-case-study",
  "/visibility",
];

const EMBED_URL = (() => {
  const u = new URL(site.calendly);
  u.searchParams.set("hide_gdpr_banner", "1");
  u.searchParams.set("hide_event_type_details", "1");
  u.searchParams.set("background_color", "f8f7f1");
  u.searchParams.set("text_color", "17271f");
  u.searchParams.set("primary_color", "113c2d");
  return u.toString();
})();

type Utm = Partial<
  Record<"utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm", string>
>;

type CalendlyApi = {
  initInlineWidget: (opts: {
    url: string;
    parentElement: HTMLElement;
    prefill?: Record<string, unknown>;
    utm?: Utm;
  }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

/* ------------------------------ storage helpers ----------------------------- */

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or storage blocked: tracking still works for this page */
  }
}

/** Keep the first UTM set seen this session, so attribution survives navigation. */
function captureUtm(): Utm {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {};
  const map = {
    utm_source: "utmSource",
    utm_medium: "utmMedium",
    utm_campaign: "utmCampaign",
    utm_content: "utmContent",
    utm_term: "utmTerm",
  } as const;
  for (const [param, key] of Object.entries(map)) {
    const v = params.get(param);
    if (v) fromUrl[key] = v.slice(0, 200);
  }
  if (Object.keys(fromUrl).length) {
    writeSession(UTM_KEY, fromUrl);
    return fromUrl;
  }
  return readSession<Utm>(UTM_KEY, {});
}

/* ------------------------------ script loading ------------------------------ */

let scriptPromise: Promise<CalendlyApi> | null = null;

/** One script tag for the whole site, reused if something else already added it. */
function loadCalendly(): Promise<CalendlyApi> {
  if (window.Calendly) return Promise.resolve(window.Calendly);
  if (scriptPromise) return scriptPromise;

  if (!document.querySelector(`link[href="${STYLE_HREF}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = STYLE_HREF;
    document.head.appendChild(link);
  }

  scriptPromise = new Promise<CalendlyApi>((resolve, reject) => {
    let el = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const done = () => (window.Calendly ? resolve(window.Calendly) : reject(new Error("no Calendly")));
    if (!el) {
      el = document.createElement("script");
      el.src = SCRIPT_SRC;
      el.async = true;
      document.head.appendChild(el);
    }
    el.addEventListener("load", done, { once: true });
    el.addEventListener(
      "error",
      () => {
        scriptPromise = null; // allow a retry on the next open
        el?.remove();
        reject(new Error("Calendly script failed"));
      },
      { once: true },
    );
  });
  return scriptPromise;
}

/* --------------------------------- component -------------------------------- */

type EmbedState = "idle" | "loading" | "ready" | "failed";

export function BookingWidget() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // panel exists in the DOM
  const [embed, setEmbed] = useState<EmbedState>("idle");
  const [stickyBar, setStickyBar] = useState(false);
  /** Below 640px the panel is a full-screen modal; above, an anchored panel. */
  const [small, setSmall] = useState(false);
  const [onboardingHost, setOnboardingHost] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const utm = useRef<Utm>({});

  const hiddenRoute =
    onboardingHost || HIDDEN_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // Capture UTMs on every route change (cheap), and note the onboarding host.
  useEffect(() => {
    utm.current = captureUtm();
  }, [pathname]);
  useEffect(() => {
    setOnboardingHost(window.location.hostname.startsWith("onboarding"));
  }, []);

  // Close if the visitor navigates to a route where the widget is hidden.
  useEffect(() => {
    if (hiddenRoute) setOpen(false);
  }, [hiddenRoute]);

  // The vertical pages' mobile sticky "Book a call" bar flags itself on <html>.
  // While it is showing, the launcher steps aside on mobile rather than sit on it.
  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia("(max-width: 639px)");
    const read = () => {
      setSmall(mq.matches);
      setStickyBar(html.dataset.stickyCta === "on" && mq.matches);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(html, { attributes: true, attributeFilter: ["data-sticky-cta"] });
    mq.addEventListener("change", read);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", read);
    };
  }, []);

  const initEmbed = useCallback(async () => {
    if (initialised.current || !embedRef.current) return;
    initialised.current = true;
    setEmbed("loading");
    try {
      const Calendly = await loadCalendly();
      if (!embedRef.current) return;
      embedRef.current.innerHTML = "";
      Calendly.initInlineWidget({
        url: EMBED_URL,
        parentElement: embedRef.current,
        utm: utm.current,
      });
      const frame = embedRef.current.querySelector("iframe");
      if (!frame) throw new Error("no iframe");
      frame.title = "Book a discovery call with DomiSearch";
      frame.addEventListener("load", () => setEmbed("ready"), { once: true });
      // Slow or blocked (e.g. a privacy extension): offer the direct link,
      // which disappears again if the calendar does finish loading.
      window.setTimeout(() => setEmbed((s) => (s === "ready" ? s : "failed")), 15000);
    } catch {
      initialised.current = false;
      setEmbed("failed");
    }
  }, []);

  const openPanel = useCallback(() => {
    restoreFocus.current = (document.activeElement as HTMLElement) ?? launcherRef.current;
    setMounted(true);
    setOpen(true);
    track("Booking widget opened", { path: window.location.pathname });
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    const target = restoreFocus.current ?? launcherRef.current;
    // Wait for the launcher to be visible again before focusing it.
    window.requestAnimationFrame(() => (target?.isConnected ? target : launcherRef.current)?.focus());
  }, []);

  // Initialise once the panel is in the DOM and open.
  useEffect(() => {
    if (open && mounted) {
      initEmbed();
      closeRef.current?.focus();
    }
  }, [open, mounted, initEmbed]);

  // Escape to close; trap focus; lock page scroll only when it is full screen.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
      }
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    if (small) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      if (small) document.body.style.overflow = prev;
    };
  }, [open, small, closePanel]);

  // Confirmed bookings only. One listener for the life of the site.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== CALENDLY_ORIGIN) return;
      const frame = embedRef.current?.querySelector("iframe");
      if (!frame || e.source !== frame.contentWindow) return; // not our embed
      const data = e.data as
        | { event?: string; payload?: { invitee?: { uri?: string }; event?: { uri?: string } } }
        | null;
      if (!data || typeof data !== "object") return;
      if (data.event === "calendly.page_height" || data.event === "calendly.event_type_viewed") {
        setEmbed("ready");
        return;
      }
      if (data.event !== "calendly.event_scheduled") return;

      const id = data.payload?.invitee?.uri ?? data.payload?.event?.uri ?? "unknown";
      const seen = readSession<string[]>(BOOKED_KEY, []);
      if (seen.includes(id)) return;
      writeSession(BOOKED_KEY, [...seen, id].slice(-10));
      writeSession(WIDGET_BOOKED_FLAG, Date.now());

      track("Booking widget booked", { path: window.location.pathname });
      trackMeta("Schedule", { content_name: "Discovery Call" });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /** Keep Tab inside the panel (sentinels either side bounce focus back in). */
  const focusEdge = (edge: "first" | "last") => {
    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([hidden]), a[href], iframe, [tabindex]:not([tabindex="-1"]):not([data-sentinel])',
    );
    if (!nodes?.length) return;
    (edge === "first" ? nodes[0] : nodes[nodes.length - 1]).focus();
  };

  // On mobile the open panel is full screen, so the launcher goes; on desktop it
  // stays under the panel and turns into its close control.
  const launcherHidden = hiddenRoute || (small && (open || stickyBar));

  return (
    <div className="booking-widget" data-hidden={hiddenRoute ? "true" : undefined}>
      {/* ------------------------------- launcher ------------------------------ */}
      <button
        ref={launcherRef}
        type="button"
        aria-label={open ? "Close booking panel" : "Book a discovery call"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="booking-panel"
        onClick={open ? closePanel : openPanel}
        onPointerEnter={() => void loadCalendly().catch(() => {})}
        onFocus={() => void loadCalendly().catch(() => {})}
        hidden={launcherHidden}
        className={`booking-launcher group fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-domigreen)] text-[color:var(--color-ink)] shadow-[0_10px_30px_-8px_rgba(9,9,9,0.45)] ring-1 ring-black/10 transition-[transform,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(9,9,9,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-ink)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 `}
        style={{
          right: "max(1.25rem, env(safe-area-inset-right))",
          bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        }}
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <CalendarIcon />}
        <span
          aria-hidden
          className={`pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-[color:var(--color-ink)] px-3 py-1.5 text-[13px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block ${open ? "!hidden" : ""}`}
        >
          Book a call
        </span>
      </button>

      {/* -------------------------------- panel -------------------------------- */}
      {mounted ? (
        <div
          ref={panelRef}
          id="booking-panel"
          role="dialog"
          aria-modal={small ? "true" : undefined}
          aria-labelledby="booking-panel-title"
          aria-describedby="booking-panel-desc"
          hidden={!open}
          className="booking-panel fixed z-[70] flex flex-col overflow-hidden bg-[color:var(--color-paper)] text-[color:var(--color-ink-2)] max-sm:inset-0 sm:rounded-2xl sm:border sm:border-[color:var(--color-line)] sm:shadow-[0_24px_70px_-20px_rgba(9,9,9,0.45)]"
        >
          {small ? <span tabIndex={0} data-sentinel aria-hidden onFocus={() => focusEdge("last")} /> : null}

          <div
            className="flex items-start gap-3 border-b border-[color:var(--color-line)] px-5 pb-3.5 pt-4"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <div className="min-w-0 flex-1">
              <h2
                id="booking-panel-title"
                className="text-[17px] font-semibold leading-tight tracking-tight text-[color:var(--color-ink)]"
              >
                Book your discovery call
              </h2>
              <p id="booking-panel-desc" className="mt-1 text-[13px] leading-snug text-[color:var(--color-ink-2)]">
                Tell us about your business and see what we would prioritise to improve your
                visibility in AI search.
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={closePanel}
              aria-label="Close booking panel"
              className="-mr-1.5 -mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[color:var(--color-ink)] transition-colors hover:bg-black/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-ink)]"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 bg-[color:var(--color-paper)]">
            {embed !== "ready" && embed !== "failed" ? (
              <p className="absolute inset-x-0 top-10 text-center text-[13px] text-[color:var(--color-ink-3)]" role="status">
                Loading live availability…
              </p>
            ) : null}
            {embed === "failed" ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[color:var(--color-paper)] px-6 text-center" role="alert">
                <p className="text-[14px] leading-relaxed text-[color:var(--color-ink)]">
                  The calendar did not load here. You can book on Calendly directly.
                </p>
                <a
                  href={site.calendly}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-[3px] bg-[color:var(--color-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-forest)]"
                >
                  Open the booking page
                </a>
              </div>
            ) : null}
            {/* Calendly writes its iframe in here. */}
            <div ref={embedRef} className="booking-embed absolute inset-0" />
          </div>

          <div className="border-t border-[color:var(--color-line)] px-5 py-2.5 text-center text-[12px] text-[color:var(--color-ink-3)]" style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}>
            Calendar not loading?{" "}
            <a href={site.calendly} target="_blank" rel="noopener" className="font-medium text-[color:var(--color-pine)] underline underline-offset-2">
              Book on Calendly
            </a>
          </div>

          {small ? <span tabIndex={0} data-sentinel aria-hidden onFocus={() => focusEdge("first")} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function CloseIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h2M14 14h2M8 17h2" />
    </svg>
  );
}
