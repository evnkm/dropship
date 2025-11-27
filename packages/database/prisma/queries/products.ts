import { db } from "../client";
import type { ProductSource } from "../generated";

export interface ProductFilters {
	page?: number;
	limit?: number;
	category?: string;
	minScore?: number;
	sortBy?: "overallScore" | "trendScore" | "competitionScore" | "marginScore" | "firstSeenAt";
	sortOrder?: "asc" | "desc";
	source?: ProductSource;
	isActive?: boolean;
}

export async function getProducts(filters: ProductFilters = {}) {
	const {
		page = 1,
		limit = 20,
		category,
		minScore = 0,
		sortBy = "overallScore",
		sortOrder = "desc",
		source,
		isActive = true,
	} = filters;

	const skip = (page - 1) * limit;
	const take = Math.min(limit, 100);

	const where = {
		...(category && { category }),
		...(source && { source }),
		...(minScore > 0 && { overallScore: { gte: minScore } }),
		isActive,
	};

	const [products, total] = await Promise.all([
		db.product.findMany({
			where,
			skip,
			take,
			orderBy: { [sortBy]: sortOrder },
			include: {
				adCreatives: {
					take: 1,
				},
			},
		}),
		db.product.count({ where }),
	]);

	return {
		products,
		pagination: {
			page,
			limit: take,
			total,
			totalPages: Math.ceil(total / take),
		},
	};
}

export async function getProductById(id: string) {
	return db.product.findUnique({
		where: { id },
		include: {
			adCreatives: true,
			scores: {
				orderBy: { recordedAt: "desc" },
				take: 30,
			},
		},
	});
}

export async function getProductByExternalId(externalId: string, source: ProductSource) {
	return db.product.findUnique({
		where: {
			externalId_source: {
				externalId,
				source,
			},
		},
	});
}

export async function createProduct(data: {
	externalId: string;
	source: ProductSource;
	name: string;
	description?: string;
	imageUrls: string[];
	sourceUrl: string;
	supplierUrl?: string;
	costPrice: number;
	suggestedRetailPrice: number;
	category: string;
	subcategory?: string;
	tags?: string[];
	shippingWeight?: number;
	shippingTime?: string;
	supplierRating?: number;
	supplierOrderCount?: number;
	trendScore?: number;
	competitionScore?: number;
	marginScore?: number;
	overallScore?: number;
	trendData?: object;
}) {
	return db.product.create({
		data: {
			...data,
			tags: data.tags || [],
		},
	});
}

export async function updateProduct(
	id: string,
	data: Partial<{
		name: string;
		description: string;
		imageUrls: string[];
		sourceUrl: string;
		supplierUrl: string;
		costPrice: number;
		suggestedRetailPrice: number;
		category: string;
		subcategory: string;
		tags: string[];
		shippingWeight: number;
		shippingTime: string;
		supplierRating: number;
		supplierOrderCount: number;
		trendScore: number;
		competitionScore: number;
		marginScore: number;
		overallScore: number;
		trendData: object;
		isActive: boolean;
	}>,
) {
	return db.product.update({
		where: { id },
		data,
	});
}

export async function getProductCreatives(productId: string) {
	return db.adCreative.findMany({
		where: { productId },
		orderBy: { generatedAt: "desc" },
	});
}

export async function getProductScoreHistory(productId: string, days = 30) {
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	return db.productScore.findMany({
		where: {
			productId,
			recordedAt: { gte: startDate },
		},
		orderBy: { recordedAt: "asc" },
	});
}

export async function createProductScore(data: {
	productId: string;
	trendScore: number;
	competitionScore: number;
	marginScore: number;
	overallScore: number;
	googleTrendsValue?: number;
	socialMentions?: number;
	adLibraryCount?: number;
	competitorStoreCount?: number;
}) {
	return db.productScore.create({
		data,
	});
}

export async function getHotProducts(limit = 10) {
	return db.product.findMany({
		where: {
			isActive: true,
			overallScore: { gte: 70 },
		},
		orderBy: { overallScore: "desc" },
		take: limit,
		include: {
			adCreatives: {
				take: 1,
			},
		},
	});
}

export async function getNewProductsToday() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return db.product.count({
		where: {
			firstSeenAt: { gte: today },
			isActive: true,
		},
	});
}

export async function getAverageScore() {
	const result = await db.product.aggregate({
		where: { isActive: true },
		_avg: {
			overallScore: true,
		},
	});
	return result._avg.overallScore || 0;
}

export async function getTopCategory() {
	const result = await db.product.groupBy({
		by: ["category"],
		where: { isActive: true },
		_count: { category: true },
		orderBy: { _count: { category: "desc" } },
		take: 1,
	});
	return result[0]?.category || null;
}

export async function getCategories() {
	const result = await db.product.groupBy({
		by: ["category"],
		where: { isActive: true },
		_count: { category: true },
		orderBy: { _count: { category: "desc" } },
	});
	return result.map((r) => ({
		category: r.category,
		count: r._count.category,
	}));
}

export async function getTrendingCategories(timeRange: "7d" | "30d" | "90d" = "30d") {
	const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const result = await db.product.groupBy({
		by: ["category"],
		where: {
			isActive: true,
			firstSeenAt: { gte: startDate },
		},
		_count: { category: true },
		_avg: { overallScore: true },
		orderBy: { _avg: { overallScore: "desc" } },
		take: 10,
	});

	return result.map((r) => ({
		category: r.category,
		productCount: r._count.category,
		avgScore: r._avg.overallScore || 0,
	}));
}

export async function getTopMovers(limit = 10) {
	return db.product.findMany({
		where: {
			isActive: true,
			trendScore: { gte: 70 },
		},
		orderBy: { trendScore: "desc" },
		take: limit,
	});
}

export async function getNewEntries(limit = 10) {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	return db.product.findMany({
		where: {
			isActive: true,
			firstSeenAt: { gte: sevenDaysAgo },
		},
		orderBy: { firstSeenAt: "desc" },
		take: limit,
	});
}
