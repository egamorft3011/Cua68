// PageConfig.interface.ts

export interface IBannerImg {
  image_url: string;
  permalink: string;
}

export interface INotification {
  isShow: string;
  title: string;
  description: string;
  content: string;
}

export interface IContact {
  telegram: string;
  fanpage: string;
  hotline: string;
  email: string;
}

export interface PageConfig {
  site_name: string;
  site_logo: string;
  site_banner: IBannerImg[];
  site_brand_marquee: string;
  announcement: INotification;
  copyright: string;
  contact: IContact;
  site_description: string;
  site_keyword: string;
  site_url: string;
  banner_favorite?: string;
  banner_sports?: string;
  banner_live?: string;
  banner_slot?: string;
  banner_elotto?: string;
  banner_chicken?: string;
  banner_pvp?: string;
}

export interface Banner {
  image_url: string;
  permalink: string;
}

export interface Announcement {
  isShow: string;
  title: string;
  description: string;
  content: string;
}

export interface Contact {
  telegram: string;
  fanpage: string;
  hotline: string;
  email: string;
}