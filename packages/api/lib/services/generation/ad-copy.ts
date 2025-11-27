/**
 * Ad Copy Generator
 * 
 * Generates ad copy variations for Facebook/Instagram ads.
 * Uses OpenAI GPT-4 or Claude API for copy generation.
 */

export interface AdCopyInput {
	productName: string;
	productDescription?: string;
	category: string;
	targetDemographic?: string;
	keyFeatures?: string[];
	painPoints?: string[];
	price: number;
	originalPrice?: number;
}

export interface AdCopyVariation {
	headline: string;
	primaryText: string;
	description: string;
	callToAction: string;
	framework: "AIDA" | "PAS" | "FEATURE_BENEFIT";
}

export interface GeneratedAdCopy {
	headlines: string[];
	primaryTexts: string[];
	descriptions: string[];
	callToActions: string[];
	variations: AdCopyVariation[];
}

/**
 * Generate the system prompt for ad copy generation
 * @param targetDemographic - Target audience description
 * @returns System prompt for AI
 */
export function generateAdCopySystemPrompt(targetDemographic: string): string {
	return `You are a Facebook/Instagram ad copywriter. Write compelling ad copy that drives clicks and conversions. Use power words, create urgency without being pushy, and focus on benefits over features. Avoid clichés like 'game-changer' or 'revolutionary'. Include social proof elements where appropriate. Match the tone to ${targetDemographic}.`;
}

/**
 * Generate AIDA framework ad copy
 * Attention-Interest-Desire-Action
 * @param input - Product information
 * @returns Ad copy variation
 */
export function generateAIDACopy(input: AdCopyInput): AdCopyVariation {
	const discount = input.originalPrice 
		? Math.round((1 - input.price / input.originalPrice) * 100) 
		: 0;

	const headline = discount > 0
		? `${discount}% OFF - ${input.productName}`
		: `Discover ${input.productName}`;

	const primaryText = `${input.keyFeatures?.[0] || "Finally, a solution that works"}. ${input.productDescription || `The ${input.productName} you've been waiting for`}. Join thousands of happy customers who made the switch. Limited time offer - don't miss out!`;

	const description = `Premium ${input.category.toLowerCase()} at an unbeatable price`;

	return {
		headline: headline.slice(0, 40),
		primaryText: primaryText.slice(0, 125),
		description: description.slice(0, 30),
		callToAction: "Shop Now",
		framework: "AIDA",
	};
}

/**
 * Generate PAS framework ad copy
 * Problem-Agitate-Solution
 * @param input - Product information
 * @returns Ad copy variation
 */
export function generatePASCopy(input: AdCopyInput): AdCopyVariation {
	const painPoint = input.painPoints?.[0] || "everyday frustrations";

	const headline = `Stop ${painPoint.split(" ").slice(0, 3).join(" ")}`;

	const primaryText = `Tired of ${painPoint}? You're not alone. That's why we created ${input.productName}. ${input.keyFeatures?.[0] || "It works"}. See the difference for yourself.`;

	const description = `The solution you've been looking for`;

	return {
		headline: headline.slice(0, 40),
		primaryText: primaryText.slice(0, 125),
		description: description.slice(0, 30),
		callToAction: "Learn More",
		framework: "PAS",
	};
}

/**
 * Generate Feature-Benefit framework ad copy
 * @param input - Product information
 * @returns Ad copy variation
 */
export function generateFeatureBenefitCopy(input: AdCopyInput): AdCopyVariation {
	const feature = input.keyFeatures?.[0] || "premium quality";
	const benefit = input.keyFeatures?.[1] || "saves you time";

	const headline = `${input.productName} - ${feature}`;

	const primaryText = `${feature.charAt(0).toUpperCase() + feature.slice(1)} means ${benefit}. ${input.productDescription || `Experience the ${input.productName} difference`}. Order now and see why customers love it.`;

	const description = "Free shipping on orders over $50";

	return {
		headline: headline.slice(0, 40),
		primaryText: primaryText.slice(0, 125),
		description: description.slice(0, 30),
		callToAction: "Order Now",
		framework: "FEATURE_BENEFIT",
	};
}

/**
 * Generate multiple headline variations
 * @param input - Product information
 * @returns Array of headlines (max 40 chars each)
 */
export function generateHeadlines(input: AdCopyInput): string[] {
	const headlines = [
		`${input.productName} - Must Have`,
		`New: ${input.productName}`,
		`Get Your ${input.productName} Today`,
		`${input.category} Essential`,
		`Limited Stock: ${input.productName}`,
	];

	return headlines.map((h) => h.slice(0, 40));
}

/**
 * Generate multiple primary text variations
 * @param input - Product information
 * @returns Array of primary texts (max 125 chars each)
 */
export function generatePrimaryTexts(input: AdCopyInput): string[] {
	const texts = [
		`${input.productDescription || input.productName}. Order now and get free shipping!`,
		`Join thousands who love ${input.productName}. See why it's trending.`,
		`${input.keyFeatures?.[0] || "Premium quality"} at an amazing price. Limited time offer!`,
	];

	return texts.map((t) => t.slice(0, 125));
}

/**
 * Generate multiple description variations
 * @param input - Product information
 * @returns Array of descriptions (max 30 chars each)
 */
export function generateDescriptions(_input: AdCopyInput): string[] {
	const descriptions = [
		"Free shipping available",
		"30-day money back guarantee",
		"As seen on social media",
	];

	return descriptions.map((d) => d.slice(0, 30));
}

/**
 * Generate complete ad copy package for a product
 * @param input - Product information
 * @returns Complete ad copy with all variations
 */
export function generateAllAdCopy(input: AdCopyInput): GeneratedAdCopy {
	return {
		headlines: generateHeadlines(input),
		primaryTexts: generatePrimaryTexts(input),
		descriptions: generateDescriptions(input),
		callToActions: ["Shop Now", "Learn More", "Order Now", "Get Yours", "Buy Now"],
		variations: [
			generateAIDACopy(input),
			generatePASCopy(input),
			generateFeatureBenefitCopy(input),
		],
	};
}
