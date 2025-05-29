import { contentInstance } from "@/configs/CustomizeAxios";

const getListGameAvalible = () => {
  return contentInstance.get(`/api/game/gameAvalible`);
};

const getPlayGameById = (code: string, id: string) => {
  let url = `/api/game/launchgame/${id}?code=${code}`;
  
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    url += '&platform=mobile';
  }

  return contentInstance.get(url);
};

const getListGameFish = () => {
  return contentInstance.get(`/api/product/fish`);
};

const getListGame = (productType: string, gameType: string) => {
  return contentInstance.get(`/api/product/${productType}/${gameType}`);
};

interface data {
  username: string;
  portfolio: string;
  gpid: string;
  lang: string;
  gameId: string;
  device: string;
}

export { getListGameAvalible, getPlayGameById, getListGameFish, getListGame };
