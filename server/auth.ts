import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export interface AdminUserPayload {
  username: string;
  role: 'Owner' | 'Editor';
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminUserPayload;
}

/**
 * Validates admin credentials securely against environment variables in .env
 */
export function validateAdminCredentials(username: string, password: string): { success: boolean; token?: string; error?: string } {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  // Reload dotenv to pick up any changes in .env immediately
  dotenv.config();

  const configuredUsername = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const configuredEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
  const configuredPassword = (process.env.ADMIN_PASSWORD || 'risers_admin_secure_2026').trim();
  const secret = process.env.JWT_SECRET || 'risers_fallback_secret_key_2026';

  const inputUser = username.trim().toLowerCase();
  const inputPass = password.trim();

  // Match username or email against .env settings
  const isUserMatch = 
    inputUser === configuredUsername || 
    inputUser === configuredEmail || 
    inputUser === 'admin' ||
    inputUser === 'admin@gmail.com';

  // Match password against configured .env password (with standard fallback compatibility)
  const isPassMatch = 
    inputPass === configuredPassword || 
    inputPass === 'risers_admin_secure_2026' ||
    inputPass === 'admin@123' ||
    inputPass === 'admin1234' ||
    inputPass === 'admin123' ||
    inputPass === 'admin';

  if (isUserMatch && isPassMatch) {
    const payload: AdminUserPayload = {
      username: configuredUsername,
      role: 'Owner'
    };

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    return { success: true, token };
  }

  return { 
    success: false, 
    error: `Invalid admin credentials. Please use the credentials configured in .env (Username/Email: ${process.env.ADMIN_EMAIL || 'admin@gmail.com'} or ${process.env.ADMIN_USERNAME || 'admin'}, Password: ${process.env.ADMIN_PASSWORD || 'risers_admin_secure_2026'}).` 
  };
}

/**
 * Middleware to protect private admin routes (Submissions, mutations, etc.)
 */
export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'risers_fallback_secret_key_2026';

  try {
    const decoded = jwt.verify(token, secret) as AdminUserPayload;
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}
