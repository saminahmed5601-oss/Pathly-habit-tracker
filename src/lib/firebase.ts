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

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCGXIF3ilOfPZRxCAvsgAtGWSWqyXzFABw',
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

export function generateFriendCode(uid: string): string {
  const clean = uid.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  return `PATH-${clean || Math.floor(1000 + Math.random() * 9000)}`;
}

// 1-Click Real Google Sign In (Triggers Google OAuth Popup)
export async function loginWithGoogle(): Promise<AuthUserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || 'Pathly Explorer',
      photoURL: u.photoURL,
      friendCode: generateFriendCode(u.uid),
    };
  } catch (err: unknown) {
    console.error('Google Sign In Popup Error:', err);
    const firebaseErr = err as { code?: string; message?: string };
    
    if (firebaseErr.code === 'auth/operation-not-allowed') {
      throw new Error('Google Sign-In is not enabled yet in your Firebase Console. Go to Security > Authentication > Sign-in method > Enable Google.');
    }
    if (firebaseErr.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      throw new Error(`Domain "${currentHost}" is not authorized. In Firebase Console, go to Authentication > Settings > Authorized Domains and add "${currentHost}".`);
    }
    if (firebaseErr.code === 'auth/popup-blocked') {
      throw new Error('The popup was blocked by your browser. Please allow popups for this site.');
    }
    if (firebaseErr.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup was closed before completing sign-in.');
    }
    
    throw new Error(firebaseErr.message || 'Google sign-in failed. Please check your Firebase settings.');
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

// Look up friend by Friend Code
export async function lookupFriendByCode(friendCode: string): Promise<{
  id: string;
  name: string;
  avatarId: string;
  streak: number;
  level: number;
  todayMinutes: number;
  todayGoalTitle: string;
} | null> {
  const code = friendCode.trim().toUpperCase();

  if (db) {
    try {
      const q = query(collection(db, 'users'), where('friendCode', '==', code));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const docData = querySnap.docs[0].data();
        return {
          id: docData.uid || querySnap.docs[0].id,
          name: docData.profile?.name || 'Buddy',
          avatarId: docData.profile?.avatarId || 'sprout',
          streak: docData.profile?.streakDays || 1,
          level: docData.profile?.level || 1,
          todayMinutes: docData.todayFocusMinutes || 45,
          todayGoalTitle: docData.dailyPlan?.priorityTasks?.[0]?.title || 'Daily Goals',
        };
      }
    } catch (err) {
      console.warn('Firestore friend lookup error:', err);
    }
  }

  // Fallback demo buddies
  const sampleBuddies: Record<string, { name: string; avatarId: string; streak: number; level: number; todayMinutes: number; todayGoalTitle: string }> = {
    'PATH-MAYA': { name: 'Maya Chen', avatarId: 'fox', streak: 12, level: 5, todayMinutes: 85, todayGoalTitle: 'LeetCode Medium Graphs' },
    'PATH-LIAM': { name: 'Liam Walker', avatarId: 'cat', streak: 6, level: 4, todayMinutes: 110, todayGoalTitle: 'Tailwind UI Polish' },
    'PATH-ZARA': { name: 'Zara Patel', avatarId: 'blossom', streak: 21, level: 7, todayMinutes: 60, todayGoalTitle: 'Kanji Flashcards N4' },
  };

  if (sampleBuddies[code]) {
    return {
      id: `f-${code.toLowerCase()}`,
      ...sampleBuddies[code],
    };
  }

  return {
    id: `f-${Date.now()}`,
    name: `Buddy (${code})`,
    avatarId: 'spark',
    streak: 3,
    level: 2,
    todayMinutes: 40,
    todayGoalTitle: 'Web Dev & Habits',
  };
}
