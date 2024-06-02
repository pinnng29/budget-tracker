import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const queryParams = OverviewQuerySchema.safeParse({ from, to });

    if (!queryParams.success) {
      return NextResponse.json(queryParams.error.message, {
        status: 400,
      })
    }

  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
