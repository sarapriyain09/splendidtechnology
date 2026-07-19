#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function read(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  return fs.readFileSync(fullPath, "utf8");
}

function assertIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing check: ${label}`);
  }
  console.log(`PASS ${label}`);
}

function main() {
  const timelinePath = "components/video/timeline.tsx";
  const studioApiPath = "lib/studio-api.ts";
  const typesPath = "types/studio.ts";

  const timeline = read(timelinePath);
  const studioApi = read(studioApiPath);
  const types = read(typesPath);

  assertIncludes(timeline, "Retry Last Render", "Timeline exposes Retry Last Render action");
  assertIncludes(
    timeline,
    "Replayed result: duplicate render request was safely deduplicated.",
    "Timeline displays replay visibility message",
  );
  assertIncludes(
    timeline,
    "setRenderWasReplayed(Boolean(result.replayed));",
    "Timeline sets replay state from API result",
  );
  assertIncludes(
    timeline,
    "renderProjectFromScenes(selectedProjectId, selectedAvatarId, idempotencyKey)",
    "Timeline sends idempotency key in render call",
  );

  assertIncludes(studioApi, "idempotency_key: idempotencyKey", "API client forwards idempotency_key");
  assertIncludes(types, "replayed?: boolean;", "Frontend type exposes replayed flag");
  assertIncludes(types, "idempotencyKey?: string;", "Frontend type exposes idempotency key");

  console.log("REPLAY_UI_SMOKE_PASS");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`REPLAY_UI_SMOKE_FAIL: ${message}`);
  process.exit(1);
}
