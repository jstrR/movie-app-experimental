import { createEvent, createStore } from "effector";
import { type TUser } from "./types";

export const signup = createEvent<TUser>();
export const logout = createEvent<void>();

export const $currentUser = createStore<TUser | null>(null)
  .on(signup, (_, user) => user || null)
  .reset(logout);