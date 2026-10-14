import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'gc_admin_session';

// Admin Credentials
const ADMIN_EMAIL = 'aetsaam@store.example';
const ADMIN_PASSWORD = 'Aetsaam@88.!#';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor';
}

// Verify Admin Session
export async function verifyAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, role, timestamp] = decoded.split(':');

    const tokenTime = parseInt(timestamp, 10);

    // Session expires after 7 days
    if (
      isNaN(tokenTime) ||
      tokenTime > Date.now() ||
      Date.now() - tokenTime > 7 * 24 * 60 * 60 * 1000
    ) {
      return null;
    }

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return {
        id: 'adm-1',
        email: ADMIN_EMAIL,
        name: 'Lead Administrator',
        role: role === 'editor' ? 'editor' : 'super_admin',
      };
    }
  } catch {
    return null;
  }

  return null;
}

// Create Admin Session
export async function createAdminSession(
  email: string,
  role: 'super_admin' | 'editor' = 'super_admin'
): Promise<void> {
  const cookieStore = await cookies();

  const payload = `${email}:${role}:${Date.now()}`;
  const token = Buffer.from(payload).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

// Destroy Admin Session
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Authenticate Admin
export async function authenticateAdmin(
  email: string,
  pass: string
): Promise<boolean> {
  if (
    email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() &&
    pass === ADMIN_PASSWORD
  ) {
    await createAdminSession(ADMIN_EMAIL);
    return true;
  }

  return false;
}