export interface PageConfig {
  site_name: string;
  site_logo: string;
  site_banner: Banner[];
  site_brand_marquee: string;
  announcement: Announcement;
  copyright: string;
  contact: Contact;
  site_description: string;
  site_keyword: string;
  site_url: string;
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