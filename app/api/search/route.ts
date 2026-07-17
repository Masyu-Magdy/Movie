import { searchMovies } from "@/lib/tmdb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";
  const limit = parseInt(searchParams.get("limit") || "6");

  if (!query.trim()) {
    return Response.json({ results: [] });
  }

  try {
    const data = await searchMovies(query, 1);
    return Response.json({ 
      results: data.results?.slice(0, limit) || [],
      total: data.total_results || 0
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}