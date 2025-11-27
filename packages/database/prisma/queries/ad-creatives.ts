import { db } from "../client";
import type { AdCreativeType, AdPlatform } from "../generated";

export async function getAdCreativesByProductId(productId: string) {
	return db.adCreative.findMany({
		where: { productId },
		orderBy: { generatedAt: "desc" },
	});
}

export async function getAdCreativeById(id: string) {
	return db.adCreative.findUnique({
		where: { id },
		include: {
			product: true,
		},
	});
}

export async function createAdCreative(data: {
	productId: string;
	type: AdCreativeType;
	platform: AdPlatform;
	headline?: string;
	primaryText?: string;
	description?: string;
	callToAction?: string;
	imageUrl?: string;
	videoScriptUrl?: string;
	thumbnailUrl?: string;
}) {
	return db.adCreative.create({
		data,
	});
}

export async function createManyAdCreatives(
	creatives: Array<{
		productId: string;
		type: AdCreativeType;
		platform: AdPlatform;
		headline?: string;
		primaryText?: string;
		description?: string;
		callToAction?: string;
		imageUrl?: string;
		videoScriptUrl?: string;
		thumbnailUrl?: string;
	}>,
) {
	return db.adCreative.createMany({
		data: creatives,
	});
}

export async function deleteAdCreativesByProductId(productId: string) {
	return db.adCreative.deleteMany({
		where: { productId },
	});
}

export async function getAdCreativesByType(productId: string, type: AdCreativeType) {
	return db.adCreative.findMany({
		where: {
			productId,
			type,
		},
		orderBy: { generatedAt: "desc" },
	});
}

export async function getAdCreativesByPlatform(productId: string, platform: AdPlatform) {
	return db.adCreative.findMany({
		where: {
			productId,
			platform,
		},
		orderBy: { generatedAt: "desc" },
	});
}
