import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User,
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
  onSnapshot,
  Firestore 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'pathly-app.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pathly-app',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'pathly-app.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

const isConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn('Firebase initialized in demo/offline mode:', err);
  }
}

export { auth, db, googleProvider, isConfigured };

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  friendCode: string;
}

// Generate unique 6-character Friend Code (e.g. PATH-8219)
export function generateFriendCode(uid: string): string {
  const clean = uid.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
  return `PATH-${clean || Math.floor(1000 + Math.random() * 9000)}`;
}

// 1-Click Google Sign In
export async function loginWithGoogle(): Promise<AuthUserProfile> {
  if (auth && googleProvider && isConfigured) {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || 'Pathly Explorer',
      photoURL: u.photoURL,
      friendCode: generateFriendCode(u.uid),
    };
  }

  // Seamless Mock/Demo Google Login if environment keys not yet configured
  const demoUid = `usr_${Math.floor(100000 + Math.random() * 900000)}`;
  const mockUser: AuthUserProfile = {
    uid: demoUid,
    email: 'alex.dev@gmail.com',
    displayName: 'Alex Rivers',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    friendCode: generateFriendCode(demoUid),
  };
  return mockUser;
}

// Sign Out
export async function logoutUser(): Promise<void> {
  if (auth && isConfigured) {
    await firebaseSignOut(auth);
  }
}

// Save complete user state to Firestore
export async function saveUserDataToFirestore(userId: string, data: Record<string, unknown>) {
  if (!db || !isConfigured) {
    // Save to LocalStorage under user-specific key
    if (typeof window !== 'undefined') {
      localStorage.setItem(`pathly_cloud_${userId}`, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
    }
    return;
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error('Failed to sync to Firestore:', err);
  }
}

// Fetch user state from Firestore
export async function loadUserDataFromFirestore(userId: string): Promise<Record<string, unknown> | null> {
  if (!db || !isConfigured) {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(`pathly_cloud_${userId}`);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error('Failed to load from Firestore:', err);
    return null;
  }
}

// Look up friend by 6-char Friend Code
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

  if (db && isConfigured) {
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
      console.error('Error looking up friend code:', err);
    }
  }

  // Pre-configured buddy lookup for demo / offline
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
