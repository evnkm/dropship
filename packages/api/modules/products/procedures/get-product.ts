import { getProductById } from "@repo/database";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const getProduct = protectedProcedure
	.route({
		method: "GET",
		path: "/products/{id}",
		tags: ["Products"],
		summary: "Get product details",
		description: "Get full product details including scores, trend data, and ad creatives",
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

		return { product };
	});
