/**
 * Tier-Based Access Restrictions
 * 
 * Implements access control based on subscription tiers:
 * - FREE: Top 10 products/day with scores hidden, 5 detail views/day, ad copy only
 * - STARTER: Top 50 products, ad copy + images
 * - PRO: All products, all creatives including video scripts
 * - AGENCY: All products, all creatives
 */

export type SubscriptionTier = "FREE" | "STARTER" | "PRO" | "AGENCY";

export interface TierLimits {
	productsPerDay: number;
	detailViewsPerDay: number;
	showScores: boolean;
	adCopyAccess: boolean;
	imageAccess: boolean;
	videoScriptAccess: boolean;
	apiAccess: boolean;
	emailAlerts: boolean;
	scoreHistory: boolean;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
	FREE: {
		productsPerDay: 10,
		detailViewsPerDay: 5,
		showScores: false,
		adCopyAccess: true,
		imageAccess: false,
		videoScriptAccess: false,
		apiAccess: false,
		emailAlerts: false,
		scoreHistory: false,
	},
	STARTER: {
		productsPerDay: 50,
		detailViewsPerDay: 50,
		showScores: true,
		adCopyAccess: true,
		imageAccess: true,
		videoScriptAccess: false,
		apiAccess: false,
		emailAlerts: false,
		scoreHistory: false,
	},
	PRO: {
		productsPerDay: -1,
		detailViewsPerDay: -1,
		showScores: true,
		adCopyAccess: true,
		imageAccess: true,
		videoScriptAccess: true,
		apiAccess: false,
		emailAlerts: true,
		scoreHistory: true,
	},
	AGENCY: {
		productsPerDay: -1,
		detailViewsPerDay: -1,
		showScores: true,
		adCopyAccess: true,
		imageAccess: true,
		videoScriptAccess: true,
		apiAccess: true,
		emailAlerts: true,
		scoreHistory: true,
	},
};

/**
 * Get tier limits for a subscription tier
 */
export function getTierLimits(tier: SubscriptionTier): TierLimits {
	return TIER_LIMITS[tier] || TIER_LIMITS.FREE;
}

/**
 * Check if a user can access a specific feature
 */
export function canAccessFeature(
	tier: SubscriptionTier,
	feature: keyof TierLimits,
): boolean {
	const limits = getTierLimits(tier);
	const value = limits[feature];
	
	if (typeof value === "boolean") {
		return value;
	}
	
	return value !== 0;
}

/**
 * Get the number of products a user can view per day
 */
export function getProductsLimit(tier: SubscriptionTier): number {
	const limits = getTierLimits(tier);
	return limits.productsPerDay;
}

/**
 * Get the number of detail views a user can make per day
 */
export function getDetailViewsLimit(tier: SubscriptionTier): number {
	const limits = getTierLimits(tier);
	return limits.detailViewsPerDay;
}

/**
 * Check if a user can view product scores
 */
export function canViewScores(tier: SubscriptionTier): boolean {
	return getTierLimits(tier).showScores;
}

/**
 * Check if a user can access ad copy
 */
export function canAccessAdCopy(tier: SubscriptionTier): boolean {
	return getTierLimits(tier).adCopyAccess;
}

/**
 * Check if a user can access image creatives
 */
export function canAccessImages(tier: SubscriptionTier): boolean {
	return getTierLimits(tier).imageAccess;
}

/**
 * Check if a user can access video scripts
 */
export function canAccessVideoScripts(tier: SubscriptionTier): boolean {
	return getTierLimits(tier).videoScriptAccess;
}

/**
 * Check if a user can access the API
 */
export function canAccessApi(tier: SubscriptionTier): boolean {
	return getTierLimits(tier).apiAccess;
}

/**
 * Check if a user can receive email alerts
 */
export function canReceiveEmailAlerts(tier: SubscriptionTier): boolean {
	return getTierLimits(tier).emailAlerts;
}

/**
 * Check if a user can view score history
 */
export function canViewScoreHistory(tier: SubscriptionTier): boolean {
	return getTierLimits(tier).scoreHistory;
}

/**
 * Get the minimum tier required for a feature
 */
export function getMinimumTierForFeature(
	feature: keyof TierLimits,
): SubscriptionTier {
	const tiers: SubscriptionTier[] = ["FREE", "STARTER", "PRO", "AGENCY"];
	
	for (const tier of tiers) {
		if (canAccessFeature(tier, feature)) {
			return tier;
		}
	}
	
	return "AGENCY";
}

/**
 * Filter products based on tier limits
 */
export function filterProductsForTier<T extends { overallScore?: number }>(
	products: T[],
	tier: SubscriptionTier,
): T[] {
	const limits = getTierLimits(tier);
	
	if (limits.productsPerDay === -1) {
		return products;
	}
	
	return products.slice(0, limits.productsPerDay);
}

/**
 * Hide scores for products if tier doesn't allow viewing scores
 */
export function hideScoresIfNeeded<
	T extends {
		trendScore?: number;
		competitionScore?: number;
		marginScore?: number;
		overallScore?: number;
	},
>(products: T[], tier: SubscriptionTier): T[] {
	if (canViewScores(tier)) {
		return products;
	}
	
	return products.map((product) => ({
		...product,
		trendScore: undefined,
		competitionScore: undefined,
		marginScore: undefined,
		overallScore: undefined,
	}));
}

/**
 * Filter creatives based on tier access
 */
export function filterCreativesForTier<T extends { type: string }>(
	creatives: T[],
	tier: SubscriptionTier,
): T[] {
	const limits = getTierLimits(tier);
	
	return creatives.filter((creative) => {
		if (creative.type === "VIDEO_SCRIPT") {
			return limits.videoScriptAccess;
		}
		
		if (creative.type === "STATIC_IMAGE" || creative.type === "CAROUSEL") {
			return limits.imageAccess || limits.adCopyAccess;
		}
		
		return limits.adCopyAccess;
	});
}
