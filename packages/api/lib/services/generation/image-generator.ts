/**
 * Image Creative Generator
 * 
 * Generates lifestyle images and ad compositions for products.
 * Uses OpenAI DALL-E 3 or Stability AI SDXL for image generation.
 */

export interface ProductImageInput {
	productName: string;
	productDescription?: string;
	category: string;
	targetDemographic?: string;
	imageUrl?: string;
}

export interface GeneratedImage {
	url: string;
	format: "1080x1080" | "1080x1920" | "1200x628";
	type: "lifestyle" | "ad_composition";
}

export interface LifestyleImagePrompt {
	productName: string;
	productDescription: string;
	targetDemographic: string;
	setting: string;
}

/**
 * Generate a lifestyle image prompt for DALL-E or Stability AI
 * @param input - Product information for prompt generation
 * @returns Formatted prompt string
 */
export function generateLifestyleImagePrompt(input: LifestyleImagePrompt): string {
	const { productName, productDescription, targetDemographic, setting } = input;

	return `Professional product photography of ${productName}, ${productDescription}, being used by ${targetDemographic} in ${setting}. Lifestyle photography style, soft natural lighting, shallow depth of field, high-end e-commerce aesthetic. No text overlays.`;
}

/**
 * Get target demographic based on product category
 * @param category - Product category
 * @returns Target demographic description
 */
export function getTargetDemographic(category: string): string {
	const demographics: Record<string, string> = {
		Electronics: "tech-savvy young professionals",
		"Home & Garden": "modern homeowners",
		Beauty: "style-conscious women aged 25-45",
		"Fashion Accessories": "fashion-forward millennials",
		Sports: "active fitness enthusiasts",
		Toys: "parents with young children",
		Kitchen: "home cooking enthusiasts",
		Fitness: "health-conscious adults",
		Pet: "devoted pet owners",
		Baby: "new parents",
	};

	return demographics[category] || "modern consumers";
}

/**
 * Get setting based on product category
 * @param category - Product category
 * @returns Setting description for lifestyle image
 */
export function getSettingForCategory(category: string): string {
	const settings: Record<string, string> = {
		Electronics: "a modern minimalist home office",
		"Home & Garden": "a beautifully decorated living space",
		Beauty: "a bright, clean bathroom vanity",
		"Fashion Accessories": "an urban street setting",
		Sports: "an outdoor fitness environment",
		Toys: "a bright, cheerful playroom",
		Kitchen: "a modern, well-lit kitchen",
		Fitness: "a home gym or outdoor workout space",
		Pet: "a cozy home environment",
		Baby: "a warm, safe nursery",
	};

	return settings[category] || "a clean, modern environment";
}

/**
 * Generate ad image composition specifications
 * @param productName - Name of the product
 * @param price - Product price
 * @returns Ad composition specifications
 */
export function generateAdCompositionSpecs(
	_productName: string,
	price: number,
): {
	priceBadge: string;
	urgencyText: string;
	callToAction: string;
	typography: string;
} {
	return {
		priceBadge: `Only $${price.toFixed(2)}`,
		urgencyText: "Limited Stock",
		callToAction: "Shop Now",
		typography: "Inter or Poppins",
	};
}

/**
 * Get output formats for different ad platforms
 * @returns Array of format specifications
 */
export function getOutputFormats(): Array<{
	name: string;
	width: number;
	height: number;
	platform: string;
}> {
	return [
		{ name: "square", width: 1080, height: 1080, platform: "Instagram/Facebook feed" },
		{ name: "story", width: 1080, height: 1920, platform: "Stories/Reels" },
		{ name: "link", width: 1200, height: 628, platform: "Facebook link ads" },
	];
}

/**
 * Generate multiple lifestyle image prompts for a product
 * @param input - Product information
 * @returns Array of prompts for different lifestyle scenarios
 */
export function generateMultipleLifestylePrompts(
	input: ProductImageInput,
): string[] {
	const targetDemographic = input.targetDemographic || getTargetDemographic(input.category);
	const baseDescription = input.productDescription || input.productName;

	const scenarios = [
		{
			setting: getSettingForCategory(input.category),
			demographic: targetDemographic,
		},
		{
			setting: "a bright, naturally lit studio",
			demographic: targetDemographic,
		},
		{
			setting: "an aspirational lifestyle setting",
			demographic: targetDemographic,
		},
	];

	return scenarios.map((scenario) =>
		generateLifestyleImagePrompt({
			productName: input.productName,
			productDescription: baseDescription,
			targetDemographic: scenario.demographic,
			setting: scenario.setting,
		}),
	);
}
