import { NextRequest, NextResponse } from "next/server";
import { readVideoByPublicPath } from "@/lib/storage/video-storage";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ path: string[] }>;
};

function parseRange(rangeHeader: string, size: number) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
  if (!match) {
    return null;
  }

  const startRaw = match[1];
  const endRaw = match[2];

  if (!startRaw && !endRaw) {
    return null;
  }

  let start = startRaw ? Number.parseInt(startRaw, 10) : Number.NaN;
  let end = endRaw ? Number.parseInt(endRaw, 10) : Number.NaN;

  if (Number.isNaN(start) && !Number.isNaN(end)) {
    const tail = end;
    start = Math.max(size - tail, 0);
    end = size - 1;
  } else {
    if (Number.isNaN(start)) {
      return null;
    }

    if (Number.isNaN(end) || end >= size) {
      end = size - 1;
    }
  }

  if (start < 0 || start >= size || end < start) {
    return null;
  }

  return { start, end };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { path } = await params;
    const { file, size } = await readVideoByPublicPath(path);
    const lastSegment = path[path.length - 1]?.toLowerCase() ?? "";
    const contentType = lastSegment.endsWith(".webm") ? "video/webm" : "video/mp4";

    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      const parsed = parseRange(rangeHeader, size);
      if (!parsed) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${size}`,
            "Accept-Ranges": "bytes",
          },
        });
      }

      const chunk = file.subarray(parsed.start, parsed.end + 1);
      return new NextResponse(chunk, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": chunk.byteLength.toString(),
          "Content-Range": `bytes ${parsed.start}-${parsed.end}/${size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": size.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
