import { getSavedProductsByUserId } from "@repo/database";
import { protectedProcedure } from "../../../orpc/procedures";

export const listSavedProducts = protectedProcedure
	.route({
		method: "GET",
		path: "/products/saved",
		tags: ["Products"],
		summary: "List saved products",
		description: "Get all products saved by the current user",
	})
	.handler(async ({ context: { user } }) => {
		const savedProducts = await getSavedProductsByUserId(user.id);

		return { savedProducts };
	});
