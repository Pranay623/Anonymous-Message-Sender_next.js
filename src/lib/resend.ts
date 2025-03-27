import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();


if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
