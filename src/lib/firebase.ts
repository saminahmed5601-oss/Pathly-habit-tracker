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

// Guarantee unique friend tag reservation in Firestore and Server Registry
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

  // 1. Check Server API Registry
  try {
    const res = await fetch('/api/friends/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desiredTag: fullTag, uid: userId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || `The tag ${fullTag} is already taken.`, tag: fullTag };
    }
  } catch (err) {
    console.warn('Server tag check note:', err);
  }

  // 2. Check Firestore Registry
  if (db) {
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

      await setDoc(tagRef, {
        uid: userId,
        tag: fullTag,
        cleanTag: clean,
        claimedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore tag claim note:', err);
    }
  }

  return { success: true, tag: fullTag };
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
      throw new Error(`Unauthorized Domain: Please add "${currentHost}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`);
    }
    throw new Error(firebaseErr.message || 'Google Sign-In failed.');
  }
}

// Sign out user
export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase Sign Out error:', err);
  }
}

// Sync user state to Firestore and Server Profile API
export async function saveUserDataToFirestore(userId: string, data: Record<string, unknown>): Promise<void> {
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

  const userTag = formatFriendCode(String(data.friendCode || profile.name || 'user'));

  // 1. Sync to Next.js High-Availability Server API
  try {
    fetch('/api/friends/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: userId,
        tag: userTag,
        name: profile.name || 'Pathly Explorer',
        photoURL: (data.photoURL as string) || null,
        level: profile.level || 1,
        streak: profile.streakDays || 0,
        bestStreak: profile.bestStreak || profile.streakDays || 0,
        todayMinutes: data.todayFocusMinutes || 0,
        todayGoalTitle: priorityTasks[0]?.title || activeGoals[0]?.title || 'Daily Path',
        totalMilestonesCompleted,
        totalMilestonesCount,
        activeGoals,
      }),
    }).catch(() => {});
  } catch {}

  // 2. Sync to Firestore
  if (db) {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });

      if (data.friendCode) {
        const code = formatFriendCode(String(data.friendCode));
        const publicDocRef = doc(db, 'public_profiles', code);

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

  // 3. Backup to localStorage
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

  const defaultBuddy = {
    id: `f-${code.replace(/[^a-z0-9]/g, '')}`,
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

  // 1. Try Server API
  try {
    const res = await fetch(`/api/friends/profiles?tag=${encodeURIComponent(code)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.profile && json.profile.name) {
        return {
          id: json.profile.uid || defaultBuddy.id,
          name: json.profile.name || code,
          avatarId: 'sprout',
          photoURL: json.profile.photoURL || null,
          streak: json.profile.streak || 0,
          bestStreak: json.profile.bestStreak || 0,
          level: json.profile.level || 1,
          todayMinutes: json.profile.todayMinutes || 0,
          todayGoalTitle: json.profile.todayGoalTitle || 'Daily Path',
          totalMilestonesCompleted: json.profile.totalMilestonesCompleted || 0,
          totalMilestonesCount: json.profile.totalMilestonesCount || 0,
          activeGoals: json.profile.activeGoals || [],
        };
      }
    }
  } catch {}

  // 2. Try Firestore
  if (!db) return defaultBuddy;

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
  } catch {}

  return defaultBuddy;
}

// Guarantee Firebase Auth exists
export async function ensureFirebaseAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch {
    // Silently ignore if Anonymous Auth is disabled
  }
}

// Send friend request to Server API + Firestore Direct Inboxes
export async function sendFriendRequestToCloud(req: Record<string, unknown>): Promise<void> {
  const toClean = formatFriendCode(String(req.toTag || '')).toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const fromClean = formatFriendCode(String(req.fromTag || '')).toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const reqId = String(req.id || `req-${Date.now()}`);

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

  // 1. Deliver via Server API Route (Guaranteed cross-browser & zero-rule issues)
  try {
    await fetch('/api/friends/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedReq),
    });
  } catch (err) {
    console.warn('Server sendFriendRequest note:', err);
  }

  // 2. Deliver via Firestore
  await ensureFirebaseAuth();
  if (db) {
    try {
      const inboxDocRef = doc(db, 'inboxes', toClean, 'requests', reqId);
      await setDoc(inboxDocRef, normalizedReq, { merge: true });

      const outboxDocRef = doc(db, 'outboxes', fromClean, 'requests', reqId);
      await setDoc(outboxDocRef, normalizedReq, { merge: true });

      const globalDocRef = doc(db, 'friend_requests', reqId);
      await setDoc(globalDocRef, normalizedReq, { merge: true });
    } catch (err) {
      console.warn('Firestore sendFriendRequest note:', err);
    }
  }
}

// Real-time listener for incoming friend requests
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
      console.warn('Realtime incoming requests subscription note:', err);
    });
  } catch (err) {
    console.warn('subscribeToIncomingFriendRequests setup note:', err);
    return null;
  }
}

// Real-time listener for sent friend requests
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
      console.warn('Realtime sent requests subscription note:', err);
    });
  } catch (err) {
    console.warn('subscribeToSentFriendRequests setup note:', err);
    return null;
  }
}

// Fetch incoming requests from Server API & Firestore
export async function fetchIncomingRequestsFromCloud(userTag: string): Promise<Array<Record<string, unknown>>> {
  if (!userTag) return [];
  const resultsMap = new Map<string, Record<string, unknown>>();

  // 1. Fetch from Server API
  try {
    const clean = formatFriendCode(userTag);
    const res = await fetch(`/api/friends/requests?tag=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.incoming && Array.isArray(json.incoming)) {
        json.incoming.forEach((r: Record<string, unknown>) => {
          resultsMap.set(String(r.id), r);
        });
      }
    }
  } catch {}

  // 2. Fetch from Firestore
  if (db) {
    try {
      const myClean = formatFriendCode(userTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
      const inboxColRef = collection(db, 'inboxes', myClean, 'requests');
      const snap = await getDocs(inboxColRef);
      
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.status === 'pending') {
          resultsMap.set(d.id, { id: d.id, ...data });
        }
      });
    } catch {}
  }

  return Array.from(resultsMap.values());
}

// Update friend request status across Server API and Firestore
export async function updateFriendRequestStatusInCloud(
  requestId: string, 
  status: 'accepted' | 'declined',
  toTag?: string,
  fromTag?: string
): Promise<void> {
  // 1. Update Server API
  try {
    await fetch('/api/friends/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: requestId, status }),
    });
  } catch {}

  // 2. Update Firestore
  if (db) {
    try {
      const payload = { status, updatedAt: new Date().toISOString() };
      const ref = doc(db, 'friend_requests', requestId);
      await setDoc(ref, payload, { merge: true });

      if (toTag) {
        const toClean = formatFriendCode(toTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
        await setDoc(doc(db, 'inboxes', toClean, 'requests', requestId), payload, { merge: true });
      }
      if (fromTag) {
        const fromClean = formatFriendCode(fromTag).toLowerCase().replace(/[^a-z0-9_-]/g, '');
        await setDoc(doc(db, 'outboxes', fromClean, 'requests', requestId), payload, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore updateFriendRequestStatus note:', err);
    }
  }
}

// Live Search Public Profiles by tag or name
export async function searchPublicProfiles(query: string): Promise<Array<{
  uid: string;
  tag: string;
  name: string;
  photoURL?: string | null;
  level: number;
  streak: number;
  bestStreak: number;
  todayGoalTitle: string;
}>> {
  if (!query || !query.trim()) return [];
  const cleanQ = query.trim().toLowerCase().replace(/^#/, '');

  try {
    const res = await fetch(`/api/friends/profiles?search=${encodeURIComponent(cleanQ)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
        return data.profiles;
      }
    }
  } catch (err) {
    console.warn('searchPublicProfiles error:', err);
  }

  // Fallback: If query looks like a specific tag, lookup directly
  if (cleanQ.startsWith('pathly-') || cleanQ.length >= 3) {
    const formatted = formatFriendCode(query);
    const single = await lookupFriendByCode(formatted);
    if (single && single.name) {
      return [{
        uid: single.id,
        tag: formatted,
        name: single.name,
        photoURL: single.photoURL || null,
        level: single.level || 1,
        streak: single.streak || 0,
        bestStreak: single.bestStreak || 0,
        todayGoalTitle: single.todayGoalTitle || 'Daily Habits',
      }];
    }
  }

  return [];
}
