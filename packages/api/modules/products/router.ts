import { listProducts } from "./procedures/list-products";
import { getProduct } from "./procedures/get-product";
import { saveProductProcedure, unsaveProductProcedure } from "./procedures/save-product";
import { getCreatives } from "./procedures/get-creatives";
import { listSavedProducts } from "./procedures/list-saved-products";
import { getDashboardStats } from "./procedures/get-dashboard-stats";
import { getCategoriesProcedure } from "./procedures/get-categories";

export const productsRouter = {
	list: listProducts,
	get: getProduct,
	save: saveProductProcedure,
	unsave: unsaveProductProcedure,
	creatives: getCreatives,
	saved: listSavedProducts,
	dashboardStats: getDashboardStats,
	categories: getCategoriesProcedure,
};
