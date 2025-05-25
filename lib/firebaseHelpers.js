import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/admin/firebaseConfig';

/**
 * Fetches all document IDs from the 'anime' collection in Firestore.
 * These IDs are used in getStaticPaths for Next.js static generation.
 */
export async function fetchAllAppIds() {
  try {
    const snapshot = await getDocs(collection(db, 'anime'));
    const ids = snapshot.docs.map(doc => doc.id);
    return ids;
  } catch (error) {
    console.error('Failed to fetch app IDs:', error);
    return [];
  }
}
