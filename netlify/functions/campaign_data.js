const fs = require("fs");
const path = require("path");

const STATIC_CAMPAIGN_PATH = path.resolve(__dirname, "../../campaign/campaign.json");
const INDIEGOGO_API_BASE = process.env.INDIEGOGO_API_BASE || "https://api.indiegogo.com/1";
const CACHE_SECONDS = Number(process.env.CAMPAIGN_CACHE_SECONDS || 60);

function jsonHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    "Cache-Control": `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`,
    ...extra,
  };
}

function readStaticCampaignData() {
  const raw = fs.readFileSync(STATIC_CAMPAIGN_PATH, "utf8");
  return JSON.parse(raw);
}

function toFiniteNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toIsoString(value) {
  if (!value) return null;

  if (typeof value === "number") {
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function calculateDaysLeft(deadlineValue) {
  const deadlineIso = toIsoString(deadlineValue);
  if (!deadlineIso) return null;

  const now = Date.now();
  const deadlineMs = new Date(deadlineIso).getTime();
  if (Number.isNaN(deadlineMs)) return null;

  const diffMs = deadlineMs - now;
  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function normalizeLiveStats(payload) {
  const root = payload && typeof payload === "object" ? payload : {};
  const source = root.response && typeof root.response === "object" ? root.response : root;

  const goal = toFiniteNumber(
    source.goal ??
    source.funding_goal ??
    source.goal_amount
  );

  const raised = toFiniteNumber(
    source.collected_funds ??
    source.raised ??
    source.funds_raised ??
    source.balance_raised
  );

  const backers = toFiniteNumber(
    source.contributions_count ??
    source.backers_count ??
    source.backers ??
    source.contributors_count
  );

  const daysLeft = toFiniteNumber(source.days_left) ?? calculateDaysLeft(
    source.deadline_at ??
    source.deadline ??
    source.deadline_date
  );

  return {
    goal,
    raised,
    backers,
    daysLeft,
    rawUpdatedAt: toIsoString(
      source.updated_at ??
      source.last_updated_at ??
      source.deadline_at
    ),
  };
}

async function fetchLiveStats() {
  const token = process.env.INDIEGOGO_API_TOKEN || process.env.INDIEGOGO_ACCESS_TOKEN;
  const campaignId = process.env.INDIEGOGO_CAMPAIGN_ID;

  if (!token || !campaignId) {
    return {
      enabled: false,
      stats: null,
      error: "missing_indiegogo_env",
    };
  }

  const url = `${INDIEGOGO_API_BASE}/campaigns/${encodeURIComponent(campaignId)}.json?api_token=${encodeURIComponent(token)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`indiegogo_http_${response.status}`);
  }

  const payload = await response.json();
  return {
    enabled: true,
    stats: normalizeLiveStats(payload),
    error: null,
  };
}

function mergeCampaignData(staticData, liveResult) {
  const merged = {
    ...staticData,
    stats: {
      ...(staticData.stats || {}),
    },
    meta: {
      source: "static",
      liveSyncEnabled: Boolean(liveResult?.enabled),
      liveSyncOk: false,
      updatedAt: new Date().toISOString(),
    },
  };

  if (!liveResult?.stats) {
    return merged;
  }

  const stats = liveResult.stats;
  const nextStats = { ...merged.stats };

  if (stats.goal !== null) nextStats.goal = stats.goal;
  if (stats.raised !== null) nextStats.raised = stats.raised;
  if (stats.backers !== null) nextStats.backers = stats.backers;
  if (stats.daysLeft !== null) nextStats.daysLeft = stats.daysLeft;

  merged.stats = nextStats;
  merged.meta = {
    ...merged.meta,
    source: "indiegogo",
    liveSyncOk: true,
    updatedAt: stats.rawUpdatedAt || new Date().toISOString(),
  };

  return merged;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: jsonHeaders(), body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: jsonHeaders(),
      body: JSON.stringify({ success: false, error: "method_not_allowed" }),
    };
  }

  let staticData;
  try {
    staticData = readStaticCampaignData();
  } catch (error) {
    console.error("campaign_data static read error", error);
    return {
      statusCode: 500,
      headers: jsonHeaders({ "Cache-Control": "no-store" }),
      body: JSON.stringify({ success: false, error: "static_campaign_unavailable" }),
    };
  }

  try {
    const liveResult = await fetchLiveStats();
    const merged = mergeCampaignData(staticData, liveResult);
    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify(merged),
    };
  } catch (error) {
    console.error("campaign_data live sync error", error);
    const fallback = {
      ...staticData,
      meta: {
        source: "static",
        liveSyncEnabled: true,
        liveSyncOk: false,
        error: error.message,
        updatedAt: new Date().toISOString(),
      },
    };

    return {
      statusCode: 200,
      headers: jsonHeaders({ "Cache-Control": "no-store" }),
      body: JSON.stringify(fallback),
    };
  }
};
