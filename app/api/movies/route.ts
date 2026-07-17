import { getMovieDetails } from "@/lib/tmdb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const idsParam = searchParams.get("ids") || "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return Response.json({ results: [] });
  }

  try {
    const results = await Promise.all(
      ids.map((id) =>
        getMovieDetails(id).catch(() => null) 
      )
    );
    return Response.json({ results: results.filter(Boolean) });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
