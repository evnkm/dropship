"use client";

import { cn } from "@ui/lib";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

export interface ScoreHistoryPoint {
	date: string;
	trendScore: number;
	competitionScore: number;
	marginScore: number;
	overallScore: number;
}

export interface TrendChartProps {
	data: ScoreHistoryPoint[];
	showLegend?: boolean;
	height?: number;
	className?: string;
}

const COLORS = {
	overall: "#8b5cf6",
	trend: "#3b82f6",
	competition: "#f59e0b",
	margin: "#10b981",
};

export function TrendChart({
	data,
	showLegend = true,
	height = 300,
	className,
}: TrendChartProps) {
	const formattedData = data.map((point) => ({
		...point,
		date: new Date(point.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
	}));

	return (
		<div className={cn("w-full", className)}>
			<ResponsiveContainer width="100%" height={height}>
				<LineChart
					data={formattedData}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
					<XAxis
						dataKey="date"
						className="text-xs"
						tick={{ fill: "currentColor" }}
					/>
					<YAxis
						domain={[0, 100]}
						className="text-xs"
						tick={{ fill: "currentColor" }}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--card))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "hsl(var(--foreground))" }}
					/>
					{showLegend && (
						<Legend
							wrapperStyle={{ paddingTop: "20px" }}
						/>
					)}
					<Line
						type="monotone"
						dataKey="overallScore"
						name="Overall"
						stroke={COLORS.overall}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
					/>
					<Line
						type="monotone"
						dataKey="trendScore"
						name="Trend"
						stroke={COLORS.trend}
						strokeWidth={1.5}
						dot={false}
						activeDot={{ r: 3 }}
					/>
					<Line
						type="monotone"
						dataKey="competitionScore"
						name="Competition"
						stroke={COLORS.competition}
						strokeWidth={1.5}
						dot={false}
						activeDot={{ r: 3 }}
					/>
					<Line
						type="monotone"
						dataKey="marginScore"
						name="Margin"
						stroke={COLORS.margin}
						strokeWidth={1.5}
						dot={false}
						activeDot={{ r: 3 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export function MiniTrendChart({
	data,
	dataKey = "overallScore",
	color = COLORS.overall,
	height = 60,
	className,
}: {
	data: ScoreHistoryPoint[];
	dataKey?: keyof Omit<ScoreHistoryPoint, "date">;
	color?: string;
	height?: number;
	className?: string;
}) {
	return (
		<div className={cn("w-full", className)}>
			<ResponsiveContainer width="100%" height={height}>
				<LineChart data={data}>
					<Line
						type="monotone"
						dataKey={dataKey}
						stroke={color}
						strokeWidth={2}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
