import { getTrends } from "./procedures/get-trends";
import { getProductHistory } from "./procedures/get-product-history";

export const analyticsRouter = {
	trends: getTrends,
	productHistory: getProductHistory,
};
