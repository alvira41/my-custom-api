import { NextResponse } from "next/server";

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:3000";

export const corsHeaders = {
  "Access-Control-Allow-Origin": frontendUrl,
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization",
};

export function withCors(response: NextResponse) {
  Object.entries(corsHeaders).forEach(
    ([key, value]) => {
      response.headers.set(key, value);
    }
  );

  return response;
}