import { NextResponse } from "next/server";
import { clearStoreSession } from "../../../../utils/storeAuth";

export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out" });
  await clearStoreSession(response);
  return response;
}
