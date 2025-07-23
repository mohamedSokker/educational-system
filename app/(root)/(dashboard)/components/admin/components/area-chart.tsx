"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChartData } from "@/types/admin-dashboard";

const chartConfig = {
  performance: {
    label: "Performance",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  barChartData,
}: //   interval,
{
  barChartData: BarChartData[];
  //   interval: string | undefined;
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  //   const filteredData = barChartData.filter((item) => {
  //     const date = new Date(item.date);
  //     const referenceDate = new Date(barChartData[barChartData.length - 1].date);
  //     let daysToSubtract = 90;
  //     if (timeRange === "30d") {
  //       daysToSubtract = 30;
  //     } else if (timeRange === "7d") {
  //       daysToSubtract = 7;
  //     }
  //     const startDate = new Date(referenceDate);
  //     startDate.setDate(startDate.getDate() - daysToSubtract);
  //     return date >= startDate;
  //   });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Students performance</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {`Track students performance over time`}
          </span>
          {/* <span className="@[540px]/card:hidden">{interval}</span> */}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={barChartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="student"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="performance"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--chart-2)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
