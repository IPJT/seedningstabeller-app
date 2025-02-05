"use client";

import { START_GROUPS } from "@/lib/constants";
import { StartLists } from "@/scripts/generateStartlistStats";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const StartListChart = ({ startLists }: { startLists: StartLists }) => {
  const [startList, setStartList] = useState<StartLists[number]>();
  const years = Object.keys(startLists);
  const [year, setYear] = useState<number>(Number(years[0]));

  let data = startList ? formatStartList(startList) : [];

  const chartConfig = {
    Män: {
      label: "Men",
      color: "hsl(200 87% 36%)",
    },
    Kvinnor: {
      label: "Women",
      color: "hsl(350 100% 88%)",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      <ChartContainer className="aspect-[4/3]" config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            domain={[0, 5000]}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: "currentColor" }}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="Kvinnor"
            stackId="a"
            fill="var(--color-Kvinnor)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Män"
            stackId="a"
            fill="var(--color-Män)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>

      <div className="flex flex-col items-center gap-2">
        <input
          type="range"
          min={years[0]}
          max={years[years.length - 1]}
          value={year}
          onChange={(e) => {
            const value = e.target.value;
            if (startLists[Number(value)]) {
              setYear(Number(value));
              setStartList(startLists[Number(value)]);
            } else {
              setYear(Number(value) + 1);
              setStartList(startLists[Number(value) + 1]);
            }
          }}
          className="w-full max-w-md"
        />
        <span className="text-xl font-semibold">{year}</span>
      </div>
    </div>
  );
};

const formatStartList = (startList: StartLists[number]) => {
  if (startList.perStartGroup) {
    const data = Object.entries(startList.perStartGroup)
      .map(([startGroup, startListForStartGroup]) => {
        return {
          name: START_GROUPS[startGroup as keyof typeof START_GROUPS],
          Män: startListForStartGroup.men,
          Kvinnor: startListForStartGroup.women,
        };
      })
      .filter((startGroup) => startGroup.name !== "%");

    return data;
  }

  const data = [
    {
      name: "Total",
      Män: startList.total.men,
      Kvinnor: startList.total.women,
    },
  ];

  return data;
};
