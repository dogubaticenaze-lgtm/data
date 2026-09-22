import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Single-document JSON store for everything the admin panel edits.
 * Backend: Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise a local file
 * (DATA_DIR/store.json, default ./data/store.json). Small site, low write volume.
 */

export type AdminUser = {
  id: string;
  username: string;
  passwordHash: string; // scrypt "salt:hash" (hex)
  createdAt: string;
};

export type Review = {
  id: string;
  name: string; // e.g. "A. K., Almanya"
  country?: string;
  locale: string; // language of the review text
  text: string;
  source?: string; // "Google", "WhatsApp"
  date: string; // ISO date
  consent: boolean; // owner confirms permission to publish
  published: boolean;
};

export type Post = {
  id: string;
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // simple markdown subset
  date: string;
  updatedAt: string;
  published: boolean;
};

export type CaseStatus =
  | "received"
  | "documents"
  | "preparation"
  | "consulate"
  | "flight"
  | "delivered";

export type CaseFile = {
  id: string;
  code: string; // tracking code shown to the family/partner
  label: string; // internal label, e.g. "Berlin - 12.09"
  route: string; // e.g. "İstanbul → Berlin"
  status: CaseStatus;
  note: string; // public note shown with the status
  updates: { at: string; status: CaseStatus; note: string }[];
  createdAt: string;
  updatedAt: string;
};

export type SettingsOverrides = {
  phones?: { display: string; e164: string; primary: boolean }[];
  whatsapp?: string;
  email?: string;
  address?: {
    street?: string;
    district?: string;
    city?: string;
    postalCode?: string;
    mapsUrl?: string;
    geo?: { lat: number; lng: number } | null;
  };
  facts?: {
    foundedYear?: number | null;
    completedTransfers?: number | null;
    countriesServed?: number | null;
  };
  registry?: {
    taxOffice?: string | null;
    taxNumber?: string | null;
    mersis?: string | null;
    tradeRegistry?: string | null;
    kep?: string | null;
    hosting?: string | null;
  };
  legalName?: string;
  sameAs?: string[];
};

export type Flags = {
  showPriceRanges: boolean;
  showReviews: boolean;
  showCaseTracking: boolean;
};

export type StoreData = {
  version: 1;
  secret: string;
  users: AdminUser[];
  settings: SettingsOverrides;
  /** locale → dotted message path → replacement text */
  content: Record<string, Record<string, string>>;
  reviews: Review[];
  posts: Post[];
  cases: CaseFile[];
  flags: Flags;
  updatedAt: string;
};

export function emptyStore(): StoreData {
  return {
    version: 1,
    secret: randomBytes(32).toString("hex"),
    users: [],
    settings: {},
    content: {},
    reviews: [],
    posts: [],
    cases: [],
    flags: { showPriceRanges: false, showReviews: true, showCaseTracking: true },
    updatedAt: new Date().toISOString(),
  };
}

const BLOB_PATH = "dogubati/store.json";
const CACHE_TTL_MS = 15_000;
let cache: { data: StoreData; at: number } | null = null;

function localPath() {
  return path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "data"), "store.json");
}

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readRaw(): Promise<StoreData | null> {
  if (blobEnabled()) {
    const { get } = await import("@vercel/blob");
    const blob = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!blob || blob.statusCode !== 200 || !blob.stream) return null;
    const raw = await new Response(blob.stream).text();
    return JSON.parse(raw) as StoreData;
  }
  try {
    const raw = await fs.readFile(localPath(), "utf8");
    return JSON.parse(raw) as StoreData;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function writeRaw(data: StoreData) {
  const json = JSON.stringify(data, null, 2);
  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, json, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  const file = localPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, json, "utf8");
  await fs.rename(tmp, file);
}

function normalize(data: Partial<StoreData> | null): StoreData {
  const base = emptyStore();
  if (!data) return base;
  return {
    ...base,
    ...data,
    secret: data.secret || base.secret,
    users: data.users ?? [],
    settings: data.settings ?? {},
    content: data.content ?? {},
    reviews: data.reviews ?? [],
    posts: data.posts ?? [],
    cases: data.cases ?? [],
    flags: { ...base.flags, ...(data.flags ?? {}) },
  };
}

export async function readStore(opts: { fresh?: boolean } = {}): Promise<StoreData> {
  if (!opts.fresh && cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  const data = normalize(await readRaw());
  cache = { data, at: Date.now() };
  return data;
}

/** Read-modify-write with the freshest copy. */
export async function updateStore(mutate: (data: StoreData) => void | Promise<void>) {
  const data = normalize(await readRaw());
  await mutate(data);
  data.updatedAt = new Date().toISOString();
  await writeRaw(data);
  cache = { data, at: Date.now() };
  return data;
}

export function newId() {
  return randomBytes(8).toString("hex");
}

export function storeBackendLabel() {
  return blobEnabled() ? "Vercel Blob" : `Yerel dosya (${localPath()})`;
}
