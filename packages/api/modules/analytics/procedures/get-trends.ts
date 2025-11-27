import {
	getTrendingCategories,
	getTopMovers,
	getNewEntries,
} from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";

export const getTrends = protectedProcedure
	.route({
		method: "GET",
		path: "/analytics/trends",
		tags: ["Analytics"],
		summary: "Get trends",
		description: "Get trending categories, top movers, and new entries",
	})
	.input(
		z.object({
			category: z.string().optional(),
			timeRange: z.enum(["7d", "30d", "90d"]).default("30d"),
		}),
	)
	.handler(async ({ input }) => {
		const [trendingCategories, topMovers, newEntries] = await Promise.all([
			getTrendingCategories(input.timeRange),
			getTopMovers(10),
			getNewEntries(10),
		]);

		return {
			trendingCategories,
			topMovers,
			newEntries,
		};
	});
