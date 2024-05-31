"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/types/transactions";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import CreateCategoryDialog from "./create-category-dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  type: TransactionType;
  onChange: (value: string) => void;
};

export default function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [onChange, value]);

  const categoryQuery = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categoryQuery.data?.find(
    (category) => category.name === value
  );

  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen(false);
    },
    [setValue, setOpen]
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Pilih kategori"
          )}
          <ChevronsUpDown className="size-4 ml-2 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder={"Cari kategori"} />
          <CommandEmpty>
            <p className="font-bold ">Kategori tidak ditemukan</p>
            <p className="text-xs text-muted-foreground">
              Silahkan untuk membuat kategori baru
            </p>
          </CommandEmpty>
          <CreateCategoryDialog
            type={type}
            successCallback={successCallback}
          />
          <CommandGroup>
            <CommandList>
              {categoryQuery.data &&
                categoryQuery.data.map((category) => (
                  <CommandItem
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                    <CategoryRow category={category} />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-x-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
