"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { Counter } from "./Counter";
import { VisibilityCheckForm } from "./VisibilityCheckForm";
import { GooglePartnerBadge } from "./ui/GooglePartnerBadge";
import { ShopifyPartnerBadge } from "./ui/ShopifyPartnerBadge";

export function Hero() {
  const reduce = useReducedMotion();
  const word = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.12 * i, ease: [0.2, 0.8, 0.2, 1] },
  });

  return (
    <section className="relative isolate overflow-x-clip">
      <div className="absolute inset-0 grid-backdrop" aria-hidden />
      <div
        aria-hidden
        className="glow"
        style={{ width: 560, height: 560, background: "var(--color-domigreen)", top: -160, left: "-10%" }}
      />
      <div
        aria-hidden
        className="glow"
        style={{ width: 420, height: 420, background: "var(--color-pine)", bottom: -200, right: "-10%", opacity: 0.5 }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10 lg:pt-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3"
          >
            <GooglePartnerBadge className="w-[178px]! sm:w-[210px]!" />
            <ShopifyPartnerBadge className="w-[178px]! sm:w-[210px]!" />
          </motion.div>

          <h1 className="display mt-10 text-balance text-[clamp(2.5rem,5.4vw,4.5rem)]">
            <motion.span {...word(0)} className="block">
              Be the brand
            </motion.span>
            <motion.span {...word(1)} className="block">
              AI <span className="italic font-[500] text-[color:var(--color-domigreen)]">recommends</span>.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-[color:var(--color-fog)]/85 sm:text-lg"
          >
            We run Google Ads to capture the demand that exists today - and AEO to engineer
            the demand forming inside ChatGPT, Gemini and Perplexity. One discipline:{" "}
            <span className="text-[color:var(--color-glacier)]">Search Ownership.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-10"
          >
            <VisibilityCheckForm />
            <p className="mt-4 text-sm text-[color:var(--color-fog)]/65">
              Prefer to talk first?{" "}
              <Link
                href={site.calendly}
                target="_blank"
                rel="noopener"
                className="text-[color:var(--color-domigreen)] underline-offset-4 hover:underline"
              >
                Book a call
              </Link>
              .
            </p>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 grid max-w-xl grid-cols-2 gap-x-10 gap-y-10"
          >
            {[
              { value: 3, prefix: "£", suffix: "M+", label: "Managed ad spend" },
              { value: 50, suffix: "+", label: "Brands served" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="display text-[2rem] text-[color:var(--color-domigreen)] sm:text-[2.75rem]">
                  <Counter
                    value={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                  />
                </dt>
                <dd className="mt-2 text-sm uppercase tracking-[0.18em] text-[color:var(--color-fog)]/70">
                  {item.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="hidden lg:flex lg:justify-center"
        >
          <Image
            src="/brand/hero.png"
            alt="DomiSearch: ChatGPT and Google search results on mobile"
            width={1080}
            height={1080}
            priority
            sizes="(max-width: 1023px) 0px, (max-width: 1280px) 50vw, 660px"
            className="h-auto w-full max-w-[660px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
