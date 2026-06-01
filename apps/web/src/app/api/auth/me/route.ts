import { NextResponse } from "next/server";
import { getCurrentStoreUser } from "../../../../utils/storeAuth";

export async function GET() {
  const user = await getCurrentStoreUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
