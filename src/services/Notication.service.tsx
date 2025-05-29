import { contentInstance } from "@/configs/CustomizeAxios";

// Hộp thư đến
const getMessageByUser = () => {
  return contentInstance.get(`/api/message`);
};

// Hộp thư tin nhắn khuyến mãi theo user
const getMessagePromotionByUser = () => {
  return contentInstance.get(`/api/annoucement`);
};

export { getMessageByUser, getMessagePromotionByUser };
