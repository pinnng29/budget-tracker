"use server";

import { db } from "@/lib/db";
import {
  CreateTransactionSchemaType,
  transactionSchema,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = transactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { amount, description, date, category, type } = parsedBody.data;

  const categoryRow = await db.category.findFirst({
    where: {
      userId: user.id,
      name: category,
      type,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  await db.$transaction([
    // Create user transaction
    db.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    //update month aggregate table
    db.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    //update year aggregate table
    db.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
