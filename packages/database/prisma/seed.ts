import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_PRODUCTS = [
	{
		name: "LED Strip Lights RGB 5M",
		description: "Color changing LED strip lights with remote control, perfect for room decoration and gaming setups.",
		category: "Home & Garden",
		sourceUrl: "https://example.com/led-strip",
		imageUrls: ["https://picsum.photos/seed/led1/400/400", "https://picsum.photos/seed/led2/400/400"],
		costPrice: 4.99,
		suggestedRetailPrice: 24.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/led-strip",
		weight: 0.3,
		googleTrendsGrowth: 85,
		salesVelocity: 78,
		socialMomentum: 92,
		adLibraryCount: 45,
		shopifyStoreCount: 120,
		amazonSellerCount: 89,
	},
	{
		name: "Portable Blender USB Rechargeable",
		description: "Mini portable blender for smoothies and shakes, USB rechargeable with 6 blades.",
		category: "Kitchen",
		sourceUrl: "https://example.com/portable-blender",
		imageUrls: ["https://picsum.photos/seed/blender1/400/400", "https://picsum.photos/seed/blender2/400/400"],
		costPrice: 8.50,
		suggestedRetailPrice: 34.99,
		supplierName: "CJ Dropshipping",
		supplierUrl: "https://cjdropshipping.com/item/blender",
		weight: 0.5,
		googleTrendsGrowth: 72,
		salesVelocity: 88,
		socialMomentum: 95,
		adLibraryCount: 78,
		shopifyStoreCount: 200,
		amazonSellerCount: 156,
	},
	{
		name: "Wireless Earbuds Pro",
		description: "True wireless earbuds with noise cancellation, 30 hour battery life, and touch controls.",
		category: "Electronics",
		sourceUrl: "https://example.com/wireless-earbuds",
		imageUrls: ["https://picsum.photos/seed/earbuds1/400/400", "https://picsum.photos/seed/earbuds2/400/400"],
		costPrice: 12.99,
		suggestedRetailPrice: 49.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/earbuds",
		weight: 0.1,
		googleTrendsGrowth: 65,
		salesVelocity: 92,
		socialMomentum: 88,
		adLibraryCount: 150,
		shopifyStoreCount: 350,
		amazonSellerCount: 280,
	},
	{
		name: "Posture Corrector Back Brace",
		description: "Adjustable posture corrector for men and women, helps relieve back pain and improve posture.",
		category: "Health & Beauty",
		sourceUrl: "https://example.com/posture-corrector",
		imageUrls: ["https://picsum.photos/seed/posture1/400/400", "https://picsum.photos/seed/posture2/400/400"],
		costPrice: 5.99,
		suggestedRetailPrice: 29.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/posture",
		weight: 0.2,
		googleTrendsGrowth: 78,
		salesVelocity: 85,
		socialMomentum: 82,
		adLibraryCount: 65,
		shopifyStoreCount: 180,
		amazonSellerCount: 145,
	},
	{
		name: "Smart Watch Fitness Tracker",
		description: "Waterproof smart watch with heart rate monitor, sleep tracking, and 7-day battery life.",
		category: "Electronics",
		sourceUrl: "https://example.com/smart-watch",
		imageUrls: ["https://picsum.photos/seed/watch1/400/400", "https://picsum.photos/seed/watch2/400/400"],
		costPrice: 15.99,
		suggestedRetailPrice: 59.99,
		supplierName: "CJ Dropshipping",
		supplierUrl: "https://cjdropshipping.com/item/watch",
		weight: 0.15,
		googleTrendsGrowth: 70,
		salesVelocity: 90,
		socialMomentum: 85,
		adLibraryCount: 200,
		shopifyStoreCount: 400,
		amazonSellerCount: 320,
	},
	{
		name: "Pet Hair Remover Roller",
		description: "Reusable pet hair remover for furniture, clothes, and car seats. No batteries or refills needed.",
		category: "Pet Supplies",
		sourceUrl: "https://example.com/pet-hair-remover",
		imageUrls: ["https://picsum.photos/seed/pet1/400/400", "https://picsum.photos/seed/pet2/400/400"],
		costPrice: 3.50,
		suggestedRetailPrice: 19.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/pet-roller",
		weight: 0.25,
		googleTrendsGrowth: 82,
		salesVelocity: 75,
		socialMomentum: 90,
		adLibraryCount: 35,
		shopifyStoreCount: 95,
		amazonSellerCount: 78,
	},
	{
		name: "Magnetic Phone Mount for Car",
		description: "Universal magnetic car phone holder with strong magnets and 360 degree rotation.",
		category: "Automotive",
		sourceUrl: "https://example.com/phone-mount",
		imageUrls: ["https://picsum.photos/seed/mount1/400/400", "https://picsum.photos/seed/mount2/400/400"],
		costPrice: 2.99,
		suggestedRetailPrice: 14.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/phone-mount",
		weight: 0.1,
		googleTrendsGrowth: 55,
		salesVelocity: 70,
		socialMomentum: 65,
		adLibraryCount: 180,
		shopifyStoreCount: 450,
		amazonSellerCount: 380,
	},
	{
		name: "Silicone Kitchen Utensil Set",
		description: "10-piece heat resistant silicone cooking utensils with wooden handles.",
		category: "Kitchen",
		sourceUrl: "https://example.com/utensil-set",
		imageUrls: ["https://picsum.photos/seed/utensil1/400/400", "https://picsum.photos/seed/utensil2/400/400"],
		costPrice: 9.99,
		suggestedRetailPrice: 39.99,
		supplierName: "CJ Dropshipping",
		supplierUrl: "https://cjdropshipping.com/item/utensils",
		weight: 0.8,
		googleTrendsGrowth: 60,
		salesVelocity: 72,
		socialMomentum: 68,
		adLibraryCount: 90,
		shopifyStoreCount: 220,
		amazonSellerCount: 175,
	},
	{
		name: "Neck Massager with Heat",
		description: "Electric neck and shoulder massager with heat therapy and adjustable intensity.",
		category: "Health & Beauty",
		sourceUrl: "https://example.com/neck-massager",
		imageUrls: ["https://picsum.photos/seed/massager1/400/400", "https://picsum.photos/seed/massager2/400/400"],
		costPrice: 18.99,
		suggestedRetailPrice: 69.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/massager",
		weight: 0.6,
		googleTrendsGrowth: 88,
		salesVelocity: 82,
		socialMomentum: 78,
		adLibraryCount: 55,
		shopifyStoreCount: 140,
		amazonSellerCount: 110,
	},
	{
		name: "Collapsible Water Bottle",
		description: "BPA-free silicone collapsible water bottle, perfect for travel and outdoor activities.",
		category: "Sports & Outdoors",
		sourceUrl: "https://example.com/water-bottle",
		imageUrls: ["https://picsum.photos/seed/bottle1/400/400", "https://picsum.photos/seed/bottle2/400/400"],
		costPrice: 4.50,
		suggestedRetailPrice: 22.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/bottle",
		weight: 0.2,
		googleTrendsGrowth: 75,
		salesVelocity: 68,
		socialMomentum: 72,
		adLibraryCount: 42,
		shopifyStoreCount: 110,
		amazonSellerCount: 95,
	},
	{
		name: "Ring Light with Tripod Stand",
		description: "10 inch LED ring light with phone holder and adjustable tripod for streaming and selfies.",
		category: "Electronics",
		sourceUrl: "https://example.com/ring-light",
		imageUrls: ["https://picsum.photos/seed/ring1/400/400", "https://picsum.photos/seed/ring2/400/400"],
		costPrice: 11.99,
		suggestedRetailPrice: 44.99,
		supplierName: "CJ Dropshipping",
		supplierUrl: "https://cjdropshipping.com/item/ring-light",
		weight: 1.2,
		googleTrendsGrowth: 68,
		salesVelocity: 85,
		socialMomentum: 92,
		adLibraryCount: 120,
		shopifyStoreCount: 280,
		amazonSellerCount: 220,
	},
	{
		name: "Resistance Bands Set",
		description: "5-piece resistance bands set with different resistance levels for home workouts.",
		category: "Sports & Outdoors",
		sourceUrl: "https://example.com/resistance-bands",
		imageUrls: ["https://picsum.photos/seed/bands1/400/400", "https://picsum.photos/seed/bands2/400/400"],
		costPrice: 6.99,
		suggestedRetailPrice: 29.99,
		supplierName: "AliExpress",
		supplierUrl: "https://aliexpress.com/item/bands",
		weight: 0.4,
		googleTrendsGrowth: 72,
		salesVelocity: 78,
		socialMomentum: 80,
		adLibraryCount: 85,
		shopifyStoreCount: 200,
		amazonSellerCount: 165,
	},
];

function calculateTrendScore(product: typeof SAMPLE_PRODUCTS[0]): number {
	const googleTrendsGrowth = Math.min(100, Math.max(0, product.googleTrendsGrowth));
	const salesVelocity = Math.min(100, Math.max(0, product.salesVelocity));
	const socialMomentum = Math.min(100, Math.max(0, product.socialMomentum));
	
	return Math.round(
		googleTrendsGrowth * 0.4 + salesVelocity * 0.3 + socialMomentum * 0.3
	);
}

function calculateCompetitionScore(product: typeof SAMPLE_PRODUCTS[0]): number {
	const adLibrarySaturation = Math.min(100, (product.adLibraryCount / 200) * 100);
	const shopifySaturation = Math.min(100, (product.shopifyStoreCount / 500) * 100);
	const amazonSaturation = Math.min(100, (product.amazonSellerCount / 400) * 100);
	
	return Math.round(
		100 - (adLibrarySaturation * 0.4 + shopifySaturation * 0.3 + amazonSaturation * 0.3)
	);
}

function calculateMarginScore(product: typeof SAMPLE_PRODUCTS[0]): number {
	const estimatedShipping = product.weight * 5;
	const grossMarginPercent =
		((product.suggestedRetailPrice - product.costPrice - estimatedShipping) /
			product.suggestedRetailPrice) *
		100;
	
	return Math.round(Math.min(100, Math.max(0, (grossMarginPercent - 30) * 2.5)));
}

function calculateOverallScore(
	trendScore: number,
	competitionScore: number,
	marginScore: number
): number {
	return Math.round(
		trendScore * 0.35 + competitionScore * 0.3 + marginScore * 0.35
	);
}

async function main() {
	console.log("Starting seed...");

	for (const productData of SAMPLE_PRODUCTS) {
		const trendScore = calculateTrendScore(productData);
		const competitionScore = calculateCompetitionScore(productData);
		const marginScore = calculateMarginScore(productData);
		const overallScore = calculateOverallScore(trendScore, competitionScore, marginScore);

		const product = await prisma.product.create({
			data: {
				name: productData.name,
				description: productData.description,
				category: productData.category,
				sourceUrl: productData.sourceUrl,
				imageUrls: productData.imageUrls,
				costPrice: productData.costPrice,
				suggestedRetailPrice: productData.suggestedRetailPrice,
				supplierName: productData.supplierName,
				supplierUrl: productData.supplierUrl,
				weight: productData.weight,
				trendScore,
				competitionScore,
				marginScore,
				overallScore,
				googleTrendsGrowth: productData.googleTrendsGrowth,
				salesVelocity: productData.salesVelocity,
				socialMomentum: productData.socialMomentum,
				adLibraryCount: productData.adLibraryCount,
				shopifyStoreCount: productData.shopifyStoreCount,
				amazonSellerCount: productData.amazonSellerCount,
			},
		});

		console.log(`Created product: ${product.name} (Overall Score: ${overallScore})`);

		const today = new Date();
		for (let i = 30; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			
			const variation = (Math.random() - 0.5) * 10;
			const historicalTrend = Math.max(0, Math.min(100, trendScore + variation));
			const historicalCompetition = Math.max(0, Math.min(100, competitionScore + variation * 0.5));
			const historicalMargin = Math.max(0, Math.min(100, marginScore + variation * 0.3));
			const historicalOverall = calculateOverallScore(
				historicalTrend,
				historicalCompetition,
				historicalMargin
			);

			await prisma.productScore.create({
				data: {
					productId: product.id,
					trendScore: Math.round(historicalTrend),
					competitionScore: Math.round(historicalCompetition),
					marginScore: Math.round(historicalMargin),
					overallScore: Math.round(historicalOverall),
					recordedAt: date,
				},
			});
		}

		console.log(`Created 31 days of score history for: ${product.name}`);

		if (overallScore >= 60) {
			const headlines = [
				`Transform Your Life with ${product.name}`,
				`Why Everyone's Talking About ${product.name}`,
				`The ${product.name} You've Been Waiting For`,
			];

			const primaryTexts = [
				`Discover why thousands are switching to ${product.name}. ${product.description}`,
				`Stop settling for less. ${product.name} delivers premium quality at an unbeatable price.`,
				`Join the revolution. ${product.name} is changing the game for ${product.category.toLowerCase()} enthusiasts.`,
			];

			const descriptions = [
				"Free shipping on orders over $25",
				"30-day money-back guarantee",
				"Limited time offer - Order now!",
			];

			await prisma.adCreative.create({
				data: {
					productId: product.id,
					type: "AD_COPY",
					content: JSON.stringify({
						headlines,
						primaryTexts,
						descriptions,
					}),
				},
			});

			const videoScripts = [
				{
					type: "UGC_TESTIMONIAL",
					duration: "15s",
					script: `[Hook - 0-3s] "I can't believe I waited so long to try this!"
[Problem - 3-7s] "I used to struggle with ${product.category.toLowerCase()} products that just didn't work."
[Solution - 7-12s] "Then I found ${product.name} and everything changed."
[CTA - 12-15s] "Link in bio - you won't regret it!"`,
				},
				{
					type: "PROBLEM_SOLUTION",
					duration: "30s",
					script: `[Problem Setup - 0-8s] "Are you tired of ${product.category.toLowerCase()} products that don't deliver?"
[Agitate - 8-15s] "You've tried everything, spent hundreds, and still nothing works."
[Solution Intro - 15-22s] "Introducing ${product.name} - the solution you've been searching for."
[Benefits - 22-27s] "${product.description}"
[CTA - 27-30s] "Order now and get free shipping!"`,
				},
			];

			await prisma.adCreative.create({
				data: {
					productId: product.id,
					type: "VIDEO_SCRIPT",
					content: JSON.stringify(videoScripts),
				},
			});

			console.log(`Created ad creatives for: ${product.name}`);
		}
	}

	console.log("Seed completed successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
