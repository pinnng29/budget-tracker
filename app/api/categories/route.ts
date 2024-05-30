import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paramType = searchParams.get("type");

    const validator = z.enum(["income", "expense"]);
    const queryParams = validator.safeParse(paramType);

    if (!queryParams.success) {
      return NextResponse.json(queryParams.error, { status: 400 });
    }

    const type = queryParams.data;

    const categories = await db.category.findMany({
      where: {
        userId: userId,
        ...(type && { type }),
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
