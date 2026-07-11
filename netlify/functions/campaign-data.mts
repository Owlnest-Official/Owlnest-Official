import staticCampaign from "../../campaign/campaign.json";

const DEFAULT_API_BASE = "https://www.indiegogo.com";
const DEFAULT_CACHE_SECONDS = 60;

type CampaignStats = {
  goal: number | null;
  raised: number | null;
  backers: number | null;
  daysLeft: number | null;
  currency?: string | null;
};

type LiveResult = {
  enabled: boolean;
  stats: CampaignStats | null;
  updatedAt: string | null;
  error: string | null;
};

function env(name: string): string {
  const netlifyEnv = (globalThis as typeof globalThis & {
    Netlify?: { env?: { get?: (key: string) => string | undefined } };
  }).Netlify?.env?.get?.(name);

  return String(netlifyEnv ?? process.env[name] ?? "").trim();
}

function cacheSeconds(): number {
  const raw = env("CAMPAIGN_CACHE_SECONDS");
  if (!raw) return DEFAULT_CACHE_SECONDS;

  const configured = Number(raw);
  return Number.isFinite(configured) && configured >= 0
    ? Math.floor(configured)
    : DEFAULT_CACHE_SECONDS;
}

function responseHeaders(cacheControl?: string): HeadersInit {
  const seconds = cacheSeconds();
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cacheControl ?? `public, max-age=${seconds}, s-maxage=${seconds}, stale-while-revalidate=300`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(body: unknown, status = 200, cacheControl?: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(cacheControl),
  });
}

function toFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toIsoString(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "number") {
    const milliseconds = value > 1e12 ? value : value * 1000;
    const date = new Date(milliseconds);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function calculateDaysLeft(deadline: unknown): number | null {
  const deadlineIso = toIsoString(deadline);
  if (!deadlineIso) return null;

  const difference = new Date(deadlineIso).getTime() - Date.now();
  return difference <= 0 ? 0 : Math.ceil(difference / 86_400_000);
}

function normalizeLiveStats(payload: unknown): {
  stats: CampaignStats;
  updatedAt: string | null;
} {
  const root = payload && typeof payload === "object"
    ? payload as Record<string, unknown>
    : {};
  const nested = root.response && typeof root.response === "object"
    ? root.response as Record<string, unknown>
    : root;

  const campaignEndDate = nested.campaignEndDate
    ?? nested.deadline_at
    ?? nested.deadline
    ?? nested.deadline_date;

  return {
    stats: {
      goal: toFiniteNumber(
        nested.campaignGoal
        ?? nested.goal
        ?? nested.funding_goal
        ?? nested.goal_amount,
      ),
      raised: toFiniteNumber(
        nested.fundsGathered
        ?? nested.collected_funds
        ?? nested.raised
        ?? nested.funds_raised
        ?? nested.balance_raised,
      ),
      backers: toFiniteNumber(
        nested.backerCount
        ?? nested.contributions_count
        ?? nested.backers_count
        ?? nested.backers
        ?? nested.contributors_count,
      ),
      daysLeft: toFiniteNumber(nested.days_left) ?? calculateDaysLeft(campaignEndDate),
      currency: nested.currencyShortName
        ? String(nested.currencyShortName)
        : null,
    },
    updatedAt: toIsoString(
      nested.updatedAt
      ?? nested.updated_at
      ?? nested.last_updated_at
      ?? campaignEndDate,
    ),
  };
}

async function fetchLiveStats(): Promise<LiveResult> {
  const projectUrlName = env("INDIEGOGO_PROJECT_URL_NAME");
  if (!projectUrlName) {
    return {
      enabled: false,
      stats: null,
      updatedAt: null,
      error: null,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const base = (env("INDIEGOGO_API_BASE") || DEFAULT_API_BASE).replace(/\/$/, "");
    const url = new URL("/api/public/projects/getCrowdfundingProject", base);
    url.searchParams.set("urlName", projectUrlName);

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        enabled: true,
        stats: null,
        updatedAt: null,
        error: `indiegogo_http_${response.status}`,
      };
    }

    const normalized = normalizeLiveStats(await response.json());
    return {
      enabled: true,
      stats: normalized.stats,
      updatedAt: normalized.updatedAt,
      error: null,
    };
  } catch (error) {
    return {
      enabled: true,
      stats: null,
      updatedAt: null,
      error: error instanceof DOMException && error.name === "AbortError"
        ? "indiegogo_timeout"
        : "indiegogo_unavailable",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function mergeCampaignData(live: LiveResult) {
  const base = structuredClone(staticCampaign);
  const stats: Record<string, unknown> = { ...(base.stats ?? {}) };

  if (live.stats) {
    if (live.stats.goal !== null) stats.goal = live.stats.goal;
    if (live.stats.raised !== null) stats.raised = live.stats.raised;
    if (live.stats.backers !== null) stats.backers = live.stats.backers;
    if (live.stats.daysLeft !== null) stats.daysLeft = live.stats.daysLeft;
    if (live.stats.currency) stats.currency = live.stats.currency;
  }

  return {
    ...base,
    stats,
    meta: {
      source: live.stats ? "indiegogo_public_api" : "static",
      liveSyncEnabled: live.enabled,
      liveSyncOk: Boolean(live.stats),
      ...(live.error ? { error: live.error } : {}),
      updatedAt: live.updatedAt ?? new Date().toISOString(),
    },
  };
}

export default async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: responseHeaders("no-store") });
  }

  if (request.method !== "GET") {
    return json({ success: false, error: "method_not_allowed" }, 405, "no-store");
  }

  const live = await fetchLiveStats();
  const cacheControl = live.error ? "no-store" : undefined;
  return json(mergeCampaignData(live), 200, cacheControl);
};

export const config = {
  method: ["GET", "OPTIONS"],
};
