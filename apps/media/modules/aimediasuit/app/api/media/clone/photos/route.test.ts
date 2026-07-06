import { beforeEach, describe, expect, it, vi } from "vitest";

const inspectImageMock = vi.fn();
const resolveUserIdMock = vi.fn();
const saveImageFileMock = vi.fn();
const avatarCloneCreateMock = vi.fn();

vi.mock("@/lib/clone/media-inspector", () => ({
  inspectImage: inspectImageMock,
}));

vi.mock("@/lib/auth/user-id", () => ({
  resolveUserId: resolveUserIdMock,
}));

vi.mock("@/lib/storage/image-storage", () => ({
  saveImageFile: saveImageFileMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    avatarClone: {
      create: avatarCloneCreateMock,
    },
  },
}));

const createPngFile = (name: string, bytes: number[]) => {
  const blob = new Blob([Uint8Array.from(bytes)], { type: "image/png" });
  return new File([blob], name, { type: "image/png" });
};

describe("POST /api/media/clone/photos", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 400 when inspectImage rejects corrupt image payload", async () => {
    process.env.DATABASE_URL = "postgresql://test";

    inspectImageMock.mockRejectedValueOnce(new Error("Image file is not decodable."));
    resolveUserIdMock.mockResolvedValue("user-1");

    const { POST } = await import("./route");

    const formData = new FormData();
    formData.set("cloneName", "Bad Payload Clone");
    formData.set("language", "english");

    for (let i = 0; i < 20; i += 1) {
      formData.append("files", createPngFile(`bad-${i}.png`, [1, 2, 3, 4]));
    }

    const request = new Request("http://localhost/api/media/clone/photos", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(String(body.error)).toContain("Invalid image");
    expect(String(body.error)).toContain("not decodable");
    expect(saveImageFileMock).not.toHaveBeenCalled();
    expect(avatarCloneCreateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when an image exceeds the maximum allowed dimensions", async () => {
    process.env.DATABASE_URL = "postgresql://test";

    inspectImageMock.mockResolvedValue({
      width: 9000,
      height: 720,
      pixelFormat: "rgb24",
    });
    resolveUserIdMock.mockResolvedValue("user-1");

    const { POST } = await import("./route");

    const formData = new FormData();
    formData.set("cloneName", "Huge Image Clone");
    formData.set("language", "english");

    for (let i = 0; i < 20; i += 1) {
      formData.append("files", createPngFile(`large-${i}.png`, [1, 2, 3, 4]));
    }

    const request = new Request("http://localhost/api/media/clone/photos", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(String(body.error)).toContain("exceeds 8192px maximum dimension");
    expect(saveImageFileMock).not.toHaveBeenCalled();
    expect(avatarCloneCreateMock).not.toHaveBeenCalled();
  });
});
