import { getProducts } from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const listProducts = protectedProcedure
	.route({
		method: "GET",
		path: "/products",
		tags: ["Products"],
		summary: "List products",
		description: "Get a paginated list of products with filtering and sorting options",
	})
	.input(
		z.object({
			page: z.number().min(1).default(1),
			limit: z.number().min(1).max(100).default(20),
			category: z.string().optional(),
			minScore: z.number().min(0).max(100).default(0),
			sortBy: z
				.enum([
					"overallScore",
					"trendScore",
					"competitionScore",
					"marginScore",
					"firstSeenAt",
				])
				.default("overallScore"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
		}),
	)
	.handler(async ({ input }) => {
		const result = await getProducts({
			page: input.page,
			limit: input.limit,
			category: input.category,
			minScore: input.minScore,
			sortBy: input.sortBy,
			sortOrder: input.sortOrder,
		});

		return result;
	});
