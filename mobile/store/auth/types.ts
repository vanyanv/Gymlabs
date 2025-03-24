export type User = {
  id: string;
  name?: string;
  email: string;
  password?: string;
};
export interface AuthState {
  user: User | null;
  loading: boolean;
  token: string | null;
  isAuthenticated: boolean;

  //actions
  bootstrap: () => Promise<void>;
  login: () => (email: string, password: string) => Promise<User>;
  signup: () => (
    email: string,
    password: string,
    name: string
  ) => Promise<User>;
  logout: () => Promise<void>;
}
