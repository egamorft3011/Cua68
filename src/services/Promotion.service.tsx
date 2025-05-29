import { contentInstance } from "@/configs/CustomizeAxios";

// Lấy tất cả chương trình khuyến mãi
const getAllPromotion = () => {
  return contentInstance.get(`/api/promotion`);
};

//Lấy tất cả chương trình khuyến mãi theo khách hàng
const getPromotionByUser = (id: string) => {
  return contentInstance.get(`/api/promotion/promotion-info/${id}`);
};
export { getPromotionByUser, getAllPromotion };
