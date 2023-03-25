import { createCookieSessionStorage } from "@remix-run/node";
import { cookies } from "next/headers"
import { NextRequest } from "next/server";
import { redirect } from "next/navigation"
import invariant from "tiny-invariant";

import type { User } from "@/models/userserver";
import { getUserById } from "@/models/userserver";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: NextRequest) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: NextRequest): Promise<string | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request: NextRequest): Promise<null | User> {
  const userId = await getUserId(request);
  if (userId === undefined) return null;
  return getUserById(userId);
}

export async function requireUserId(
  request: NextRequest,
  redirectTo: string = new URL(request.url).pathname,
): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(
      redirectTo && redirectTo !== "/" ? `/login?${searchParams}` : `/login`,
    );
  }
  return userId;
}

export async function requireUser(request: NextRequest) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: NextRequest;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  request.headers.set("Cookie", await sessionStorage.commitSession(session, {
        maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
    }))
  return redirect(redirectTo);
}

export async function logout(
  request: NextRequest,
  redirectTo: string = request.url,
) {
  const session = await getSession(request);
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
  request.headers.set("Cookie", await sessionStorage.destroySession(session))
  return redirect(
    redirectTo && redirectTo !== "/" ? `/login?${searchParams}` : `/login`
  );
}