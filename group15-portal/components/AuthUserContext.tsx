"use client";

import type { User } from "firebase/auth";
import { createContext, useContext } from "react";

export const AuthUserContext = createContext<User | null>(null);

export function useAuthUser(): User | null {
  return useContext(AuthUserContext);
}
