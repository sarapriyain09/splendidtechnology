import NextAuth from "next-auth";
import { authOptions } from "@/common/auth/auth-options";

const handler = NextAuth(authOptions);

export { authOptions };
export { handler as GET, handler as POST };
