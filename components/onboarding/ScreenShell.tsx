"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * The screen transition.
 *
 * Direction-aware, so going back feels like going back. Reduced-motion gets a
 * cross-fade with no travel — the change of content still needs to register,
 * it just doesn't move.
 */
export function ScreenShell({
  screenKey,
  direction,
  children,
}: {
  screenKey: string;
  direction: 1 | -1;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const distance = reduced ? 0 : 26;

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={screenKey}
        custom={direction}
        initial={{ opacity: 0, y: distance * direction }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -distance * direction }}
        transition={
          reduced
            ? { duration: 0.12 }
            : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
        }
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
