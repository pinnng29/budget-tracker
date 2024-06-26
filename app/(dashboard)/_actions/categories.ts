"use server";

import { db } from "@/lib/db";
import {
  categorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = categorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Bad request");
  }

  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  const { name, icon, type } = parsedBody.data;

  return await db.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

