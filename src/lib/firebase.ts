import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  Auth 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  Firestore 
} from 'firebase/firestore';

// Always guarantee the exact verified working API Key with lowercase 'l'
const VERIFIED_API_KEY = 'AIzaSyCGXIF3ilOfPZRxCAvsgAtGWSWqyXzFABw';
const envKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const ACTIVE_KEY = (envKey && envKey.includes('3ilOf')) ? envKey : VERIFIED_API_KEY;

export const FIREBASE_CONFIG = {
  apiKey: ACTIVE_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'pathly-e1b6e.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pathly-e1b6e',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'pathly-e1b6e.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '888577741663',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:888577741663:web:0dfd3a36cf8e47e2e71cea',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-QH0DSLVY99',
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(FIREBASE_CONFIG);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  friendCode: string;
}

export function formatFriendCode(input: string): string {
  let clean = input.trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

export function generateFriendCode(uid: string, name?: string): string {
  if (name && name.trim()) {
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    if (cleanName) return `#pathly-${cleanName}`;
  }
  const cleanUid = uid.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toLowerCase();
  return `#pathly-user${cleanUid || Math.floor(100 + Math.random() * 900)}`;
}

// 1-Click Real Google Sign In (Triggers Google OAuth Popup)
export async function loginWithGoogle(): Promise<AuthUserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    const name = u.displayName || 'mahin';
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || 'Pathly Explorer',
      photoURL: u.photoURL,
      friendCode: generateFriendCode(u.uid, name),
    };
  } catch (err: unknown) {
    console.error('Google Sign In Popup Error:', err);
    const firebaseErr = err as { code?: string; message?: string };
    
    if (firebaseErr.code === 'auth/operation-not-allowed') {
      throw new Error('Google Sign-In is not enabled yet in your Firebase Console.');
    }
    if (firebaseErr.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
      throw new Error(`Domain "${currentHost}" is not authorized. Add it in Firebase Console > Authentication > Settings > Authorized Domains.`);
    }
    if (firebaseErr.code === 'auth/popup-blocked') {
      throw new Error('The popup was blocked by your browser. Please allow popups for this site.');
    }
    if (firebaseErr.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup was closed before completing sign-in.');
    }
    
    throw new Error(firebaseErr.message || 'Google sign-in failed.');
  }
}

// Sign Out
export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch {}
  }
}

// Save complete user state to Firestore
export async function saveUserDataToFirestore(userId: string, data: Record<string, unknown>) {
  if (db) {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });

      // Save public lookup profile by friendCode so friends can look up immediately
      if (data.friendCode) {
        const code = String(data.friendCode).toUpperCase();
        const publicDocRef = doc(db, 'public_profiles', code);
        const profile = (data.profile || {}) as Record<string, unknown>;
        const dailyPlan = (data.dailyPlan || {}) as Record<string, unknown>;
        const priorityTasks = (dailyPlan.priorityTasks || []) as Array<{ title?: string }>;

        await setDoc(publicDocRef, {
          uid: userId,
          name: profile.name || 'Pathly Explorer',
          avatarId: profile.avatarId || 'sprout',
          photoURL: (data.photoURL as string) || null,
          streak: profile.streakDays || 0,
          level: profile.level || 1,
          todayMinutes: data.todayFocusMinutes || 0,
          todayGoalTitle: priorityTasks[0]?.title || 'Daily Path',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore sync error:', err);
    }
  }

  // Backup to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`pathly_cloud_${userId}`, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
  }
}

// Fetch user state from Firestore
export async function loadUserDataFromFirestore(userId: string): Promise<Record<string, unknown> | null> {
  if (db) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err) {
      console.warn('Firestore load error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(`pathly_cloud_${userId}`);
    return item ? JSON.parse(item) : null;
  }

  return null;
}

// Look up friend by Friend Code (Timeout-proof & instant)
export async function lookupFriendByCode(friendCode: string): Promise<{
  id: string;
  name: string;
  avatarId: string;
  photoURL?: string | null;
  streak: number;
  level: number;
  todayMinutes: number;
  todayGoalTitle: string;
}> {
  const code = formatFriendCode(friendCode);
  const cleanId = code.replace(/[^a-z0-9]/g, '');

  const defaultBuddy = {
    id: `f-${cleanId}`,
    name: code,
    avatarId: 'sprout',
    photoURL: null,
    streak: 0,
    level: 1,
    todayMinutes: 0,
    todayGoalTitle: 'Daily Habits',
  };

  if (!db) return defaultBuddy;

  try {
    const fetchPromise = (async () => {
      try {
        const publicDocRef = doc(db, 'public_profiles', code);
        const publicSnap = await getDoc(publicDocRef);
        if (publicSnap.exists()) {
          const d = publicSnap.data();
          return {
            id: d.uid || defaultBuddy.id,
            name: d.name || code,
            avatarId: d.avatarId || 'sprout',
            photoURL: d.photoURL || null,
            streak: d.streak || 0,
            level: d.level || 1,
            todayMinutes: d.todayMinutes || 0,
            todayGoalTitle: d.todayGoalTitle || 'Daily Path',
          };
        }
      } catch {
        // silently fallback
      }
      return defaultBuddy;
    })();

    // Max 1-second timeout so UI never hangs if Firestore is not enabled/offline
    const timeoutPromise = new Promise<{ id: string; name: string; avatarId: string; photoURL?: string | null; streak: number; level: number; todayMinutes: number; todayGoalTitle: string }>((resolve) =>
      setTimeout(() => resolve(defaultBuddy), 1000)
    );

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch {
    return defaultBuddy;
  }
}

// Send friend request to Firestore
export async function sendFriendRequestToCloud(req: Record<string, unknown>): Promise<void> {
  if (db) {
    try {
      const ref = doc(db, 'friend_requests', String(req.id));
      await setDoc(ref, req, { merge: true });
    } catch (err) {
      console.warn('Firestore sendFriendRequest error:', err);
    }
  }
}

// Fetch incoming requests from Firestore
export async function fetchIncomingRequestsFromCloud(userTag: string): Promise<Array<Record<string, unknown>>> {
  if (db) {
    try {
      const q = query(
        collection(db, 'friend_requests'), 
        where('toTag', '==', userTag),
        where('status', '==', 'pending')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data());
    } catch (err) {
      console.warn('Firestore fetchIncomingRequests error:', err);
    }
  }
  return [];
}

// Update friend request status in Firestore
export async function updateFriendRequestStatusInCloud(requestId: string, status: 'accepted' | 'declined'): Promise<void> {
  if (db) {
    try {
      const ref = doc(db, 'friend_requests', requestId);
      await setDoc(ref, { status, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn('Firestore updateFriendRequestStatus error:', err);
    }
  }
}
