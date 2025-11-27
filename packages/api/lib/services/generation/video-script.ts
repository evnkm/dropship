/**
 * Video Script Generator
 * 
 * Generates video scripts for TikTok and Facebook ads.
 * Uses OpenAI GPT-4 or Claude API for script generation.
 */

export interface VideoScriptInput {
	productName: string;
	productDescription?: string;
	category: string;
	targetDemographic?: string;
	painPoints?: string[];
	keyFeatures?: string[];
	price: number;
}

export interface VideoScene {
	sceneNumber: number;
	durationSeconds: number;
	visualDescription: string;
	voiceoverText: string;
	textOverlay: string;
	musicSuggestion: string;
}

export interface VideoScript {
	type: "ugc_testimonial" | "problem_solution" | "product_showcase";
	totalDuration: number;
	scenes: VideoScene[];
	platform: "tiktok" | "facebook" | "instagram";
}

/**
 * Generate the system prompt for video script generation
 * @param targetDemographic - Target audience description
 * @param painPoints - Customer pain points
 * @returns System prompt for AI
 */
export function generateVideoScriptSystemPrompt(
	targetDemographic: string,
	painPoints: string[],
): string {
	const painPointsText = painPoints.length > 0 
		? painPoints.join(", ") 
		: "common frustrations with existing solutions";

	return `You are an expert direct-response video ad copywriter specializing in TikTok and Facebook ads. Create scroll-stopping video scripts that follow the hook-problem-solution-CTA framework. The hook must capture attention in the first 2 seconds. Use conversational, relatable language. Include specific text overlays that reinforce key points. Target ${targetDemographic} audience with pain points around ${painPointsText}.`;
}

/**
 * Generate a UGC-style testimonial script (15 seconds)
 * @param input - Product information
 * @returns Video script with scenes
 */
export function generateUGCTestimonialScript(input: VideoScriptInput): VideoScript {
	const scenes: VideoScene[] = [
		{
			sceneNumber: 1,
			durationSeconds: 3,
			visualDescription: "Close-up of person looking excited, holding phone/product",
			voiceoverText: `OMG you guys, I finally found the perfect ${input.productName}!`,
			textOverlay: "GAME CHANGER",
			musicSuggestion: "Upbeat trending TikTok sound",
		},
		{
			sceneNumber: 2,
			durationSeconds: 5,
			visualDescription: "Product demonstration in natural setting",
			voiceoverText: `Look at this - it actually works! I've been using it for a week and I'm obsessed.`,
			textOverlay: "Watch this...",
			musicSuggestion: "Continue same track",
		},
		{
			sceneNumber: 3,
			durationSeconds: 4,
			visualDescription: "Before/after or results showcase",
			voiceoverText: `The difference is insane. Why didn't I get this sooner?`,
			textOverlay: "THE RESULTS",
			musicSuggestion: "Build to climax",
		},
		{
			sceneNumber: 4,
			durationSeconds: 3,
			visualDescription: "Person pointing at link, excited expression",
			voiceoverText: "Link in bio - trust me, you need this!",
			textOverlay: `Only $${input.price.toFixed(2)} - LINK IN BIO`,
			musicSuggestion: "Sound drop/beat",
		},
	];

	return {
		type: "ugc_testimonial",
		totalDuration: 15,
		scenes,
		platform: "tiktok",
	};
}

/**
 * Generate a problem-solution script (30 seconds)
 * @param input - Product information
 * @returns Video script with scenes
 */
export function generateProblemSolutionScript(input: VideoScriptInput): VideoScript {
	const painPoint = input.painPoints?.[0] || "struggling with everyday problems";

	const scenes: VideoScene[] = [
		{
			sceneNumber: 1,
			durationSeconds: 3,
			visualDescription: "Person frustrated with current solution",
			voiceoverText: `Are you tired of ${painPoint}?`,
			textOverlay: "STOP STRUGGLING",
			musicSuggestion: "Tense, building music",
		},
		{
			sceneNumber: 2,
			durationSeconds: 5,
			visualDescription: "Montage of common frustrations",
			voiceoverText: "I used to spend hours dealing with this. Nothing worked. Until I found this.",
			textOverlay: "I tried EVERYTHING",
			musicSuggestion: "Continue building",
		},
		{
			sceneNumber: 3,
			durationSeconds: 3,
			visualDescription: "Product reveal with dramatic lighting",
			voiceoverText: `Introducing the ${input.productName}.`,
			textOverlay: input.productName.toUpperCase(),
			musicSuggestion: "Music shift - positive, uplifting",
		},
		{
			sceneNumber: 4,
			durationSeconds: 8,
			visualDescription: "Product demonstration showing key features",
			voiceoverText: `It ${input.keyFeatures?.[0] || "solves the problem instantly"}. Plus, it ${input.keyFeatures?.[1] || "is incredibly easy to use"}.`,
			textOverlay: "WATCH THIS",
			musicSuggestion: "Upbeat, confident",
		},
		{
			sceneNumber: 5,
			durationSeconds: 5,
			visualDescription: "Happy customer using product, lifestyle shot",
			voiceoverText: "Now I can finally enjoy my day without worrying about this. Life changing.",
			textOverlay: "FINALLY!",
			musicSuggestion: "Feel-good vibes",
		},
		{
			sceneNumber: 6,
			durationSeconds: 6,
			visualDescription: "Product shot with price, CTA overlay",
			voiceoverText: `Get yours today for just $${input.price.toFixed(2)}. Limited stock available. Click the link now!`,
			textOverlay: `$${input.price.toFixed(2)} - TAP TO SHOP`,
			musicSuggestion: "Urgency beat",
		},
	];

	return {
		type: "problem_solution",
		totalDuration: 30,
		scenes,
		platform: "facebook",
	};
}

/**
 * Generate a product showcase script (15 seconds)
 * @param input - Product information
 * @returns Video script with scenes
 */
export function generateProductShowcaseScript(input: VideoScriptInput): VideoScript {
	const scenes: VideoScene[] = [
		{
			sceneNumber: 1,
			durationSeconds: 2,
			visualDescription: "Eye-catching product shot, dramatic reveal",
			voiceoverText: `This ${input.productName} is going viral.`,
			textOverlay: "TRENDING NOW",
			musicSuggestion: "Trending audio hook",
		},
		{
			sceneNumber: 2,
			durationSeconds: 4,
			visualDescription: "360-degree product view, highlighting design",
			voiceoverText: "Premium quality. Stunning design.",
			textOverlay: "PREMIUM QUALITY",
			musicSuggestion: "Sleek, modern beat",
		},
		{
			sceneNumber: 3,
			durationSeconds: 5,
			visualDescription: "Product in action, demonstrating key feature",
			voiceoverText: "And it actually works. See for yourself.",
			textOverlay: input.keyFeatures?.[0]?.toUpperCase() || "AMAZING RESULTS",
			musicSuggestion: "Build momentum",
		},
		{
			sceneNumber: 4,
			durationSeconds: 4,
			visualDescription: "Price reveal with urgency elements",
			voiceoverText: `Only $${input.price.toFixed(2)}. Selling fast. Get yours now.`,
			textOverlay: `$${input.price.toFixed(2)} - SHOP NOW`,
			musicSuggestion: "Drop/impact sound",
		},
	];

	return {
		type: "product_showcase",
		totalDuration: 15,
		scenes,
		platform: "instagram",
	};
}

/**
 * Generate all video script types for a product
 * @param input - Product information
 * @returns Array of video scripts
 */
export function generateAllVideoScripts(input: VideoScriptInput): VideoScript[] {
	return [
		generateUGCTestimonialScript(input),
		generateProblemSolutionScript(input),
		generateProductShowcaseScript(input),
	];
}
