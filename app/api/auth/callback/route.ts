import { errorResponse } from "@/app/api/_handlers/error-response";

export async function GET(request: NextRequest) {
  try {
    // ... existing code ...
    if (sessionError) {
      return errorResponse(sessionError);
    }

    if (insertError) {
      return errorResponse(insertError);
    }

    // ... rest of code ...
  } catch (error) {
    return errorResponse(error);
  }
}
