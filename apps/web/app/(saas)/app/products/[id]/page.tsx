"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeftIcon,
	BookmarkIcon,
	ExternalLinkIcon,
	TruckIcon,
	StarIcon,
	PackageIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	ScoreRow,
	ImageGallery,
	TrendChart,
	CopyableText,
	CopyableAdCopy,
} from "@saas/products/components";

export default function ProductDetailPage() {
	const params = useParams();
	const productId = params.id as string;
	const queryClient = useQueryClient();

	const { data: product, isLoading: isLoadingProduct } = useQuery({
		queryKey: ["product", productId],
		queryFn: () => apiClient.products.get({ id: productId }),
	});

	const { data: creativesData, isLoading: isLoadingCreatives } = useQuery({
		queryKey: ["creatives", productId],
		queryFn: () => apiClient.products.creatives({ productId }),
	});

	const { data: historyData, isLoading: isLoadingHistory } = useQuery({
		queryKey: ["productHistory", productId],
		queryFn: () => apiClient.analytics.productHistory({ id: productId, days: 30 }),
	});

	const { data: savedProductsData } = useQuery({
		queryKey: ["savedProducts"],
		queryFn: () => apiClient.products.saved({ page: 1, limit: 1000 }),
	});

	const savedProductIds = new Set(
		savedProductsData?.products?.map((sp: { product: { id: string } }) => sp.product.id) || [],
	);

	const isSaved = savedProductIds.has(productId);

	const saveMutation = useMutation({
		mutationFn: () => apiClient.products.save({ productId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
		},
	});

	const unsaveMutation = useMutation({
		mutationFn: () => apiClient.products.unsave({ productId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
		},
	});

	if (isLoadingProduct) {
		return (
			<div className="container py-8">
				<div className="animate-pulse space-y-6">
					<div className="h-8 w-48 rounded bg-muted" />
					<div className="grid gap-8 lg:grid-cols-2">
						<div className="aspect-square rounded-lg bg-muted" />
						<div className="space-y-4">
							<div className="h-10 w-3/4 rounded bg-muted" />
							<div className="h-6 w-1/2 rounded bg-muted" />
							<div className="h-24 rounded bg-muted" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="container py-8">
				<Card className="py-12 text-center">
					<CardContent>
						<p className="text-muted-foreground">Product not found.</p>
						<Button asChild className="mt-4">
							<Link href="/app/products">Back to Products</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const margin = Number(product.suggestedRetailPrice) - Number(product.costPrice);
	const marginPercent =
		Number(product.suggestedRetailPrice) > 0
			? Math.round((margin / Number(product.suggestedRetailPrice)) * 100)
			: 0;

	const creatives = creativesData?.creatives || [];
	const adCopyCreatives = creatives.filter(
		(c: { type: string }) => c.type === "STATIC_IMAGE" || c.type === "CAROUSEL",
	);
	const videoScriptCreatives = creatives.filter(
		(c: { type: string }) => c.type === "VIDEO_SCRIPT",
	);

	const scoreHistory = historyData?.history || [];

	return (
		<div className="container py-8">
			<div className="mb-6">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/app/products">
						<ArrowLeftIcon className="mr-2 size-4" />
						Back to Products
					</Link>
				</Button>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				<div>
					<ImageGallery
						images={product.imageUrls || []}
						alt={product.name}
					/>
				</div>

				<div className="space-y-6">
					<div>
						<div className="mb-2 flex items-center gap-2">
							<span className="rounded-full bg-primary/10 px-3 py-1 text-primary text-xs font-medium">
								{product.category}
							</span>
							{product.subcategory && (
								<span className="rounded-full bg-muted px-3 py-1 text-muted-foreground text-xs">
									{product.subcategory}
								</span>
							)}
						</div>
						<h1 className="mb-2 font-bold text-2xl">{product.name}</h1>
						{product.description && (
							<p className="text-muted-foreground">{product.description}</p>
						)}
					</div>

					<div className="flex items-center gap-4">
						<Button
							variant={isSaved ? "secondary" : "default"}
							onClick={() =>
								isSaved ? unsaveMutation.mutate() : saveMutation.mutate()
							}
							disabled={saveMutation.isPending || unsaveMutation.isPending}
						>
							<BookmarkIcon
								className={`mr-2 size-4 ${isSaved ? "fill-current" : ""}`}
							/>
							{isSaved ? "Saved" : "Save Product"}
						</Button>
						{product.sourceUrl && (
							<Button variant="outline" asChild>
								<a
									href={product.sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLinkIcon className="mr-2 size-4" />
									View Source
								</a>
							</Button>
						)}
						{product.supplierUrl && (
							<Button variant="outline" asChild>
								<a
									href={product.supplierUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<PackageIcon className="mr-2 size-4" />
									Supplier
								</a>
							</Button>
						)}
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Product Scores</CardTitle>
						</CardHeader>
						<CardContent>
							<ScoreRow
								trendScore={product.trendScore}
								competitionScore={product.competitionScore}
								marginScore={product.marginScore}
								overallScore={product.overallScore}
								size="lg"
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Pricing</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 gap-4">
								<div>
									<p className="text-muted-foreground text-sm">Cost Price</p>
									<p className="font-bold text-xl">
										${Number(product.costPrice).toFixed(2)}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">
										Suggested Retail
									</p>
									<p className="font-bold text-xl">
										${Number(product.suggestedRetailPrice).toFixed(2)}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Profit Margin</p>
									<p className="font-bold text-emerald-500 text-xl">
										${margin.toFixed(2)} ({marginPercent}%)
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Supplier Info</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								{product.supplierRating && (
									<div className="flex items-center gap-2">
										<StarIcon className="size-4 text-amber-500" />
										<span>
											{Number(product.supplierRating).toFixed(1)} rating
										</span>
									</div>
								)}
								{product.supplierOrderCount && (
									<div className="flex items-center gap-2">
										<PackageIcon className="size-4 text-muted-foreground" />
										<span>{product.supplierOrderCount.toLocaleString()} orders</span>
									</div>
								)}
								{product.shippingTime && (
									<div className="flex items-center gap-2">
										<TruckIcon className="size-4 text-muted-foreground" />
										<span>{product.shippingTime}</span>
									</div>
								)}
								{product.shippingWeight && (
									<div className="flex items-center gap-2">
										<PackageIcon className="size-4 text-muted-foreground" />
										<span>{Number(product.shippingWeight)}g</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="mt-8">
				<Tabs defaultValue="trends">
					<TabsList>
						<TabsTrigger value="trends">Score History</TabsTrigger>
						<TabsTrigger value="adcopy">Ad Copy</TabsTrigger>
						<TabsTrigger value="videoscripts">Video Scripts</TabsTrigger>
					</TabsList>

					<TabsContent value="trends" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>30-Day Score History</CardTitle>
							</CardHeader>
							<CardContent>
								{isLoadingHistory ? (
									<div className="h-[300px] animate-pulse rounded bg-muted" />
								) : scoreHistory.length > 0 ? (
									<TrendChart
										data={scoreHistory.map((h: {
											recordedAt: string;
											trendScore: number;
											competitionScore: number;
											marginScore: number;
											overallScore: number;
										}) => ({
											date: h.recordedAt,
											trendScore: h.trendScore,
											competitionScore: h.competitionScore,
											marginScore: h.marginScore,
											overallScore: h.overallScore,
										}))}
									/>
								) : (
									<p className="py-8 text-center text-muted-foreground">
										No historical data available yet.
									</p>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="adcopy" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Ad Copy Variations</CardTitle>
							</CardHeader>
							<CardContent>
								{isLoadingCreatives ? (
									<div className="space-y-4">
										{Array.from({ length: 3 }).map((_, i) => (
											<div
												key={i}
												className="h-32 animate-pulse rounded bg-muted"
											/>
										))}
									</div>
								) : adCopyCreatives.length > 0 ? (
									<div className="space-y-6">
										{adCopyCreatives.map((creative: {
											id: string;
											headline: string;
											primaryText: string;
											description: string;
											callToAction: string;
											platform: string;
										}) => (
											<div key={creative.id} className="border-b pb-6 last:border-0">
												<div className="mb-2 flex items-center gap-2">
													<span className="rounded bg-muted px-2 py-1 text-xs">
														{creative.platform}
													</span>
												</div>
												<CopyableAdCopy
													headline={creative.headline || ""}
													primaryText={creative.primaryText || ""}
													description={creative.description || ""}
													callToAction={creative.callToAction || ""}
												/>
											</div>
										))}
									</div>
								) : (
									<p className="py-8 text-center text-muted-foreground">
										No ad copy available for this product.
									</p>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="videoscripts" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Video Scripts</CardTitle>
							</CardHeader>
							<CardContent>
								{isLoadingCreatives ? (
									<div className="space-y-4">
										{Array.from({ length: 2 }).map((_, i) => (
											<div
												key={i}
												className="h-48 animate-pulse rounded bg-muted"
											/>
										))}
									</div>
								) : videoScriptCreatives.length > 0 ? (
									<div className="space-y-6">
										{videoScriptCreatives.map((creative: {
											id: string;
											platform: string;
											primaryText: string;
										}) => (
											<div key={creative.id} className="border-b pb-6 last:border-0">
												<div className="mb-2 flex items-center gap-2">
													<span className="rounded bg-muted px-2 py-1 text-xs">
														{creative.platform}
													</span>
												</div>
												<CopyableText
													text={creative.primaryText || ""}
													label="Video Script"
												/>
											</div>
										))}
									</div>
								) : (
									<p className="py-8 text-center text-muted-foreground">
										No video scripts available for this product. Upgrade to PRO
										to access video scripts.
									</p>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
