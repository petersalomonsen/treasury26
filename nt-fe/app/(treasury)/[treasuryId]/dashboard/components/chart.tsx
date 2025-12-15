"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from '@/components/ui/chart';

interface ChartDataPoint {
    name: string;
    value: number;
}

interface BalanceChartProps {
    data?: ChartDataPoint[];
}

const chartConfig = {
    value: {
        label: "Balance",
        color: "var(--color-chart-1)",
    },
} satisfies ChartConfig;

export default function BalanceChart({ data = [] }: BalanceChartProps) {
    const averageValue = data.reduce((acc, item) => acc + item.value, 0) / data.length;

    return (
        <ChartContainer config={chartConfig} className='h-56'>
            <AreaChart
                data={data}
            >
                <defs>
                    <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopOpacity={0.3}
                            stopColor="var(--color-foreground)"
                        />
                        <stop
                            offset="95%"
                            stopOpacity={0.05}
                            stopColor="var(--color-foreground)"
                        />
                    </linearGradient>
                </defs>

                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                    hide
                    domain={[`dataMin - ${averageValue * 0.5}`, `dataMax + ${averageValue * 0.5}`]}
                />
                <ChartTooltip
                    content={<ChartTooltipContent />}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-foreground)"
                    strokeWidth={2}
                    fill="url(#fillValue)"
                />
            </AreaChart>
        </ChartContainer>
    );
}
