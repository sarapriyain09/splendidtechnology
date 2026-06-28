import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { prisma } from "@/common/services";

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { response } = await requireSession();
  if (response) return response;

  const { uuid } = await params;

  try {
    const data = await prisma.company.findUnique({
      where: { uuid },
      include: {
        contacts: {
          select: {
            id: true,
            uuid: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch company.";
    if (message.toLowerCase().includes("invalid input syntax for type uuid")) {
      return NextResponse.json({ error: "Invalid uuid format." }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
