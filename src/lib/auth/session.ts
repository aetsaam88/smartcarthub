import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'gc_admin_session';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor';
}

// Default development credentials (can be overridden via environment variables)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@globalcart.example';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'GlobalCart2025!#';

export async function verifyAdminSession(): Promise<AdminUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, role, timestamp] = decoded.split(':');

    // Token expires in 7 days
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }

    if (email === DEFAULT_ADMIN_EMAIL) {
      return {
        id: 'adm-1',
        email,
        name: 'Lead Administrator',
        role: (role as 'super_admin' | 'editor') || 'super_admin',
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function createAdminSession(email: string, role = 'super_admin'): Promise<void> {
  const cookieStore = cookies();
  const payload = `${email}:${role}:${Date.now()}`;
  const token = Buffer.from(payload).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function authenticateAdmin(email: string, pass: string): Promise<boolean> {
  if (email.toLowerCase().trim() === DEFAULT_ADMIN_EMAIL.toLowerCase() && pass === DEFAULT_ADMIN_PASSWORD) {
    await createAdminSession(email);
    return true;
  }
  return false;
}
