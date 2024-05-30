"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { categorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { TransactionType } from "@/types/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { CircleOff, Loader, PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "../_actions/categories";
import { toast } from "sonner";
import { useTheme } from "next-themes";

type Props = {
  type: TransactionType;
  successCallback: (category: Category) => void;
};

export default function CreateCategoryDialog({ type, successCallback }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Kategori ${data.name} berhasil dibuat 🎉`, {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen(false);
    },
    onError: () => {
      toast.error("Gagal membuat kategori", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (data: CreateCategorySchemaType) => {
      toast.loading("Sedang membuat kategori...", {
        id: "create-category",
      });
      mutate(data);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="rounded-none text-muted-foreground"
        >
          <PlusCircle className="size-4 mr-2 shrink-0" />
          Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Buat Kategori
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {type === "income" ? "Pemasukan" : "Pengeluaran"}
            </span>
            Baru
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama kategori"
                        defaultValue={""}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Isikan nama kategori</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="h-[100px] w-full"
                          >
                            {form.watch("icon") ? (
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-5xl">{field.value}</span>
                                <p className="text-xs text-foreground">
                                  Klik untuk mengganti icon
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <CircleOff className="shrink-0 size-12 mx-auto" />
                                <p className="text-xs text-foreground">
                                  Klik untuk memilih icon untuk Kategori
                                </p>
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Picker
                            data={data}
                            theme={theme.resolvedTheme}
                            onEmojiSelect={(emoji: { native: string }) => {
                              field.onChange(emoji.native);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>Pilih icon untuk kategori</FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <DialogClose className="flex items-center gap-x-2">
              <Button
                type="button"
                variant={"outline"}
                size={"default"}
                onClick={() => form.reset()}
              >
                Batal
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                size={"default"}
              >
                {isPending && (
                  <Loader className="size-4 mr-2 shrink-0 animate-spin" />
                )}
                {isPending ? "Membuat" : "Buat"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
