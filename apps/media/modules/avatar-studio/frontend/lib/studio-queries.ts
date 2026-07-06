import { useQuery } from "@tanstack/react-query";
import { fetchAvatars, fetchProjects } from "@/lib/studio-api";

export function useAvatarsQuery() {
  return useQuery({
    queryKey: ["studio", "avatars"],
    queryFn: fetchAvatars,
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: ["studio", "projects"],
    queryFn: fetchProjects,
  });
}