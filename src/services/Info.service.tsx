import { contentInstance } from "@/configs/CustomizeAxios";

const pageInfo = () => {
  return contentInstance.get("/api/config/info");
};

export {
  pageInfo
};
