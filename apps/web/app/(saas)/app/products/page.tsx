"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Input } from "@ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon, FilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@saas/products/components";

export default function ProductsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [category, setCategory] = useState<string>("");
	const [minScore, setMinScore] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string>("overallScore");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [searchQuery, setSearchQuery] = useState("");

	const { data: productsData, isLoading: isLoadingProducts } = useQuery({
		queryKey: ["products", page, category, minScore, sortBy, sortOrder],
		queryFn: () =>
			apiClient.products.list({
				page,
				limit: 12,
				category: category || undefined,
				minScore: minScore || undefined,
				sortBy,
				sortOrder,
			}),
	});

	const { data: categoriesData } = useQuery({
		queryKey: ["categories"],
		queryFn: () => apiClient.products.categories({}),
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

	const products = productsData?.products || [];
	const totalPages = productsData?.totalPages || 1;
	const categories = categoriesData?.categories || [];

	const filteredProducts = searchQuery
		? products.filter((p: { name: string }) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: products;

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="font-bold text-3xl">Products</h1>
				<p className="text-muted-foreground">
					Discover trending products with high profit potential
				</p>
			</div>

			<Card className="mb-6">
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center gap-2 text-lg">
						<FilterIcon className="size-5" />
						Filters
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<div className="relative flex-1 min-w-[200px]">
							<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">All Categories</SelectItem>
								{categories.map((cat: { category: string; count: number }) => (
									<SelectItem key={cat.category} value={cat.category}>
										{cat.category} ({cat.count})
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={minScore.toString()}
							onValueChange={(v) => setMinScore(Number(v))}
						>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Min Score" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0">Any Score</SelectItem>
								<SelectItem value="50">50+</SelectItem>
								<SelectItem value="60">60+</SelectItem>
								<SelectItem value="70">70+ (Hot)</SelectItem>
								<SelectItem value="80">80+</SelectItem>
								<SelectItem value="90">90+</SelectItem>
							</SelectContent>
						</Select>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Sort By" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="overallScore">Overall Score</SelectItem>
								<SelectItem value="trendScore">Trend Score</SelectItem>
								<SelectItem value="competitionScore">Competition</SelectItem>
								<SelectItem value="marginScore">Margin</SelectItem>
								<SelectItem value="firstSeenAt">Newest</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={sortOrder}
							onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
						>
							<SelectTrigger className="w-[120px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="desc">High to Low</SelectItem>
								<SelectItem value="asc">Low to High</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{isLoadingProducts ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<ProductCardSkeleton key={i} />
					))}
				</div>
			) : filteredProducts.length === 0 ? (
				<Card className="py-12 text-center">
					<CardContent>
						<p className="text-muted-foreground">
							No products found matching your criteria.
						</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filteredProducts.map((product: {
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

					<div className="mt-8 flex items-center justify-center gap-2">
						<Button
							variant="outline"
							size="icon"
							disabled={page === 1}
							onClick={() => setPage((p) => p - 1)}
						>
							<ChevronLeftIcon className="size-4" />
						</Button>
						<span className="px-4 text-sm">
							Page {page} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="icon"
							disabled={page === totalPages}
							onClick={() => setPage((p) => p + 1)}
						>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
