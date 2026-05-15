type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<any>>();

const TTL = 5 * 60 * 1000;

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

export function setCache<T>(key: string, data: T) {
  cache.set(key, {
    data,
    expiry: Date.now() + TTL,
  });
}
