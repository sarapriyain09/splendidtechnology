import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserCredentials } from "@/lib/auth/user-store";

const developmentSecret = "velynxia-dev-nextauth-secret";
const configuredNextAuthSecret = process.env.NEXTAUTH_SECRET?.trim();
const resolvedNextAuthSecret =
  (configuredNextAuthSecret && configuredNextAuthSecret.length > 0
    ? configuredNextAuthSecret
    : undefined) ?? (process.env.NODE_ENV === "development" ? developmentSecret : undefined);

if (resolvedNextAuthSecret && !configuredNextAuthSecret) {
  // NextAuth emits NO_SECRET when the env var is missing, even if options.secret is provided.
  process.env.NEXTAUTH_SECRET = resolvedNextAuthSecret;
}

function parseJwtSubject(jwt: string): string | null {
  const sections = jwt.split(".");
  if (sections.length < 2) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(sections[1], "base64url").toString("utf8")) as {
      sub?: string;
      userId?: string;
    };

    return payload.sub ?? payload.userId ?? null;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: resolvedNextAuthSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "VelynxiaJWT",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "JWT Token", type: "text" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (email && password) {
          const user = await verifyUserCredentials(email, password);
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }

          return null;
        }

        const token = credentials?.token;
        if (!token) {
          return null;
        }

        const id = parseJwtSubject(token);
        if (!id) {
          return null;
        }

        return {
          id,
          name: "Velynxia User",
          email: "user@velynxia.local",
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
