"use client";

import { cn } from "@ui/lib";

export interface ScoreBadgeProps {
	score: number;
	label?: string;
	size?: "sm" | "md" | "lg";
	showLabel?: boolean;
	className?: string;
}

/**
 * ScoreBadge Component
 * 
 * Circular badge with color gradient based on score:
 * - Red: 0-40
 * - Yellow: 41-70
 * - Green: 71-100
 */
export function ScoreBadge({
	score,
	label,
	size = "md",
	showLabel = true,
	className,
}: ScoreBadgeProps) {
	const normalizedScore = Math.min(100, Math.max(0, score));

	const getScoreColor = (score: number) => {
		if (score <= 40) {
			return {
				bg: "bg-red-500/10",
				text: "text-red-500",
				ring: "ring-red-500/30",
				gradient: "from-red-500 to-red-600",
			};
		}
		if (score <= 70) {
			return {
				bg: "bg-amber-500/10",
				text: "text-amber-500",
				ring: "ring-amber-500/30",
				gradient: "from-amber-500 to-amber-600",
			};
		}
		return {
			bg: "bg-emerald-500/10",
			text: "text-emerald-500",
			ring: "ring-emerald-500/30",
			gradient: "from-emerald-500 to-emerald-600",
		};
	};

	const colors = getScoreColor(normalizedScore);

	const sizeClasses = {
		sm: "size-10 text-xs",
		md: "size-14 text-sm",
		lg: "size-20 text-lg",
	};

	const labelSizeClasses = {
		sm: "text-xs",
		md: "text-xs",
		lg: "text-sm",
	};

	return (
		<div className={cn("flex flex-col items-center gap-1", className)}>
			<div
				className={cn(
					"relative flex items-center justify-center rounded-full ring-2",
					colors.bg,
					colors.ring,
					sizeClasses[size],
				)}
			>
				<div
					className={cn(
						"absolute inset-0 rounded-full opacity-20 bg-gradient-to-br",
						colors.gradient,
					)}
					style={{
						clipPath: `polygon(0 0, 100% 0, 100% ${100 - normalizedScore}%, 0 ${100 - normalizedScore}%)`,
					}}
				/>
				<span className={cn("font-bold", colors.text)}>{normalizedScore}</span>
			</div>
			{showLabel && label && (
				<span
					className={cn(
						"text-muted-foreground font-medium",
						labelSizeClasses[size],
					)}
				>
					{label}
				</span>
			)}
		</div>
	);
}

export function ScoreRow({
	trendScore,
	competitionScore,
	marginScore,
	overallScore,
	size = "sm",
	showLabels = true,
}: {
	trendScore: number;
	competitionScore: number;
	marginScore: number;
	overallScore: number;
	size?: "sm" | "md" | "lg";
	showLabels?: boolean;
}) {
	return (
		<div className="flex items-center gap-3">
			<ScoreBadge
				score={overallScore}
				label="Overall"
				size={size}
				showLabel={showLabels}
			/>
			<div className="h-8 w-px bg-border" />
			<ScoreBadge
				score={trendScore}
				label="Trend"
				size={size === "lg" ? "md" : "sm"}
				showLabel={showLabels}
			/>
			<ScoreBadge
				score={competitionScore}
				label="Competition"
				size={size === "lg" ? "md" : "sm"}
				showLabel={showLabels}
			/>
			<ScoreBadge
				score={marginScore}
				label="Margin"
				size={size === "lg" ? "md" : "sm"}
				showLabel={showLabels}
			/>
		</div>
	);
}
