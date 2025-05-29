
export interface IStatistical {
  user_count: number
  banner_count: number
  support_count: number
  noti_count: number
  money_count: number
}

export interface IResponse {
  message: string
  status: number
  success: boolean
  data: any
}

export interface INotification {
  id: string
  title?: string
  describe?: string
  url_img: string
  status: string
  created_at: string
  updated_at: string
}

export interface ISupport {
  id: string
  link?: string
  phone?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ICheckout {
  id: string
  id_user: string
  money: number
  describe: string
  status: string
  created_at: string
  updated_at: string
}

export interface IWallet {
  id: string
  user_id: string
  money: number
  created_at: string
  updated_at: string
}

export interface IUser {
  id: string
  phone: string
  name: string
  email: string
  role?: string
  ip_api?: string
  password: string
  username: string
  code?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface IProfile {
  avatar: string
  name: string
  email: string
}
export interface IBannerImg {
  id: string
  url_img: string
  created_at: string
  updated_at: string
}


export interface IClientStoreSide {
  getStore(key: string): any;
  setStore<T>(key: string, value: T, options?: { expires: number }): void;
}

// export interface getListUserBank {

// } 