import { getProductById, getSavedProduct, saveProduct, unsaveProduct } from "@repo/database";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const saveProductProcedure = protectedProcedure
	.route({
		method: "POST",
		path: "/products/{id}/save",
		tags: ["Products"],
		summary: "Save product",
		description: "Save a product to user's collection for later reference",
	})
	.input(
		z.object({
			id: z.string(),
			notes: z.string().optional(),
		}),
	)
	.handler(async ({ input, context: { user } }) => {
		const product = await getProductById(input.id);

		if (!product) {
			throw new ORPCError("NOT_FOUND", { message: "Product not found" });
		}

		const existing = await getSavedProduct(user.id, input.id);

		if (existing) {
			throw new ORPCError("BAD_REQUEST", { message: "Product already saved" });
		}

		const savedProduct = await saveProduct(user.id, input.id, input.notes);

		return { success: true, savedProduct };
	});

export const unsaveProductProcedure = protectedProcedure
	.route({
		method: "DELETE",
		path: "/products/{id}/save",
		tags: ["Products"],
		summary: "Unsave product",
		description: "Remove a product from user's saved collection",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input, context: { user } }) => {
		const existing = await getSavedProduct(user.id, input.id);

		if (!existing) {
			throw new ORPCError("NOT_FOUND", { message: "Product not in saved collection" });
		}

		await unsaveProduct(user.id, input.id);

		return { success: true };
	});
