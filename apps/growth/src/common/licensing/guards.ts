import { redirect } from "next/navigation";
import type { FeatureKey } from "@prisma/client";
import { getSession } from "../auth/session";
import { hasFeature } from "./features";

/**
 * Server guard for licensed app routes. Redirects to the login page when there
 * is no session, or to the dashboard when the user's licenses do not include
 * the required feature.
 */
export async function requireFeature(key: FeatureKey) {
  const session = await getSession();
  if (!session) redirect("/app/login");

  const features = session.user?.features as string[] | undefined;
  if (!hasFeature(features, key)) redirect("/app/dashboard");

  return session;
}
