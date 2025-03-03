// src/types/wger.types.ts
export interface Exercise {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  } | null;
  description: string;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
  language: number;
  license: number;
  license_author: string;
  variations: number[];
}

export interface ExerciseNameInfo {
  id: number;
  name: string;
  category: string; // String representation of the category name for simplified use cases
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Tokens {
  access: string;
  refresh: string;
}
