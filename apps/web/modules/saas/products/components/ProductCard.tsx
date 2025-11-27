"use client";

import { cn } from "@ui/lib";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { BookmarkIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScoreBadge } from "./ScoreBadge";

export interface ProductCardProps {
	id: string;
	name: string;
	imageUrl?: string;
	category: string;
	costPrice: number;
	suggestedRetailPrice: number;
	trendScore: number;
	competitionScore: number;
	marginScore: number;
	overallScore: number;
	sourceUrl?: string;
	isSaved?: boolean;
	onSave?: (id: string) => void;
	onUnsave?: (id: string) => void;
	className?: string;
}

export function ProductCard({
	id,
	name,
	imageUrl,
	category,
	costPrice,
	suggestedRetailPrice,
	trendScore,
	competitionScore,
	marginScore,
	overallScore,
	sourceUrl,
	isSaved = false,
	onSave,
	onUnsave,
	className,
}: ProductCardProps) {
	const margin = suggestedRetailPrice - costPrice;
	const marginPercent = suggestedRetailPrice > 0 
		? Math.round((margin / suggestedRetailPrice) * 100) 
		: 0;

	const handleSaveClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (isSaved && onUnsave) {
			onUnsave(id);
		} else if (!isSaved && onSave) {
			onSave(id);
		}
	};

	return (
		<Card className={cn("group overflow-hidden transition-all hover:shadow-lg", className)}>
			<Link href={`/app/products/${id}`}>
				<div className="relative aspect-square overflow-hidden bg-muted">
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={name}
							fill
							className="object-cover transition-transform group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full items-center justify-center text-muted-foreground">
							No image
						</div>
					)}
					<div className="absolute top-2 right-2">
						<Button
							variant="secondary"
							size="icon"
							className={cn(
								"size-8 rounded-full bg-background/80 backdrop-blur-sm",
								isSaved && "text-primary",
							)}
							onClick={handleSaveClick}
						>
							<BookmarkIcon
								className={cn("size-4", isSaved && "fill-current")}
							/>
						</Button>
					</div>
					<div className="absolute bottom-2 left-2">
						<span className="rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
							{category}
						</span>
					</div>
				</div>
				<CardContent className="p-4">
					<h3 className="mb-2 line-clamp-2 font-semibold text-sm leading-tight">
						{name}
					</h3>

					<div className="mb-3 flex items-center justify-between">
						<div className="flex flex-col">
							<span className="font-bold text-lg">
								${suggestedRetailPrice.toFixed(2)}
							</span>
							<span className="text-muted-foreground text-xs">
								Cost: ${costPrice.toFixed(2)}
							</span>
						</div>
						<div className="text-right">
							<span className="font-semibold text-emerald-500 text-sm">
								+${margin.toFixed(2)}
							</span>
							<span className="block text-muted-foreground text-xs">
								{marginPercent}% margin
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1">
							<ScoreBadge score={overallScore} size="sm" showLabel={false} />
							<div className="flex gap-1">
								<ScoreIndicator score={trendScore} label="T" />
								<ScoreIndicator score={competitionScore} label="C" />
								<ScoreIndicator score={marginScore} label="M" />
							</div>
						</div>
						{sourceUrl && (
							<Button
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={(e) => {
									e.preventDefault();
									window.open(sourceUrl, "_blank");
								}}
							>
								<ExternalLinkIcon className="size-4" />
							</Button>
						)}
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}

function ScoreIndicator({ score, label }: { score: number; label: string }) {
	const getColor = (s: number) => {
		if (s <= 40) {
			return "bg-red-500";
		}
		if (s <= 70) {
			return "bg-amber-500";
		}
		return "bg-emerald-500";
	};

	return (
		<div className="flex items-center gap-0.5">
			<div className={cn("size-2 rounded-full", getColor(score))} />
			<span className="text-muted-foreground text-xs">{label}</span>
		</div>
	);
}

export function ProductCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<div className="aspect-square animate-pulse bg-muted" />
			<CardContent className="p-4">
				<div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
				<div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
				<div className="flex items-center justify-between">
					<div className="h-6 w-20 animate-pulse rounded bg-muted" />
					<div className="h-6 w-16 animate-pulse rounded bg-muted" />
				</div>
			</CardContent>
		</Card>
	);
}
