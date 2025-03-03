import fetch from 'node-fetch';
import {
  Exercise,
  ExerciseNameInfo,
  PaginatedResponse,
  Tokens,
} from '../types/wger.types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class WgerApiService {
  private baseURL: string;
  private accessToken: string | null;
  private refreshToken: string | null;
  private isAuthenticating: boolean;
  private refreshAttempts: number = 0;
  private maxRefreshAttempts: number = 4;

  constructor() {
    this.baseURL = 'https://wger.de/api/v2';
    this.accessToken = null;
    this.refreshToken = null;
    this.isAuthenticating = false;
  }

  async initializeAuthentication(): Promise<void> {
    // Prevent recursive calls
    if (this.isAuthenticating) return;

    this.isAuthenticating = true;

    try {
      const username = process.env.WGER_USERNAME;
      const password = process.env.WGER_PASSWORD;

      if (!username || !password) {
        throw new Error(
          'WGER_USERNAME and WGER_PASSWORD must be set in .env file'
        );
      }

      await this.authenticateWithCredentials(username, password);
    } finally {
      this.isAuthenticating = false;
    }
  }

  // Renamed to avoid confusion
  private async authenticateWithCredentials(
    username: string,
    password: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const tokens = (await response.json()) as Tokens;
      this.accessToken = tokens.access;
      this.refreshToken = tokens.refresh;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Get all exercises with pagination handling
  async getAllExercises(
    params: Record<string, string | number> = {}
  ): Promise<Exercise[]> {
    // Try to authenticate if not already authenticated
    if (!this.accessToken && !this.isAuthenticating) {
      await this.initializeAuthentication();
    }

    let allExercises: Exercise[] = [];
    let nextUrl: string | null = `${
      this.baseURL
    }/exercise/?${new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString()}`;

    try {
      // Loop through all pages
      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: {
            'Content-Type': 'application/json',
            ...(this.accessToken && {
              Authorization: `Bearer ${this.accessToken}`,
            }),
          },
        });

        // Handle token expiration
        if (response.status === 401 && !this.isAuthenticating) {
          await this.refreshTokenIfNeeded();

          // Retry the current URL (don't advance nextUrl)
          continue;
        }

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = (await response.json()) as PaginatedResponse<Exercise>;
        allExercises = [...allExercises, ...data.results];
        nextUrl = data.next;
      }

      return allExercises;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      throw error;
    }
  }

  async refreshTokenIfNeeded(): Promise<void> {
    // Prevent recursive calls
    if (this.isAuthenticating) return;

    // Check if we've exceeded retry attempts
    if (this.refreshAttempts >= this.maxRefreshAttempts) {
      console.error('Maximum token refresh attempts exceeded');
      // Reset the counter after some time to allow future attempts
      setTimeout(() => {
        this.refreshAttempts = 0;
      }, 30 * 60 * 1000); // Reset after 30 minutes, adjust as needed
      return;
    }

    if (!this.refreshToken) {
      // If no refresh token, try initial authentication
      await this.initializeAuthentication();
      return;
    }

    this.isAuthenticating = true;
    try {
      const response = await fetch(`${this.baseURL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: this.refreshToken,
        }),
      });

      if (!response.ok) {
        // Increment attempt counter
        this.refreshAttempts++;

        // If refresh fails, try full authentication
        const username = process.env.WGER_USERNAME;
        const password = process.env.WGER_PASSWORD;

        if (!username || !password) {
          throw new Error(
            'WGER_USERNAME and WGER_PASSWORD must be set in .env file'
          );
        }

        await this.authenticateWithCredentials(username, password);
        return;
      }

      // Success - reset attempt counter
      this.refreshAttempts = 0;

      const data = (await response.json()) as { access: string };
      this.accessToken = data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.accessToken = null;
      this.refreshToken = null;

      // Increment attempt counter on errors as well
      this.refreshAttempts++;
    } finally {
      this.isAuthenticating = false;
    }
  }

  // Get exercise name list (simplified for frontend use)
  async getExerciseNames(language: number = 2): Promise<ExerciseNameInfo[]> {
    try {
      const exercises = await this.getAllExercises({ language });

      // Map to simple name objects
      return exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category?.name || 'Uncategorized',
      }));
    } catch (error) {
      console.error('Error getting exercise names:', error);
      throw error;
    }
  }
}

export default new WgerApiService();
