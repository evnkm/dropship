import {
	getNewProductsToday,
	getAverageScore,
	getTopCategory,
	getHotProducts,
} from "@repo/database";
import { protectedProcedure } from "../../../orpc/procedures";

export const getDashboardStats = protectedProcedure
	.route({
		method: "GET",
		path: "/products/dashboard-stats",
		tags: ["Products"],
		summary: "Get dashboard stats",
		description: "Get summary statistics for the dashboard including new products, average score, and top category",
	})
	.handler(async () => {
		const [newProductsToday, averageScore, topCategory, hotProducts] = await Promise.all([
			getNewProductsToday(),
			getAverageScore(),
			getTopCategory(),
			getHotProducts(6),
		]);

		return {
			newProductsToday,
			averageScore: Math.round(averageScore),
			topCategory,
			hotProducts,
		};
	});
