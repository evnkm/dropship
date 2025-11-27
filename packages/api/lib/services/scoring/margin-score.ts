/**
 * Margin Score Calculator
 * 
 * The margin score evaluates profitability potential based on typical dropshipping economics.
 * 
 * Formula: marginScore = min(100, (grossMarginPercent - 30) * 2.5)
 * where grossMarginPercent = ((suggestedRetailPrice - costPrice - estimatedShipping) / suggestedRetailPrice) * 100
 * 
 * Interpretation:
 * - Gross margin below 30%: marginScore = 0 (not viable for dropshipping)
 * - Gross margin of 50%: marginScore = 50
 * - Gross margin of 70%+: marginScore = 100
 */

export interface MarginScoreInput {
	costPrice: number;
	suggestedRetailPrice: number;
	shippingWeight?: number;
}

/**
 * Calculate the margin score for a product
 * @param input - The input data for calculating the margin score
 * @returns A score between 0-100
 */
export function calculateMarginScore(input: MarginScoreInput): number {
	const { costPrice, suggestedRetailPrice, shippingWeight } = input;

	if (suggestedRetailPrice <= 0) {
		return 0;
	}

	const estimatedShipping = calculateEstimatedShipping(shippingWeight);
	const grossMarginPercent = calculateGrossMarginPercent(
		costPrice,
		suggestedRetailPrice,
		estimatedShipping,
	);

	if (grossMarginPercent < 30) {
		return 0;
	}

	const score = (grossMarginPercent - 30) * 2.5;

	return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Calculate estimated shipping cost based on weight
 * @param weight - Product weight in grams
 * @returns Estimated shipping cost in USD
 */
export function calculateEstimatedShipping(weight?: number): number {
	if (!weight || weight <= 0) {
		return 5;
	}

	if (weight < 500) {
		return 3;
	}

	if (weight <= 2000) {
		return 7;
	}

	return 15;
}

/**
 * Calculate gross margin percentage
 * @param costPrice - Product cost price
 * @param suggestedRetailPrice - Suggested retail price
 * @param estimatedShipping - Estimated shipping cost
 * @returns Gross margin percentage
 */
export function calculateGrossMarginPercent(
	costPrice: number,
	suggestedRetailPrice: number,
	estimatedShipping: number,
): number {
	if (suggestedRetailPrice <= 0) {
		return 0;
	}

	const grossProfit = suggestedRetailPrice - costPrice - estimatedShipping;
	return (grossProfit / suggestedRetailPrice) * 100;
}

/**
 * Calculate suggested retail price based on cost and target margin
 * @param costPrice - Product cost price
 * @param targetMarginPercent - Target gross margin percentage
 * @param shippingWeight - Product weight for shipping calculation
 * @returns Suggested retail price
 */
export function calculateSuggestedRetailPrice(
	costPrice: number,
	targetMarginPercent: number,
	shippingWeight?: number,
): number {
	const estimatedShipping = calculateEstimatedShipping(shippingWeight);
	const totalCost = costPrice + estimatedShipping;
	
	return totalCost / (1 - targetMarginPercent / 100);
}
