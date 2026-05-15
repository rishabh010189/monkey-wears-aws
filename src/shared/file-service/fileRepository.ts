import { streamToString } from '../../utils/streamToString';
import { getCache, setCache } from './cache';
import { getS3File } from './s3';

const bucket = process.env.BUCKET_NAME!;

export async function getJsonFile<T>(key: string): Promise<T> {
  const cached = getCache<T>(key);

  if (cached) {
    console.log('CACHE HIT');
    return cached;
  }

  console.log('CACHE MISS');

  const file = await getS3File(bucket, key);

  const parsed = JSON.parse(await streamToString(file || {}));

  setCache(key, parsed);

  return parsed;
}
