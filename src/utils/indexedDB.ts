import { VideoClip } from '../types/feed';

const DB_NAME = 'tokshop_indexed_db';
const DB_VERSION = 1;
const STORE_NAME = 'user_posts';

export interface StoredPostRecord {
  id: string;
  createdAt: number;
  clipData: VideoClip;
  mediaBlob?: Blob;
  mediaType: 'video' | 'image' | 'url';
  mimeType?: string;
  originalUrl?: string;
}

/**
 * Open or initialize the IndexedDB instance for TikTok Shop posts
 */
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Persists a video/image post and its binary Blob data into IndexedDB.
 * Supports large video files, camera recordings, photos, and presets.
 */
export async function savePostToDB(
  clip: VideoClip,
  mediaBlob?: Blob | File
): Promise<void> {
  let blobToStore: Blob | undefined = mediaBlob;
  let mediaType: 'video' | 'image' | 'url' = 'video';
  let mimeType = mediaBlob?.type;

  // If no blob was passed directly but the URL is a transient blob: or data: URL,
  // fetch the underlying binary data so it survives page reloads.
  if (!blobToStore && clip.videoUrl) {
    if (clip.videoUrl.startsWith('blob:') || clip.videoUrl.startsWith('data:')) {
      try {
        const res = await fetch(clip.videoUrl);
        blobToStore = await res.blob();
        mimeType = blobToStore.type;
      } catch (err) {
        console.warn('Could not extract blob from url, saving URL reference:', err);
      }
    }
  }

  if (blobToStore) {
    if (blobToStore.type.startsWith('image/')) {
      mediaType = 'image';
    } else {
      mediaType = 'video';
    }
  } else {
    // Check if the URL string indicates an image or video
    const isImg = clip.videoUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i);
    mediaType = isImg ? 'image' : 'video';
  }

  const record: StoredPostRecord = {
    id: clip.id,
    createdAt: Date.now(),
    clipData: clip,
    mediaBlob: blobToStore,
    mediaType,
    mimeType: mimeType || (mediaType === 'image' ? 'image/jpeg' : 'video/mp4'),
    originalUrl: clip.videoUrl,
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putRequest = store.put(record);

    putRequest.onsuccess = () => resolve();
    putRequest.onerror = () => reject(putRequest.error || new Error('Failed to save post to IndexedDB'));
  });
}

/**
 * Retrieves all stored posts from IndexedDB ordered by creation time (newest first).
 */
export async function getAllPostsFromDB(): Promise<StoredPostRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = (request.result as StoredPostRecord[]) || [];
        // Sort newest first
        records.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        resolve(records);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to get posts from IndexedDB'));
      };
    });
  } catch (err) {
    console.warn('Error reading from IndexedDB:', err);
    return [];
  }
}

/**
 * Deletes a post from IndexedDB by id.
 */
export async function deletePostFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error('Failed to delete post from IndexedDB'));
    });
  } catch (err) {
    console.warn('Error deleting from IndexedDB:', err);
  }
}

/**
 * Updates an existing post's metadata (e.g. likes, saves, comments) in IndexedDB
 * without modifying the existing stored binary blob.
 */
export async function updatePostInDB(clip: VideoClip): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(clip.id);

      getReq.onsuccess = () => {
        const record = getReq.result as StoredPostRecord | undefined;
        if (record) {
          record.clipData = clip;
          const putReq = store.put(record);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        } else {
          resolve();
        }
      };

      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.warn('Error updating post in IndexedDB:', err);
  }
}

/**
 * Converts stored records into ready-to-render VideoClip objects by
 * creating fresh, active Object URLs for the stored Blobs.
 */
export function reconstructClipsFromRecords(records: StoredPostRecord[]): VideoClip[] {
  return records.map((record) => {
    let activeUrl = record.originalUrl || record.clipData.videoUrl;

    if (record.mediaBlob) {
      try {
        activeUrl = URL.createObjectURL(record.mediaBlob);
      } catch (e) {
        console.warn('Could not create ObjectURL for blob:', e);
      }
    }

    return {
      ...record.clipData,
      videoUrl: activeUrl,
      posterUrl: record.mediaType === 'image' ? activeUrl : (record.clipData.posterUrl || activeUrl),
    };
  });
}
