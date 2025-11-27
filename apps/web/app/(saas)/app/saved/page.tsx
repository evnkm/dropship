"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@saas/products/components";

export default function SavedProductsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);

	const { data: savedData, isLoading } = useQuery({
		queryKey: ["savedProducts", page],
		queryFn: () => apiClient.products.saved({ page, limit: 12 }),
	});

	const unsaveMutation = useMutation({
		mutationFn: (productId: string) =>
			apiClient.products.unsave({ productId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
		},
	});

	const savedProducts = savedData?.products || [];
	const totalPages = savedData?.totalPages || 1;

	return (
		<div className="container py-8">
			<div className="mb-8">
				<h1 className="flex items-center gap-3 font-bold text-3xl">
					<BookmarkIcon className="size-8" />
					Saved Products
				</h1>
				<p className="text-muted-foreground">
					Your collection of saved products for later review
				</p>
			</div>

			{isLoading ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<ProductCardSkeleton key={i} />
					))}
				</div>
			) : savedProducts.length === 0 ? (
				<Card className="py-12 text-center">
					<CardContent>
						<BookmarkIcon className="mx-auto mb-4 size-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">No saved products yet</h3>
						<p className="mb-4 text-muted-foreground">
							Start exploring products and save the ones you like for later.
						</p>
						<Button asChild>
							<a href="/app/products">Browse Products</a>
						</Button>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{savedProducts.map((saved: {
							id: string;
							savedAt: string;
							notes: string | null;
							product: {
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
							};
						}) => (
							<ProductCard
								key={saved.id}
								id={saved.product.id}
								name={saved.product.name}
								imageUrl={saved.product.imageUrls?.[0]}
								category={saved.product.category}
								costPrice={Number(saved.product.costPrice)}
								suggestedRetailPrice={Number(saved.product.suggestedRetailPrice)}
								trendScore={saved.product.trendScore}
								competitionScore={saved.product.competitionScore}
								marginScore={saved.product.marginScore}
								overallScore={saved.product.overallScore}
								sourceUrl={saved.product.sourceUrl}
								isSaved={true}
								onUnsave={(id) => unsaveMutation.mutate(id)}
							/>
						))}
					</div>

					{totalPages > 1 && (
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
					)}
				</>
			)}
		</div>
	);
}
