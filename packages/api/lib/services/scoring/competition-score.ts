/**
 * Competition Score Calculator
 * 
 * The competition score measures market saturation.
 * Higher scores indicate LESS competition (inverted scale for intuitive interpretation).
 * 
 * Formula: competitionScore = 100 - ((adLibrarySaturation * 0.4) + (shopifyStoreCount * 0.3) + (amazonSellerCount * 0.3))
 */

export interface CompetitionScoreInput {
	adLibraryCount: number;
	shopifyStoreCount: number;
	amazonSellerCount: number;
}

/**
 * Calculate the competition score for a product
 * @param input - The input data for calculating the competition score
 * @returns A score between 0-100 (higher = less competition)
 */
export function calculateCompetitionScore(input: CompetitionScoreInput): number {
	const { adLibraryCount, shopifyStoreCount, amazonSellerCount } = input;

	const adLibrarySaturation = normalizeAdLibraryCount(adLibraryCount);
	const shopifySaturation = normalizeShopifyStoreCount(shopifyStoreCount);
	const amazonSaturation = normalizeAmazonSellerCount(amazonSellerCount);

	const saturationScore =
		adLibrarySaturation * 0.4 +
		shopifySaturation * 0.3 +
		amazonSaturation * 0.3;

	const score = 100 - saturationScore;

	return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Normalize ad library count to 0-100 scale
 * Scale: 0 ads = 0, 50+ ads = 100
 */
export function normalizeAdLibraryCount(count: number): number {
	if (count <= 0) {
		return 0;
	}
	if (count >= 50) {
		return 100;
	}
	return (count / 50) * 100;
}

/**
 * Normalize Shopify store count to 0-100 scale
 * Scale: 0 stores = 0, 20+ stores = 100
 */
export function normalizeShopifyStoreCount(count: number): number {
	if (count <= 0) {
		return 0;
	}
	if (count >= 20) {
		return 100;
	}
	return (count / 20) * 100;
}

/**
 * Normalize Amazon seller count to 0-100 scale
 * Scale: 1 seller = 0, 50+ sellers = 100
 */
export function normalizeAmazonSellerCount(count: number): number {
	if (count <= 1) {
		return 0;
	}
	if (count >= 50) {
		return 100;
	}
	return ((count - 1) / 49) * 100;
}
