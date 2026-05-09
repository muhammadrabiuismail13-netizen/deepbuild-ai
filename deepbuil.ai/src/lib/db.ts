/**
 * LocalDB — localStorage-backed database for the self-contained live app.
 * All data persists across page reloads. Works everywhere, no server needed.
 */

const PREFIX = "deepbuild.";

function key(name: string) {
  return PREFIX + name;
}

export function dbGet<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(name));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function dbSet<T>(name: string, value: T): void {
  localStorage.setItem(key(name), JSON.stringify(value));
}

export function dbRemove(name: string): void {
  localStorage.removeItem(key(name));
}

// ---- User system ----

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string; // plain for demo (in real prod this would be hashed on a server)
  role: "student" | "admin";
  createdAt: string;
};

const USERS_KEY = "users";
const SESSION_KEY = "session";

// Pre-seed admin user
function ensureAdmin() {
  const users = dbGet<StoredUser[]>(USERS_KEY, []);
  const admin = users.find((u) => u.email === "admin@deepbuild.ai");
  if (!admin) {
    users.push({
      id: "admin-001",
      name: "DeepBuild Admin",
      email: "admin@deepbuild.ai",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    dbSet(USERS_KEY, users);
  }
}
ensureAdmin();

export function getUsers(): StoredUser[] {
  return dbGet<StoredUser[]>(USERS_KEY, []);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(
  name: string,
  email: string,
  password: string,
): StoredUser {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already in use");
  }
  const user: StoredUser = {
    id: "user-" + Math.random().toString(36).slice(2, 10),
    name,
    email: email.toLowerCase(),
    password,
    role: "student",
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  dbSet(USERS_KEY, users);
  return user;
}

export function loginUser(
  email: string,
  password: string,
): StoredUser {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }
  return user;
}

export function setSession(user: StoredUser): void {
  dbSet(SESSION_KEY, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

export function getSession(): Omit<StoredUser, "password" | "createdAt"> | null {
  return dbGet(SESSION_KEY, null);
}

export function clearSession(): void {
  dbRemove(SESSION_KEY);
}
