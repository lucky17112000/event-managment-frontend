import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return Response.json({ isAuthenticated: false }, { status: 200 });
    }

    return Response.json({ isAuthenticated: true }, { status: 200 });
  } catch (error) {
    return Response.json({ isAuthenticated: false }, { status: 200 });
  }
}
