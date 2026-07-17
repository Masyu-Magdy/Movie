import { getTrending } from "@/lib/tmdb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const window = searchParams.get("window") as "day" | "week" || "week";
    const data = await getTrending(window);
    return Response.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}