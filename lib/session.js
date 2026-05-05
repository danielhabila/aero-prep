import { cookies } from "next/headers";

export const SESSION_COOKIE = "ap_email";

export function getCurrentUserEmail() {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}
