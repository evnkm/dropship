"use client";

import { apiClient } from "@shared/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowUpIcon,
	TrendingUpIcon,
	SparklesIcon,
	TagIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ScoreBadge } from "@saas/products/components";

export default function TrendsPage() {
	const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
	const [category, setCategory] = useState<string>("");

	const { data: trendsData, isLoading } = useQuery({
		queryKey: ["trends", timeRange, category],
		queryFn: () =>
			apiClient.analytics.trends({
				timeRange,
				category: category || undefined,
			}),
	});

	const { data: categoriesData } = useQuery({
		queryKey: ["categories"],
		queryFn: () => apiClient.products.categories({}),
	});

	const categories = categoriesData?.categories || [];
	const trendingCategories = trendsData?.trendingCategories || [];
	const topMovers = trendsData?.topMovers || [];
	const newEntries = trendsData?.newEntries || [];

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="flex items-center gap-3 font-bold text-3xl">
					<TrendingUpIcon className="size-8" />
					Trends & Analytics
				</h1>
				<p className="text-muted-foreground">
					Discover trending categories and top performing products
				</p>
			</div>

			<div className="mb-6 flex flex-wrap gap-4">
				<Select value={timeRange} onValueChange={(v) => setTimeRange(v as "7d" | "30d" | "90d")}>
					<SelectTrigger className="w-[150px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="7d">Last 7 days</SelectItem>
						<SelectItem value="30d">Last 30 days</SelectItem>
						<SelectItem value="90d">Last 90 days</SelectItem>
					</SelectContent>
				</Select>

				<Select value={category} onValueChange={setCategory}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Categories</SelectItem>
						{categories.map((cat: { category: string; count: number }) => (
							<SelectItem key={cat.category} value={cat.category}>
								{cat.category}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TagIcon className="size-5" />
							Trending Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<div
										key={i}
										className="h-12 animate-pulse rounded bg-muted"
									/>
								))}
							</div>
						) : trendingCategories.length === 0 ? (
							<p className="py-4 text-center text-muted-foreground">
								No trending categories found.
							</p>
						) : (
							<div className="space-y-3">
								{trendingCategories.map((cat: {
									category: string;
									count: number;
									avgScore: number;
								}, index: number) => (
									<Link
										key={cat.category}
										href={`/app/products?category=${encodeURIComponent(cat.category)}`}
										className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
									>
										<div className="flex items-center gap-3">
											<span className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
												{index + 1}
											</span>
											<div>
												<p className="font-medium">{cat.category}</p>
												<p className="text-muted-foreground text-xs">
													{cat.count} products
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-semibold">
												{Math.round(cat.avgScore)}
											</p>
											<p className="text-muted-foreground text-xs">avg score</p>
										</div>
									</Link>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ArrowUpIcon className="size-5 text-emerald-500" />
							Top Movers
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<div
										key={i}
										className="h-16 animate-pulse rounded bg-muted"
									/>
								))}
							</div>
						) : topMovers.length === 0 ? (
							<p className="py-4 text-center text-muted-foreground">
								No top movers found.
							</p>
						) : (
							<div className="space-y-3">
								{topMovers.map((product: {
									id: string;
									name: string;
									category: string;
									overallScore: number;
									scoreChange: number;
								}) => (
									<Link
										key={product.id}
										href={`/app/products/${product.id}`}
										className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
									>
										<div className="flex-1 min-w-0">
											<p className="truncate font-medium">{product.name}</p>
											<p className="text-muted-foreground text-xs">
												{product.category}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<ScoreBadge
												score={product.overallScore}
												size="sm"
												showLabel={false}
											/>
											<div className="flex items-center gap-1 text-emerald-500">
												<ArrowUpIcon className="size-4" />
												<span className="font-semibold">
													+{product.scoreChange}
												</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<SparklesIcon className="size-5 text-primary" />
							New Entries
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<div
										key={i}
										className="h-16 animate-pulse rounded bg-muted"
									/>
								))}
							</div>
						) : newEntries.length === 0 ? (
							<p className="py-4 text-center text-muted-foreground">
								No new entries found.
							</p>
						) : (
							<div className="space-y-3">
								{newEntries.map((product: {
									id: string;
									name: string;
									category: string;
									overallScore: number;
									firstSeenAt: string;
								}) => (
									<Link
										key={product.id}
										href={`/app/products/${product.id}`}
										className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
									>
										<div className="flex-1 min-w-0">
											<p className="truncate font-medium">{product.name}</p>
											<p className="text-muted-foreground text-xs">
												{product.category}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<ScoreBadge
												score={product.overallScore}
												size="sm"
												showLabel={false}
											/>
											<span className="text-muted-foreground text-xs">
												{new Date(product.firstSeenAt).toLocaleDateString()}
											</span>
										</div>
									</Link>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
