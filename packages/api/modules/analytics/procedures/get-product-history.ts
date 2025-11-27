import { getProductById, getProductScoreHistory } from "@repo/database";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const getProductHistory = protectedProcedure
	.route({
		method: "GET",
		path: "/analytics/product/{id}/history",
		tags: ["Analytics"],
		summary: "Get product score history",
		description: "Get historical score data for a product over the past 30 days",
	})
	.input(
		z.object({
			id: z.string(),
			days: z.number().min(1).max(90).default(30),
		}),
	)
	.handler(async ({ input }) => {
		const product = await getProductById(input.id);

		if (!product) {
			throw new ORPCError("NOT_FOUND", { message: "Product not found" });
		}

		const scoreHistory = await getProductScoreHistory(input.id, input.days);

		return { scoreHistory };
	});
