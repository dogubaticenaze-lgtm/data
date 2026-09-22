import { cookies, headers } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readStore, updateStore, newId, type AdminUser } from "./store";

const SESSION_COOKIE = "dbc_admin";
const SESSION_DAYS = 14;

/* ---------- passwords ---------- */
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash || !/^[0-9a-f]+$/i.test(hash) || hash.length !== 128) return false;
    const candidate = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

export function passwordProblems(pw: string): string | null {
  if (pw.length < 10) return "Şifre en az 10 karakter olmalı.";
  if (!/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) return "Şifre en az bir harf ve bir rakam içermeli.";
  return null;
}

/* ---------- sessions (stateless, HMAC-signed) ---------- */
function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function createSession(userId: string) {
  const store = await readStore({ fresh: true });
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${exp}`;
  const token = `${payload}.${sign(payload, store.secret)}`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(exp),
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [userId, exp, sig] = token.split(".");
  if (!userId || !exp || !sig) return null;
  if (Number(exp) < Date.now()) return null;
  const store = await readStore({ fresh: true });
  const expected = sign(`${userId}.${exp}`, store.secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return store.users.find((u) => u.id === userId) ?? null;
}

export async function readStoreUsers() {
  return (await readStore({ fresh: true })).users;
}

export async function hasAnyAdmin() {
  const store = await readStore();
  return store.users.length > 0;
}

/* ---------- login throttling ---------- */
const attempts = new Map<string, { count: number; until: number }>();

export async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "local";
}

export function isLocked(key: string) {
  const a = attempts.get(key);
  return Boolean(a && a.count >= 6 && a.until > Date.now());
}

export function noteFailure(key: string) {
  const a = attempts.get(key) ?? { count: 0, until: 0 };
  a.count += 1;
  a.until = Date.now() + 15 * 60 * 1000;
  attempts.set(key, a);
}

export function clearFailures(key: string) {
  attempts.delete(key);
}

/* ---------- user management ---------- */
export async function createUser(username: string, password: string) {
  const name = username.trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,32}$/.test(name)) throw new Error("Kullanıcı adı 3-32 karakter; harf, rakam, nokta, tire.");
  const problem = passwordProblems(password);
  if (problem) throw new Error(problem);
  let created: AdminUser | null = null;
  await updateStore((s) => {
    if (s.users.some((u) => u.username === name)) throw new Error("Bu kullanıcı adı zaten var.");
    created = { id: newId(), username: name, passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
    s.users.push(created);
  });
  return created!;
}

export async function changePassword(userId: string, current: string, next: string) {
  const problem = passwordProblems(next);
  if (problem) throw new Error(problem);
  await updateStore((s) => {
    const u = s.users.find((x) => x.id === userId);
    if (!u) throw new Error("Kullanıcı bulunamadı.");
    if (!verifyPassword(current, u.passwordHash)) throw new Error("Mevcut şifre yanlış.");
    u.passwordHash = hashPassword(next);
  });
}

export async function resetPassword(targetId: string, next: string) {
  const problem = passwordProblems(next);
  if (problem) throw new Error(problem);
  await updateStore((s) => {
    const u = s.users.find((x) => x.id === targetId);
    if (!u) throw new Error("Kullanıcı bulunamadı.");
    u.passwordHash = hashPassword(next);
  });
}

export async function deleteUser(targetId: string, actingId: string) {
  await updateStore((s) => {
    if (targetId === actingId) throw new Error("Kendi hesabınızı silemezsiniz.");
    if (s.users.length <= 1) throw new Error("Son yönetici silinemez.");
    s.users = s.users.filter((u) => u.id !== targetId);
  });
}
