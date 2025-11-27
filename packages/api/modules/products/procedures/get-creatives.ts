import { getProductById, getAdCreativesByProductId } from "@repo/database";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const getCreatives = protectedProcedure
	.route({
		method: "GET",
		path: "/products/{id}/creatives",
		tags: ["Products"],
		summary: "Get product creatives",
		description: "Get all generated ad creatives for a product",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		const product = await getProductById(input.id);

		if (!product) {
			throw new ORPCError("NOT_FOUND", { message: "Product not found" });
		}

		const creatives = await getAdCreativesByProductId(input.id);

		return { creatives };
	});
