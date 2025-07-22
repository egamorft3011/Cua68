import { useState, useEffect } from 'react';
import { PageConfig } from '@/interface/PageConfig.interface';
import { pageInfo } from '@/services/Info.service';

const defaultConfig: PageConfig = {
  site_name: "",
  site_logo: "",
  site_banner: [],
  site_brand_marquee: "",
  announcement: { isShow: "", title: "", description: "", content: "" },
  copyright: "",
  contact: { telegram: "", fanpage: "", hotline: "", email: "" },
  site_description: "",
  site_keyword: "",
  site_url: "",
  // Add the new banner properties from the API response
  banner_favorite: "",
  banner_sports: "",
  banner_live: "",
  banner_slot: "",
  banner_elotto: "",
  banner_chicken: "",
  banner_pvp: "",
};

export const usePageConfig = (initialConfig?: PageConfig) => {
  const [pageConfig, setPageConfig] = useState<PageConfig>(initialConfig || defaultConfig);
  const [loading, setLoading] = useState(!initialConfig);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageConfig = async () => {
      if (initialConfig) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await pageInfo();
        
        // Check if response has the expected structure
        if (response?.status && response?.data) {
          // Map the API response to match the PageConfig interface
          const configData: PageConfig = {
            site_name: response.data.site_name || "",
            site_logo: response.data.site_logo || "",
            site_banner: response.data.site_banner || [],
            site_brand_marquee: response.data.site_brand_marquee || "",
            announcement: {
              isShow: response.data.announcement?.isShow || "",
              title: response.data.announcement?.title || "",
              description: response.data.announcement?.description || "",
              content: response.data.announcement?.content || ""
            },
            copyright: response.data.copyright || "",
            contact: {
              telegram: response.data.contact?.telegram || "",
              fanpage: response.data.contact?.fanpage || "",
              hotline: response.data.contact?.hotline || "",
              email: response.data.contact?.email || ""
            },
            site_description: response.data.site_description || "",
            site_keyword: response.data.site_keyword || "",
            site_url: response.data.site_url || "",
            // Include the new banner properties
            banner_favorite: response.data.banner_favorite || "",
            banner_sports: response.data.banner_sports || "",
            banner_live: response.data.banner_live || "",
            banner_slot: response.data.banner_slot || "",
            banner_elotto: response.data.banner_elotto || "",
            banner_chicken: response.data.banner_chicken || "",
            banner_pvp: response.data.banner_pvp || "",
          };
          
          setPageConfig(configData);
        } else {
          console.warn("API response doesn't have expected structure:", response);
          setPageConfig(defaultConfig);
        }
      } catch (err) {
        console.error("Error fetching page config:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch page config');
        setPageConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchPageConfig();
  }, [initialConfig]);

  return { pageConfig, loading, error };
};