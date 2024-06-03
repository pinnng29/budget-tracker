"use client"

import SkeletonWrapper from "@/components/skeleton-wrapper";
import StatCard from "@/components/stat-card";
import { DateToUTCDate, GetFormattedForCurrency } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";

type Props = {
  from: Date;
  to: Date;
};

export default function StatsCard({ from, to }: Props) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  const formatter = useMemo(() => {
    return GetFormattedForCurrency("IDR");
  }, [GetFormattedForCurrency]);

  return (
    <div className="relative flex flex-wrap w-full gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Pemasukan"
          icon={
            <TrendingUp className="size-12 items-center rounded-lg p-2 text-green-500 bg-green-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Pengeluaran"
          icon={
            <TrendingDown className="size-12 items-center rounded-lg p-2 text-red-500 bg-rose-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Saldo Akhir"
          icon={
            <Wallet className="size-12 items-center rounded-lg p-2 text-blue-500 bg-blue-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

