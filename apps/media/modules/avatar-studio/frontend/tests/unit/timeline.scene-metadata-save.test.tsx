import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Timeline } from "@/components/video/timeline";
import { useWorkspaceStore } from "@/stores/workspace-store";

vi.mock("@/lib/studio-api", () => ({
  fetchProjects: vi.fn().mockResolvedValue([]),
  fetchProjectScenes: vi.fn(),
  updateProjectScene: vi.fn(),
  createProjectScene: vi.fn(),
  renderProjectFromScenes: vi.fn(),
  fetchRenderJobStatus: vi.fn(),
}));

import { fetchProjectScenes, updateProjectScene } from "@/lib/studio-api";

function renderTimeline(): void {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Timeline />
    </QueryClientProvider>
  );
}

describe("Timeline SceneCard metadata save", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useWorkspaceStore.setState({
      workspace: "projects",
      selectedProjectId: "proj_1",
      selectedAvatarId: undefined,
      rightPanel: "project",
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      theme: "light",
    });

    vi.mocked(fetchProjectScenes).mockResolvedValue([
      {
        id: "scene_1",
        orderIndex: 1,
        title: "Opening",
        narration: "Original narration",
        durationSeconds: 8,
        background: "office",
        imageUrl: "",
        voiceAudioUrl: "",
        music: "ambient",
        camera: "static",
        transition: "cut",
        captionStyle: "minimal",
        voice: "default",
        assets: ["logo.png"],
      },
    ]);

    vi.mocked(updateProjectScene).mockResolvedValue({
      id: "scene_1",
      orderIndex: 1,
      title: "Updated Opening",
      narration: "Updated narration",
      durationSeconds: 12,
      background: "studio",
      imageUrl: "https://example.com/scene.png",
      voiceAudioUrl: "https://example.com/voice.mp3",
      music: "cinematic",
      camera: "close-up",
      transition: "fade",
      captionStyle: "bold",
      voice: "professional",
      assets: ["brand-logo.png", "product-grid.png"],
    });
  });

  it("sends full metadata patch when scene card is saved", async () => {
    renderTimeline();

    await screen.findByText("Scene 1");

    const card = screen.getByText("Scene 1").closest("article");
    expect(card).not.toBeNull();
    if (!card) {
      return;
    }

    const titleInput = within(card).getByPlaceholderText("Scene title");
    const narrationInput = within(card).getByPlaceholderText("Scene narration");
    const backgroundInput = within(card).getByPlaceholderText("Background");
    const durationInput = within(card).getByPlaceholderText("Duration (seconds)");
    const imageInput = within(card).getByPlaceholderText("Scene image URL");
    const voiceInput = within(card).getByPlaceholderText("Scene voice URL");
    const assetsInput = within(card).getByPlaceholderText("Assets (comma separated, e.g. brand-logo.png, product-grid.png)");
    const selects = within(card).getAllByRole("combobox");

    fireEvent.change(titleInput, { target: { value: "Updated Opening" } });
    fireEvent.change(narrationInput, { target: { value: "Updated narration" } });
    fireEvent.change(backgroundInput, { target: { value: "studio" } });
    fireEvent.change(durationInput, { target: { value: "12" } });
    fireEvent.change(imageInput, { target: { value: "https://example.com/scene.png" } });
    fireEvent.change(voiceInput, { target: { value: "https://example.com/voice.mp3" } });
    fireEvent.change(selects[0], { target: { value: "cinematic" } });
    fireEvent.change(selects[1], { target: { value: "close-up" } });
    fireEvent.change(selects[2], { target: { value: "fade" } });
    fireEvent.change(selects[3], { target: { value: "bold" } });
    fireEvent.change(selects[4], { target: { value: "professional" } });
    fireEvent.change(assetsInput, { target: { value: "brand-logo.png, product-grid.png" } });

    fireEvent.click(within(card).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateProjectScene).toHaveBeenCalledTimes(1);
    });

    expect(updateProjectScene).toHaveBeenCalledWith("proj_1", "scene_1", {
      title: "Updated Opening",
      narration: "Updated narration",
      durationSeconds: 12,
      background: "studio",
      imageUrl: "https://example.com/scene.png",
      voiceAudioUrl: "https://example.com/voice.mp3",
      music: "cinematic",
      orderIndex: 1,
      camera: "close-up",
      transition: "fade",
      captionStyle: "bold",
      voice: "professional",
      assets: ["brand-logo.png", "product-grid.png"],
    });
  });
});
