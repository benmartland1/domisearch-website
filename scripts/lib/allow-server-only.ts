/**
 * Neutralises the `server-only` package for a script run.
 *
 * `lib/onboarding/token.ts` imports "server-only" so the resume-link signing
 * secret can never be pulled into a client bundle. That guard is right and
 * stays — but it also throws inside a plain Node script, which is where the
 * token logic gets tested. Import this module *before* anything that reaches
 * `server-only`: ES module side effects run in import order.
 */
import { createRequire } from "node:module";

type Loader = (request: string, ...rest: unknown[]) => unknown;

const require_ = createRequire(import.meta.url);
const Module = require_("node:module") as { _load: Loader };
const load = Module._load;

Module._load = function patched(this: unknown, request: string, ...rest: unknown[]) {
  return request === "server-only" ? {} : load.call(this, request, ...rest);
};
