/**
 * Trend Score Calculator
 * 
 * The trend score measures how rapidly interest in the product is growing.
 * Higher scores indicate products on an upward trajectory.
 * 
 * Formula: trendScore = (googleTrendsGrowth * 0.4) + (salesVelocity * 0.3) + (socialMomentum * 0.3)
 */

export interface TrendScoreInput {
	googleTrendsGrowth: number;
	salesVelocity: number;
	socialMomentum: number;
}

/**
 * Calculate the trend score for a product
 * @param input - The input data for calculating the trend score
 * @returns A score between 0-100
 */
export function calculateTrendScore(input: TrendScoreInput): number {
	const { googleTrendsGrowth, salesVelocity, socialMomentum } = input;

	const normalizedGoogleTrends = Math.min(100, Math.max(0, googleTrendsGrowth));
	const normalizedSalesVelocity = Math.min(100, Math.max(0, salesVelocity));
	const normalizedSocialMomentum = Math.min(100, Math.max(0, socialMomentum));

	const score =
		normalizedGoogleTrends * 0.4 +
		normalizedSalesVelocity * 0.3 +
		normalizedSocialMomentum * 0.3;

	return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Calculate Google Trends growth percentage
 * @param currentValue - Current Google Trends interest value
 * @param previousValue - Previous Google Trends interest value (30 days ago)
 * @returns Normalized growth percentage (0-100)
 */
export function calculateGoogleTrendsGrowth(
	currentValue: number,
	previousValue: number,
): number {
	if (previousValue === 0) {
		return currentValue > 0 ? 100 : 0;
	}

	const growthPercent = ((currentValue - previousValue) / previousValue) * 100;
	return Math.min(100, Math.max(0, growthPercent));
}

/**
 * Calculate sales velocity score
 * @param currentWeekOrders - Orders in the current week
 * @param previousWeekOrders - Orders in the previous week
 * @returns Normalized velocity score (0-100)
 */
export function calculateSalesVelocity(
	currentWeekOrders: number,
	previousWeekOrders: number,
): number {
	if (previousWeekOrders === 0) {
		return currentWeekOrders > 0 ? 100 : 0;
	}

	const velocityPercent =
		((currentWeekOrders / previousWeekOrders - 1) * 100);
	return Math.min(100, Math.max(0, velocityPercent));
}

/**
 * Calculate social momentum score
 * @param redditUpvotes - Total Reddit upvotes
 * @param pinterestSaves - Total Pinterest saves
 * @param categoryAverage - Category average for social engagement
 * @returns Normalized momentum score (0-100)
 */
export function calculateSocialMomentum(
	redditUpvotes: number,
	pinterestSaves: number,
	categoryAverage: number,
): number {
	const totalEngagement = redditUpvotes + pinterestSaves;
	
	if (categoryAverage === 0) {
		return totalEngagement > 0 ? 50 : 0;
	}

	const ratio = totalEngagement / categoryAverage;
	return Math.min(100, Math.max(0, ratio * 50));
}
