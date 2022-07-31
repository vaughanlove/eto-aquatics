import bcrypt from "bcryptjs";

import { db } from "./db.server";
import {
    createCookieSessionStorage,
    redirect,
  } from "@remix-run/node";

type LoginForm = {
    username: string;
    password: string;
};



export async function login({
    username,
    password,
  }: LoginForm) {
    const user = await db.user.findUnique({
      where: { username },
    });
    if (!user) return null;
  
    const isCorrectPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (!isCorrectPassword) return null;
  
    return { id: user.id, isAdmin: user.isAdmin, username };
  }

  const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
  }
  
  export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    return userId;
  }
  
  export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
  ) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
      const searchParams = new URLSearchParams([
        ["redirectTo", redirectTo],
      ]);
      throw redirect(`/login?${searchParams}`);
    }
    return userId;
  }

  export async function requireUserAdmin(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
  ) {
    const session = await getUserSession(request);
    const isAdmin = session.get("isAdmin");
    if (!isAdmin || typeof isAdmin !== "boolean") {
      const searchParams = new URLSearchParams([
        ["redirectTo", redirectTo],
      ]);
      throw redirect(`/login?${searchParams}`);
    }
    return isAdmin;
  }

export async function createUserSession(
  userId: string,
  isAdmin: boolean,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  session.set("isAdmin", isAdmin);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}