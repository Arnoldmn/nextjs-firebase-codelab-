import { cookies } from 'next/headers';
import admin from 'firebase-admin';
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function getAuthenticatedAppForUser() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    return { uid: decodedToken.uid, auth: admin.auth() };
  } catch (e) {
    console.warn('Session cookie invalid:', e.message);
    return null;
  }
}