import { AvatarStudioClient } from "@/components/avatar-studio/avatar-studio-client";
import { notFound } from "next/navigation";

export default function AvatarStudioPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AvatarStudioClient />;
}
