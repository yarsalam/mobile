import { User } from "./userType";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (data: any) => Promise<any>;
  logout: () => Promise<any>;
  setToken: (t: string | null) => Promise<void>;
}
