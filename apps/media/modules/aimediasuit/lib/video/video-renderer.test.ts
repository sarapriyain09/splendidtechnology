import { describe, expect, it } from "vitest";
import { escapeFfmpegFilterPath } from "./video-renderer";

describe("escapeFfmpegFilterPath", () => {
  it("escapes Windows subtitle paths for ffmpeg filter syntax", () => {
    const raw = "C:\\Users\\sarap\\AppData\\Local\\Temp\\aimedia-video-Ez4Ph8\\output.srt";
    const escaped = escapeFfmpegFilterPath(raw);

    expect(escaped).toBe("C\\:/Users/sarap/AppData/Local/Temp/aimedia-video-Ez4Ph8/output.srt");
    expect(escaped).not.toContain("\\\\");
  });

  it("escapes quotes and commas that break filter args", () => {
    const raw = "C:\\tmp\\bob's,subtitles\\out.srt";
    const escaped = escapeFfmpegFilterPath(raw);

    expect(escaped).toBe("C\\:/tmp/bob\\'s\\,subtitles/out.srt");
  });
});
