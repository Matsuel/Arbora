import { useAuth } from "@/contexts/auth-context";
import type { User } from "@supabase/supabase-js";

export type AuthUserState = {
  user: User | null;
  isLoading: boolean;
};

export const useAuthUser = (): AuthUserState => {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
};
