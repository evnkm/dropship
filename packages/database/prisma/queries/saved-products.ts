import { db } from "../client";

export async function getSavedProductsByUserId(userId: string) {
	return db.savedProduct.findMany({
		where: { userId },
		orderBy: { savedAt: "desc" },
		include: {
			product: {
				include: {
					adCreatives: {
						take: 1,
					},
				},
			},
		},
	});
}

export async function getSavedProduct(userId: string, productId: string) {
	return db.savedProduct.findUnique({
		where: {
			userId_productId: {
				userId,
				productId,
			},
		},
		include: {
			product: true,
		},
	});
}

export async function saveProduct(userId: string, productId: string, notes?: string) {
	return db.savedProduct.create({
		data: {
			userId,
			productId,
			notes,
		},
		include: {
			product: true,
		},
	});
}

export async function unsaveProduct(userId: string, productId: string) {
	return db.savedProduct.delete({
		where: {
			userId_productId: {
				userId,
				productId,
			},
		},
	});
}

export async function updateSavedProductNotes(
	userId: string,
	productId: string,
	notes: string,
) {
	return db.savedProduct.update({
		where: {
			userId_productId: {
				userId,
				productId,
			},
		},
		data: { notes },
	});
}

export async function isProductSaved(userId: string, productId: string) {
	const saved = await db.savedProduct.findUnique({
		where: {
			userId_productId: {
				userId,
				productId,
			},
		},
	});
	return !!saved;
}

export async function getSavedProductCount(userId: string) {
	return db.savedProduct.count({
		where: { userId },
	});
}
