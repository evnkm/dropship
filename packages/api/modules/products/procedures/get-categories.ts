import { getCategories } from "@repo/database";
import { protectedProcedure } from "../../../orpc/procedures";

export const getCategoriesProcedure = protectedProcedure
	.route({
		method: "GET",
		path: "/products/categories",
		tags: ["Products"],
		summary: "Get product categories",
		description: "Get all product categories with counts",
	})
	.handler(async () => {
		const categories = await getCategories();

		return { categories };
	});
