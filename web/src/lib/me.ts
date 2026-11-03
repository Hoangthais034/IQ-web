import "server-only";

import { cache } from "react";

import { auth } from "@/auth";
import { apiJson } from "@/lib/api";

export type Me = {
  email: string;
  name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  popunder_seen_at: string | null;
  subscription_ends_at: string | null;
  payments_enabled: boolean;
};

/** Current user from the API (null when logged out). Cached per request. */
export const getMe = cache(async (): Promise<Me | null> => {
  const session = await auth();
  if (!session?.user?.email) return null;
  const { data } = await apiJson<Me>("/me");
  return data;
});
