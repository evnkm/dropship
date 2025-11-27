/**
 * Overall Score Calculator
 * 
 * The overall score combines trend, competition, and margin scores.
 * 
 * Formula: overallScore = (trendScore * 0.35) + (competitionScore * 0.30) + (marginScore * 0.35)
 * 
 * Products with overallScore >= 70 are classified as "Hot Products"
 * Products with overallScore >= 85 trigger email alerts
 */

import { calculateTrendScore, type TrendScoreInput } from "./trend-score";
import { calculateCompetitionScore, type CompetitionScoreInput } from "./competition-score";
import { calculateMarginScore, type MarginScoreInput } from "./margin-score";

export interface OverallScoreInput {
	trendScore: number;
	competitionScore: number;
	marginScore: number;
}

export interface FullScoreInput {
	trend: TrendScoreInput;
	competition: CompetitionScoreInput;
	margin: MarginScoreInput;
}

export interface ScoreResult {
	trendScore: number;
	competitionScore: number;
	marginScore: number;
	overallScore: number;
	isHotProduct: boolean;
	shouldTriggerAlert: boolean;
}

/**
 * Calculate the overall score from individual scores
 * @param input - The individual scores
 * @returns Overall score between 0-100
 */
export function calculateOverallScore(input: OverallScoreInput): number {
	const { trendScore, competitionScore, marginScore } = input;

	const normalizedTrend = Math.min(100, Math.max(0, trendScore));
	const normalizedCompetition = Math.min(100, Math.max(0, competitionScore));
	const normalizedMargin = Math.min(100, Math.max(0, marginScore));

	const score =
		normalizedTrend * 0.35 +
		normalizedCompetition * 0.30 +
		normalizedMargin * 0.35;

	return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Calculate all scores for a product
 * @param input - Full input data for all score calculations
 * @returns Complete score result with all individual and overall scores
 */
export function calculateAllScores(input: FullScoreInput): ScoreResult {
	const trendScore = calculateTrendScore(input.trend);
	const competitionScore = calculateCompetitionScore(input.competition);
	const marginScore = calculateMarginScore(input.margin);
	const overallScore = calculateOverallScore({
		trendScore,
		competitionScore,
		marginScore,
	});

	return {
		trendScore,
		competitionScore,
		marginScore,
		overallScore,
		isHotProduct: overallScore >= 70,
		shouldTriggerAlert: overallScore >= 85,
	};
}

/**
 * Check if a product qualifies as a "Hot Product"
 * @param overallScore - The overall score
 * @returns True if the product is a hot product
 */
export function isHotProduct(overallScore: number): boolean {
	return overallScore >= 70;
}

/**
 * Check if a product should trigger an email alert
 * @param overallScore - The overall score
 * @returns True if the product should trigger an alert
 */
export function shouldTriggerAlert(overallScore: number): boolean {
	return overallScore >= 85;
}

/**
 * Check if a product qualifies for ad creative generation
 * Ad creatives are generated for products with overallScore >= 60
 * @param overallScore - The overall score
 * @returns True if ad creatives should be generated
 */
export function shouldGenerateAdCreatives(overallScore: number): boolean {
	return overallScore >= 60;
}
