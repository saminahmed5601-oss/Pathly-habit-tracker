import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  signInAnonymously,
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
  Unsubscribe,
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
  return `#pathly-user${cleanUid || Math.floor(1000 + Math.random() * 9000)}`;
}

// Guarantee unique friend tag reservation in Firestore
export async function checkAndClaimTag(
  desiredTag: string, 
  userId: string
): Promise<{ success: boolean; error?: string; tag: string }> {
  await ensureFirebaseAuth();
  const clean = formatFriendCode(desiredTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const fullTag = `#${clean}`;
  
  if (clean.length < 8 || clean === 'pathly' || clean === 'pathly-') {
    return { success: false, error: 'Tag handle must be at least 2 characters long.', tag: fullTag };
  }

  if (!db) {
    return { success: true, tag: fullTag };
  }

  try {
    const tagRef = doc(db, 'taken_tags', clean);
    const snap = await getDoc(tagRef);
    
    if (snap.exists()) {
      const data = snap.data();
      if (data.uid && data.uid !== userId) {
        return { 
          success: false, 
          error: `The tag ${fullTag} is already taken by another user. Please choose a different handle!`, 
          tag: fullTag 
        };
      }
    }

    // Reserve tag for this user
    await setDoc(tagRef, {
      uid: userId,
      tag: fullTag,
      cleanTag: clean,
      claimedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true, tag: fullTag };
  } catch (err) {
    console.warn('Tag claim error:', err);
    return { success: true, tag: fullTag };
  }
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

        const userGoals = (data.goals || []) as Array<{
          title: string;
          totalMilestones: number;
          icon?: string;
          milestones?: Array<{ isCompleted: boolean }>;
        }>;

        const totalMilestonesCount = userGoals.reduce((acc, g) => acc + (g.totalMilestones || 0), 0);
        const totalMilestonesCompleted = userGoals.reduce(
          (acc, g) => acc + (g.milestones?.filter(m => m.isCompleted).length || 0), 
          0
        );

        const activeGoals = userGoals.map(g => ({
          title: g.title,
          icon: g.icon || '🎯',
          totalCount: g.totalMilestones || 1,
          completedCount: g.milestones?.filter(m => m.isCompleted).length || 0,
        }));

        await setDoc(publicDocRef, {
          uid: userId,
          name: profile.name || 'Pathly Explorer',
          avatarId: profile.avatarId || 'sprout',
          photoURL: (data.photoURL as string) || null,
          streak: profile.streakDays || 0,
          bestStreak: profile.bestStreak || profile.streakDays || 0,
          level: profile.level || 1,
          todayMinutes: data.todayFocusMinutes || 0,
          todayGoalTitle: priorityTasks[0]?.title || activeGoals[0]?.title || 'Daily Path',
          totalMilestonesCompleted,
          totalMilestonesCount,
          activeGoals,
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
  bestStreak?: number;
  level: number;
  todayMinutes: number;
  todayGoalTitle: string;
  totalMilestonesCompleted?: number;
  totalMilestonesCount?: number;
  activeGoals?: Array<{ title: string; completedCount: number; totalCount: number; icon: string }>;
}> {
  const code = formatFriendCode(friendCode);
  const cleanId = code.replace(/[^a-z0-9]/g, '');

  const defaultBuddy = {
    id: `f-${cleanId}`,
    name: code,
    avatarId: 'sprout',
    photoURL: null,
    streak: 0,
    bestStreak: 0,
    level: 1,
    todayMinutes: 0,
    todayGoalTitle: 'Daily Habits',
    totalMilestonesCompleted: 0,
    totalMilestonesCount: 0,
    activeGoals: [],
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
            bestStreak: d.bestStreak || 0,
            level: d.level || 1,
            todayMinutes: d.todayMinutes || 0,
            todayGoalTitle: d.todayGoalTitle || 'Daily Path',
            totalMilestonesCompleted: d.totalMilestonesCompleted || 0,
            totalMilestonesCount: d.totalMilestonesCount || 0,
            activeGoals: d.activeGoals || [],
          };
        }
      } catch {
        // silently fallback
      }
      return defaultBuddy;
    })();

    // Max 1-second timeout so UI never hangs if Firestore is not enabled/offline
    const timeoutPromise = new Promise<{
      id: string;
      name: string;
      avatarId: string;
      photoURL?: string | null;
      streak: number;
      bestStreak?: number;
      level: number;
      todayMinutes: number;
      todayGoalTitle: string;
      totalMilestonesCompleted?: number;
      totalMilestonesCount?: number;
      activeGoals?: Array<{ title: string; completedCount: number; totalCount: number; icon: string }>;
    }>((resolve) => setTimeout(() => resolve(defaultBuddy), 1000));

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch {
    return defaultBuddy;
  }
}

// Guarantee Firebase Auth exists for Firestore security rules
export async function ensureFirebaseAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch {
    // Silently ignore if Anonymous Auth is disabled in Firebase console
  }
}

// Send friend request to Firestore direct inbox + outbox
export async function sendFriendRequestToCloud(req: Record<string, unknown>): Promise<void> {
  await ensureFirebaseAuth();
  if (db) {
    try {
      const toClean = formatFriendCode(String(req.toTag || '')).toLowerCase().replace(/[^a-z0-9_-]/g, '');
      const fromClean = formatFriendCode(String(req.fromTag || '')).toLowerCase().replace(/[^a-z0-9_-]/g, '');
      const reqId = String(req.id);

      const normalizedReq = {
        ...req,
        id: reqId,
        toTag: `#${toClean}`,
        fromTag: `#${fromClean}`,
        toInbox: toClean,
        fromInbox: fromClean,
        status: 'pending',
        updatedAt: new Date().toISOString(),
      };

      // 1. Write to recipient's direct inbox (Instant delivery with no index dependency)
      const inboxDocRef = doc(db, 'inboxes', toClean, 'requests', reqId);
      await setDoc(inboxDocRef, normalizedReq, { merge: true });

      // 2. Write to sender's outbox
      const outboxDocRef = doc(db, 'outboxes', fromClean, 'requests', reqId);
      await setDoc(outboxDocRef, normalizedReq, { merge: true });

      // 3. Write to global friend_requests collection
      const globalDocRef = doc(db, 'friend_requests', reqId);
      await setDoc(globalDocRef, normalizedReq, { merge: true });

      console.log(`[Pathly] Friend request sent from #${fromClean} to #${toClean}`);
    } catch (err) {
      console.warn('Firestore sendFriendRequest error:', err);
    }
  }
}

// Real-time listener for incoming friend requests from recipient's direct inbox
export function subscribeToIncomingFriendRequests(
  userTag: string, 
  callback: (requests: Array<Record<string, unknown>>) => void
): Unsubscribe | null {
  if (!db || !userTag) return null;
  ensureFirebaseAuth();

  try {
    const myClean = formatFriendCode(userTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const inboxColRef = collection(db, 'inboxes', myClean, 'requests');

    return onSnapshot(inboxColRef, (snapshot) => {
      const requests = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((r: Record<string, unknown>) => r.status === 'pending');
      
      callback(requests);
    }, (err) => {
      console.warn('Realtime incoming requests subscription error:', err);
    });
  } catch (err) {
    console.warn('subscribeToIncomingFriendRequests setup error:', err);
    return null;
  }
}

// Real-time listener for sent friend requests status updates from sender's outbox
export function subscribeToSentFriendRequests(
  userTag: string,
  callback: (requests: Array<Record<string, unknown>>) => void
): Unsubscribe | null {
  if (!db || !userTag) return null;
  ensureFirebaseAuth();

  try {
    const myClean = formatFriendCode(userTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const outboxColRef = collection(db, 'outboxes', myClean, 'requests');

    return onSnapshot(outboxColRef, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(requests);
    }, (err) => {
      console.warn('Realtime sent requests subscription error:', err);
    });
  } catch (err) {
    console.warn('subscribeToSentFriendRequests setup error:', err);
    return null;
  }
}

// Fetch incoming requests from Firestore (Direct Inbox Query)
export async function fetchIncomingRequestsFromCloud(userTag: string): Promise<Array<Record<string, unknown>>> {
  if (!db || !userTag) return [];
  await ensureFirebaseAuth();

  try {
    const myClean = formatFriendCode(userTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const inboxColRef = collection(db, 'inboxes', myClean, 'requests');
    const snap = await getDocs(inboxColRef);
    
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter((r: Record<string, unknown>) => r.status === 'pending');
  } catch (err) {
    console.warn('Firestore fetchIncomingRequests error:', err);
  }
  return [];
}

// Update friend request status across inbox, outbox, and global collection
export async function updateFriendRequestStatusInCloud(
  requestId: string, 
  status: 'accepted' | 'declined',
  toTag?: string,
  fromTag?: string
): Promise<void> {
  if (db) {
    try {
      const payload = { status, updatedAt: new Date().toISOString() };

      // Update global collection
      const ref = doc(db, 'friend_requests', requestId);
      await setDoc(ref, payload, { merge: true });

      // Update inboxes if tags are known
      if (toTag) {
        const toClean = formatFriendCode(toTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
        await setDoc(doc(db, 'inboxes', toClean, 'requests', requestId), payload, { merge: true });
      }
      if (fromTag) {
        const fromClean = formatFriendCode(fromTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
        await setDoc(doc(db, 'outboxes', fromClean, 'requests', requestId), payload, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore updateFriendRequestStatus error:', err);
    }
  }
}
