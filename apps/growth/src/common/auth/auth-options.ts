import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser, bootstrapPlatform, type AuthUser } from "./users";

const nextAuthSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "splendid-growth-dev-secret-change-me"
    : undefined);

const sharedCookieDomain =
  process.env.NODE_ENV === "production" ? process.env.AUTH_COOKIE_DOMAIN : undefined;

const sharedCookieConfig = sharedCookieDomain
  ? {
      cookies: {
        sessionToken: {
          name: "__Secure-next-auth.session-token",
          options: {
            httpOnly: true,
            sameSite: "lax" as const,
            path: "/",
            secure: true,
            domain: sharedCookieDomain,
          },
        },
      },
    }
  : {};

// Single platform-wide NextAuth configuration. Every app authenticates against
// the shared `users` table through this one credentials provider.
export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  session: { strategy: "jwt" },
  ...sharedCookieConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await bootstrapPlatform();
        return verifyUser(credentials.email, credentials.password);
      },
    }),
  ],
  pages: { signIn: "/app/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as AuthUser).id;
        token.role = (user as AuthUser).role;
        token.features = (user as AuthUser).features;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.features = token.features;
      }
      return session;
    },
  },
};
