"use client";

import { useCallback, useState } from "react";

import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTransactionSchemaType,
  transactionSchema,
} from "@/schema/transaction";
import { TransactionType } from "@/types/transactions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import CategoryPicker from "./category-picker";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helper";
import { Loader } from "lucide-react";

type Props = {
  trigger: React.ReactNode;
  type: TransactionType;
};

export default function CreateTransactionDialog({ trigger, type }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaksi berhasil dibuat 🎉", {
        id: "create-transaction",
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen((prev) => !prev);
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-transaction",
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      setOpen((prev) => !prev);
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const onSubmit = useCallback(
    (data: CreateTransactionSchemaType) => {
      toast.loading("Sedang membuat transaksi...", {
        id: "create-transaction",
      });

      mutate({
        ...data,
        date: DateToUTCDate(data.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Buat Transaksi
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {type === "income" ? "Pemasukan" : "Pengeluaran"}
            </span>
            baru
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Isikan deskripsi transaksi (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jumlah {type === "income" ? "pemasukan" : "pengeluaran"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      defaultValue={0}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Tentukan jumlah transaksi</FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-x-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>Pilih kategori transaksi</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Transaksi</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "dd MMMM yyyy")
                              : "Pilih tanggal"}
                            <CalendarIcon className="size-4 ml-auto shrink-0 opacity-70" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>Pilih tanggal transaksi</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"default"}
              onClick={() => {
                form.reset();
              }}
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending && (
              <Loader className="size-4 mr-2 shrink-0 animate-spin" />
            )}
            {isPending ? "Membuat" : "Buat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
