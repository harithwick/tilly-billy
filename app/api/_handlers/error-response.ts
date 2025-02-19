import { NextResponse } from "next/server";

export const errorResponse = (error: unknown) => {
  console.error("Error:", error);
  if (error instanceof Error && error.message) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(
    { error: "Internal ssdferver error" },
    { status: 500 }
  );
};
