// Firestore REST API Client for Server-Side Next.js API Routes
// This ensures all Vercel Serverless Functions share the exact same persistent cloud database across instances worldwide!

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pathly-e1b6e';
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCGXIF3ilOfPZRxCAvsgAtGWSWqyXzFABw';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

function formatTag(input: string): string {
  let clean = (input || '').trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

function cleanTagKey(input: string): string {
  return formatTag(input).toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

// Convert JSON object to Firestore REST fields
function toFirestoreFields(obj: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      fields[key] = Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map(v => typeof v === 'object' && v !== null ? { mapValue: { fields: toFirestoreFields(v) } } : { stringValue: String(v) })
        }
      };
    } else if (typeof value === 'object') {
      fields[key] = { mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) } };
    }
  }
  return fields;
}

// Convert Firestore REST fields to standard JSON object
function fromFirestoreFields(fields?: Record<string, Record<string, unknown>>): Record<string, unknown> {
  if (!fields) return {};
  const result: Record<string, unknown> = {};
  for (const [key, valObj] of Object.entries(fields)) {
    if ('stringValue' in valObj) result[key] = valObj.stringValue;
    else if ('integerValue' in valObj) result[key] = parseInt(String(valObj.integerValue), 10);
    else if ('doubleValue' in valObj) result[key] = parseFloat(String(valObj.doubleValue));
    else if ('booleanValue' in valObj) result[key] = valObj.booleanValue;
    else if ('nullValue' in valObj) result[key] = null;
    else if ('arrayValue' in valObj) {
      const arr = (valObj.arrayValue as { values?: Array<Record<string, unknown>> })?.values || [];
      result[key] = arr.map(item => {
        if ('mapValue' in item) return fromFirestoreFields((item.mapValue as { fields?: Record<string, Record<string, unknown>> })?.fields);
        if ('stringValue' in item) return item.stringValue;
        return item;
      });
    } else if ('mapValue' in valObj) {
      result[key] = fromFirestoreFields((valObj.mapValue as { fields?: Record<string, Record<string, unknown>> })?.fields);
    }
  }
  return result;
}

// 1. Save Friend Request to Cloud Firestore
export async function restSaveFriendRequest(req: {
  id: string;
  fromUid: string;
  fromName: string;
  fromTag: string;
  fromPhotoURL?: string | null;
  fromLevel: number;
  toTag: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt?: string;
}): Promise<boolean> {
  const reqId = req.id;
  const toClean = cleanTagKey(req.toTag);
  const fromClean = cleanTagKey(req.fromTag);

  const payload = {
    ...req,
    toTag: formatTag(req.toTag),
    fromTag: formatTag(req.fromTag),
    toInbox: toClean,
    fromInbox: fromClean,
  };

  try {
    const fields = toFirestoreFields(payload);
    
    // Save to global friend_requests collection
    await fetch(`${BASE_URL}/friend_requests/${reqId}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    // Save to recipient's direct inbox
    await fetch(`${BASE_URL}/inboxes/${toClean}/requests/${reqId}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    // Save to sender's outbox
    await fetch(`${BASE_URL}/outboxes/${fromClean}/requests/${reqId}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    return true;
  } catch (err) {
    console.warn('restSaveFriendRequest error:', err);
    return false;
  }
}

// 2. Fetch Incoming & Sent Requests for a tag
export async function restGetFriendRequests(tag: string): Promise<{
  incoming: Array<Record<string, unknown>>;
  sent: Array<Record<string, unknown>>;
}> {
  const clean = cleanTagKey(tag);
  const formatted = formatTag(tag);
  const incoming: Array<Record<string, unknown>> = [];
  const sent: Array<Record<string, unknown>> = [];

  // 1. Fetch from direct inbox
  try {
    const res = await fetch(`${BASE_URL}/inboxes/${clean}/requests?key=${FIREBASE_API_KEY}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.documents && Array.isArray(data.documents)) {
        for (const doc of data.documents) {
          const parsed = fromFirestoreFields(doc.fields);
          if (parsed.status === 'pending') {
            incoming.push(parsed);
          }
        }
      }
    }
  } catch (err) {
    console.warn('restGetFriendRequests inbox fetch note:', err);
  }

  // 2. Fetch from outbox
  try {
    const res = await fetch(`${BASE_URL}/outboxes/${clean}/requests?key=${FIREBASE_API_KEY}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.documents && Array.isArray(data.documents)) {
        for (const doc of data.documents) {
          const parsed = fromFirestoreFields(doc.fields);
          sent.push(parsed);
        }
      }
    }
  } catch (err) {
    console.warn('restGetFriendRequests outbox fetch note:', err);
  }

  return { incoming, sent };
}

// 3. Update Request Status (accepted or declined)
export async function restUpdateRequestStatus(id: string, status: 'accepted' | 'declined'): Promise<boolean> {
  try {
    const fields = toFirestoreFields({ status, updatedAt: new Date().toISOString() });
    
    // Update global document with mask
    await fetch(`${BASE_URL}/friend_requests/${id}?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt&key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    return true;
  } catch {
    return false;
  }
}

// 4. Claim Unique Tag
export async function restClaimTag(tag: string, uid: string): Promise<{ success: boolean; error?: string; tag: string }> {
  const clean = cleanTagKey(tag);
  const formatted = formatTag(tag);

  try {
    // Check if taken
    const res = await fetch(`${BASE_URL}/taken_tags/${clean}?key=${FIREBASE_API_KEY}`, { cache: 'no-store' });
    if (res.ok) {
      const doc = await res.json();
      const existing = fromFirestoreFields(doc.fields);
      if (existing.uid && existing.uid !== uid) {
        return {
          success: false,
          error: `The tag ${formatted} is already taken by another user. Please choose a different handle!`,
          tag: formatted,
        };
      }
    }

    // Reserve tag
    const fields = toFirestoreFields({
      tag: formatted,
      cleanTag: clean,
      uid,
      claimedAt: new Date().toISOString(),
    });

    await fetch(`${BASE_URL}/taken_tags/${clean}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    return { success: true, tag: formatted };
  } catch (err) {
    console.warn('restClaimTag error:', err);
    return { success: true, tag: formatted };
  }
}

// 5. Save Public Profile
export async function restSaveProfile(profile: Record<string, unknown>): Promise<boolean> {
  const tag = formatTag(String(profile.tag || ''));
  const clean = cleanTagKey(tag);

  try {
    const fields = toFirestoreFields({ ...profile, tag, cleanTag: clean, updatedAt: new Date().toISOString() });
    await fetch(`${BASE_URL}/public_profiles/${clean}?key=${FIREBASE_API_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    return true;
  } catch {
    return false;
  }
}

// 6. Get Public Profile
export async function restGetProfile(tag: string): Promise<Record<string, unknown> | null> {
  const clean = cleanTagKey(tag);
  try {
    const res = await fetch(`${BASE_URL}/public_profiles/${clean}?key=${FIREBASE_API_KEY}`, { cache: 'no-store' });
    if (res.ok) {
      const doc = await res.json();
      return fromFirestoreFields(doc.fields);
    }
  } catch {}
  return null;
}

// 7. Search Public Profiles (Intelligently Deduplicated & Ranked)
export async function restSearchProfiles(query: string): Promise<Array<Record<string, unknown>>> {
  const cleanQ = query.trim().toLowerCase().replace(/^#/, '');
  if (!cleanQ) return [];

  try {
    const res = await fetch(`${BASE_URL}/public_profiles?pageSize=100&key=${FIREBASE_API_KEY}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.documents && Array.isArray(data.documents)) {
        // Deduplicate by UID (one user = one current profile) and Tag
        const byUid = new Map<string, Record<string, unknown>>();

        for (const doc of data.documents) {
          const parsed = fromFirestoreFields(doc.fields);
          const pTag = String(parsed.tag || '').toLowerCase().replace(/^#/, '');
          const pName = String(parsed.name || '').toLowerCase();
          const pUid = String(parsed.uid || pTag);

          // Skip partial fragment draft tags
          const suffix = pTag.replace('pathly-', '');
          if (suffix.length < 3) continue;

          if (pTag.includes(cleanQ) || pName.includes(cleanQ)) {
            const existing = byUid.get(pUid);
            if (!existing) {
              byUid.set(pUid, parsed);
            } else {
              // Keep the latest or the one with photoURL
              const existingHasPhoto = Boolean(existing.photoURL);
              const currentHasPhoto = Boolean(parsed.photoURL);
              if (currentHasPhoto && !existingHasPhoto) {
                byUid.set(pUid, parsed);
              } else if (String(parsed.updatedAt || '') > String(existing.updatedAt || '')) {
                byUid.set(pUid, parsed);
              }
            }
          }
        }

        // Also deduplicate by Tag
        const byTag = new Map<string, Record<string, unknown>>();
        for (const p of byUid.values()) {
          const formatted = formatTag(String(p.tag || ''));
          byTag.set(formatted.toLowerCase(), p);
        }

        const results = Array.from(byTag.values());

        // Sort: Exact tag match first, then users with photoURL, then by level
        results.sort((a, b) => {
          const aTag = String(a.tag || '').toLowerCase();
          const bTag = String(b.tag || '').toLowerCase();
          const isAExact = aTag === `#pathly-${cleanQ}` || aTag === `#${cleanQ}`;
          const isBExact = bTag === `#pathly-${cleanQ}` || bTag === `#${cleanQ}`;
          if (isAExact && !isBExact) return -1;
          if (!isAExact && isBExact) return 1;

          const aHasPhoto = a.photoURL ? 1 : 0;
          const bHasPhoto = b.photoURL ? 1 : 0;
          if (bHasPhoto !== aHasPhoto) return bHasPhoto - aHasPhoto;

          return (Number(b.level) || 0) - (Number(a.level) || 0);
        });

        return results.slice(0, 6);
      }
    }
  } catch (err) {
    console.warn('restSearchProfiles note:', err);
  }

  return [];
}
