import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Generous enough for a cold Supabase project, short enough that a stalled
// connection surfaces as an error instead of a spinner that never stops.
const REQUEST_TIMEOUT_MS = 20_000;

// The default fetch has no timeout, so a request that never answers leaves the
// promise pending forever and the UI busy flag stuck on.
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  // supabase-js doesn't pass its own signal today; combine them if it ever does.
  const signal = init?.signal && "any" in AbortSignal
    ? AbortSignal.any([init.signal, controller.signal])
    : controller.signal;
  return fetch(input, { ...init, signal }).finally(() => clearTimeout(timer));
}

export const supabase = createClient(url, anon, {
  global: { fetch: fetchWithTimeout },
});
