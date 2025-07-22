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
        if (response.status) {
          setPageConfig(response.data);
        } else {
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