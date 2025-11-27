"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	ArrowRightIcon,
	FlameIcon,
	PackageIcon,
	TrendingUpIcon,
	TagIcon,
} from "lucide-react";
import Link from "next/link";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@saas/products/components";

export default function DashboardPage() {
	const queryClient = useQueryClient();

	const { data: statsData, isLoading: isLoadingStats } = useQuery({
		queryKey: ["dashboardStats"],
		queryFn: () => apiClient.products.dashboardStats({}),
	});

	const { data: savedProductsData } = useQuery({
		queryKey: ["savedProducts"],
		queryFn: () => apiClient.products.saved({ page: 1, limit: 1000 }),
	});

	const savedProductIds = new Set(
		savedProductsData?.products?.map((sp: { product: { id: string } }) => sp.product.id) || [],
	);

	const saveMutation = useMutation({
		mutationFn: (productId: string) =>
			apiClient.products.save({ productId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
		},
	});

	const unsaveMutation = useMutation({
		mutationFn: (productId: string) =>
			apiClient.products.unsave({ productId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
		},
	});

	const stats = statsData || {
		newProductsToday: 0,
		averageScore: 0,
		topCategory: null,
		hotProducts: [],
	};

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="font-bold text-3xl">Dashboard</h1>
				<p className="text-muted-foreground">
					Your daily overview of trending products and opportunities
				</p>
			</div>

			<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">New Today</CardTitle>
						<PackageIcon className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoadingStats ? (
							<div className="h-8 w-16 animate-pulse rounded bg-muted" />
						) : (
							<div className="font-bold text-2xl">{stats.newProductsToday}</div>
						)}
						<p className="text-muted-foreground text-xs">
							Products discovered today
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">Avg Score</CardTitle>
						<TrendingUpIcon className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoadingStats ? (
							<div className="h-8 w-16 animate-pulse rounded bg-muted" />
						) : (
							<div className="font-bold text-2xl">
								{Math.round(stats.averageScore)}
							</div>
						)}
						<p className="text-muted-foreground text-xs">
							Average product score
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">Top Category</CardTitle>
						<TagIcon className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoadingStats ? (
							<div className="h-8 w-24 animate-pulse rounded bg-muted" />
						) : (
							<div className="font-bold text-2xl">
								{stats.topCategory || "N/A"}
							</div>
						)}
						<p className="text-muted-foreground text-xs">
							Most active category
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-sm">Hot Products</CardTitle>
						<FlameIcon className="size-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						{isLoadingStats ? (
							<div className="h-8 w-16 animate-pulse rounded bg-muted" />
						) : (
							<div className="font-bold text-2xl">
								{stats.hotProducts?.length || 0}
							</div>
						)}
						<p className="text-muted-foreground text-xs">
							Products with score 70+
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="flex items-center gap-2 font-bold text-xl">
						<FlameIcon className="size-5 text-orange-500" />
						Hot Products
					</h2>
					<p className="text-muted-foreground text-sm">
						Top performing products with overall score 70+
					</p>
				</div>
				<Button variant="outline" asChild>
					<Link href="/app/products?minScore=70">
						View All
						<ArrowRightIcon className="ml-2 size-4" />
					</Link>
				</Button>
			</div>

			{isLoadingStats ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<ProductCardSkeleton key={i} />
					))}
				</div>
			) : stats.hotProducts?.length === 0 ? (
				<Card className="py-12 text-center">
					<CardContent>
						<FlameIcon className="mx-auto mb-4 size-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">No hot products yet</h3>
						<p className="mb-4 text-muted-foreground">
							Check back later for trending products with high scores.
						</p>
						<Button asChild>
							<Link href="/app/products">Browse All Products</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{stats.hotProducts?.slice(0, 8).map((product: {
						id: string;
						name: string;
						imageUrls: string[];
						category: string;
						costPrice: number;
						suggestedRetailPrice: number;
						trendScore: number;
						competitionScore: number;
						marginScore: number;
						overallScore: number;
						sourceUrl: string;
					}) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							imageUrl={product.imageUrls?.[0]}
							category={product.category}
							costPrice={Number(product.costPrice)}
							suggestedRetailPrice={Number(product.suggestedRetailPrice)}
							trendScore={product.trendScore}
							competitionScore={product.competitionScore}
							marginScore={product.marginScore}
							overallScore={product.overallScore}
							sourceUrl={product.sourceUrl}
							isSaved={savedProductIds.has(product.id)}
							onSave={(id) => saveMutation.mutate(id)}
							onUnsave={(id) => unsaveMutation.mutate(id)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
