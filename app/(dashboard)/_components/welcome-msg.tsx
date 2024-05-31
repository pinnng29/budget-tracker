"use client";

import { useUser } from "@clerk/nextjs";
import { Minus, Plus } from "lucide-react";

import CreateTransactionDialog from "./create-transaction-dialog";

import { Button } from "@/components/ui/button";

export default function WelcomeMsg() {
  const { user, isLoaded } = useUser();

  return (
    <div className="max-w-screen-2xl mx-auto w-full">
      <div className="border-b">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <h2 className="text-2xl lg:text-3xl text-primary font-medium">
            Welcome Back{isLoaded ? ", " : " "}
            {user?.firstName}! 🚀 <br />
            <span className="text-sm lg:text-base">
              This is your Financial Overview Report
            </span>
          </h2>
          <div className="flex items-center gap-x-3">
            <CreateTransactionDialog
              type="income"
              trigger={
                <Button
                  variant={"outline"}
                  className="bg-emerald-500 text-white hover:bg-emerald-700 hover:text-white rounded-lg"
                >
                  <Plus className="size-4 mr-2 shrink-0" />
                  Pemasukan 🤑
                </Button>
              }
            />
            <CreateTransactionDialog
              type="expense"
              trigger={
                <Button
                  variant={"outline"}
                  className="bg-rose-500 text-white hover:bg-rose-700 hover:text-white rounded-lg"
                >
                  <Minus className="size-4 mr-2 shrink-0" />
                  Pengeluaran 😤
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
