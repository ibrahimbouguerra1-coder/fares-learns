import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
} from 'firebase/firestore';
import type { UserProgress } from '../types/learning.ts';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

const googleProvider = new GoogleAuthProvider();

// Test server connection as per Firebase skill constraint
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client is offline or database initializing.');
    }
  }
}
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

testConnection();

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

export async function loginAnonymously(): Promise<User | null> {
  try {
    const result = await firebaseSignInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous Sign-In failed:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign-Out failed:', error);
    throw error;
  }
}

export async function syncProgressToCloud(
  userId: string,
  progress: UserProgress
): Promise<boolean> {
  if (!userId) return false;
  const path = `users/${userId}/progress/current`;
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    await setDoc(
      progressRef,
      {
        ...progress,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err: any) {
    if (err?.code === 'permission-denied' || (err?.message && err.message.includes('permission'))) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    console.warn('Cloud sync error (progress saved locally):', err);
    return false;
  }
}

export async function fetchProgressFromCloud(
  userId: string
): Promise<Partial<UserProgress> | null> {
  if (!userId) return null;
  const path = `users/${userId}/progress/current`;
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    const snap = await getDoc(progressRef);
    if (snap.exists()) {
      return snap.data() as Partial<UserProgress>;
    }
    return null;
  } catch (err: any) {
    if (err?.code === 'permission-denied' || (err?.message && err.message.includes('permission'))) {
      handleFirestoreError(err, OperationType.GET, path);
    }
    console.warn('Could not fetch cloud progress, falling back to local state:', err);
    return null;
  }
}

export { onAuthStateChanged };
