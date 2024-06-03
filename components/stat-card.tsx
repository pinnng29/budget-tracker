"use client";

import CountUp from "react-countup";

import { Card } from "@/components/ui/card";
import { useCallback } from "react";

type Props = {
  title: string;
  formatter: Intl.NumberFormat
  value: number;
  icon: React.ReactNode
}

export default function StatCard({
  title,
  formatter,
  value,
  icon
}: Props) {
  const formatFn = useCallback(
    (value: number) => formatter.format(value),
    [formatter]
  );
  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          end={value}
          decimals={2}
          formattingFn={formatFn}
          redraw={false}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
