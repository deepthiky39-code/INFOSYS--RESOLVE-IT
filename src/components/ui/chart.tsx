"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "../../lib/utils";

/* ----------------------------------
   Types & Context
-----------------------------------*/

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<any>;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within ChartContainer");
  }
  return context;
}

/* ----------------------------------
   Container
-----------------------------------*/

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const reactId = React.useId();
  const chartId = id ?? reactId.replace(/:/g, "");

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-layer]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* ----------------------------------
   Dynamic CSS
-----------------------------------*/

function ChartStyle({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) {
  const entries = Object.entries(config).filter(
    ([, v]) => v.color
  );

  if (!entries.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([, selector]) => `
${selector} [data-chart="${id}"] {
${entries
  .map(([key, cfg]) => `--color-${key}: ${cfg.color};`)
  .join("\n")}
}`
          )
          .join("\n"),
      }}
    />
  );
}

/* ----------------------------------
   Tooltip
-----------------------------------*/

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent(props: any) {
  const {
    active,
    payload,
    className,
  } = props;

  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-md",
        className
      )}
    >
      {payload.map((item: any, index: number) => {
        const key = item.dataKey || item.name;
        const cfg = config[key];

        return (
          <div key={index} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">
              {cfg?.label ?? key}
            </span>
            <span className="ml-auto font-mono">
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------
   Legend
-----------------------------------*/

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent(props: any) {
  const { payload, className } = props;
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {payload.map((item: any, index: number) => {
        const cfg = config[item.dataKey];
        return (
          <div key={index} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span>{cfg?.label ?? item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------
   Exports
-----------------------------------*/

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
