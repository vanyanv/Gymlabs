// src/repositories/exerciseRepository.ts
import NodeCache from 'node-cache';
import wgerApiService from '../services/wgerApiService';
import { ExerciseNameInfo } from '../types/wger.types';

class ExerciseRepository {
  private cache: NodeCache;
  private CACHE_KEYS: {
    EXERCISE_NAMES: string;
  };

  constructor() {
    // Cache with TTL of 1 day for exercise data
    this.cache = new NodeCache({ stdTTL: 86400 });
    this.CACHE_KEYS = {
      EXERCISE_NAMES: 'exercise_names',
    };
  }

  async getExerciseNames(language: number = 2): Promise<ExerciseNameInfo[]> {
    const cacheKey = `${this.CACHE_KEYS.EXERCISE_NAMES}_${language}`;

    // Try to get from cache first
    const cachedExerciseNames = this.cache.get<ExerciseNameInfo[]>(cacheKey);
    if (cachedExerciseNames) {
      return cachedExerciseNames;
    }

    try {
      // Fetch from API if not in cache
      const exerciseNames = await wgerApiService.getExerciseNames(language);

      // Save to cache
      this.cache.set(cacheKey, exerciseNames);

      return exerciseNames;

    } catch (error) {
      console.error(
        `Failed to fetch exercise names: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      //returning a empty array
      return []
    }
  }

  // Method to manually invalidate cache
  invalidateCache(): void {
    this.cache.flushAll();
  }
}

export default new ExerciseRepository();
