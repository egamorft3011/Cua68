import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrimaryLayoutComponent from "@/components/PrimaryLayout/PrimaryLayout.component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-multi-carousel/lib/styles.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { pageInfo } from "@/services/Info.service";
import { PageConfig } from "@/interface/PageConfig.interface";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

async function getPageConfig(): Promise<PageConfig> {
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

  try {
    const response = await pageInfo();
    if (response.status) {
      return response.data;
    }
    return defaultConfig;
  } catch (error) {
    console.error("Error fetching page config:", error);
    return defaultConfig;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const pageConfig = await getPageConfig();

  return {
    title: pageConfig.site_name || "",
    description: pageConfig.site_description || "",
    icons: {
      icon: pageConfig.site_logo || "",
    },
    keywords: pageConfig.site_keyword || "",
    openGraph: {
      title: pageConfig.site_name || "",
      description: pageConfig.site_description || "",
      url: pageConfig.site_url || "",
      images: [
        {
          url: pageConfig.site_logo || "",
          alt: pageConfig.site_name || "",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageConfig = await getPageConfig();

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <PrimaryLayoutComponent pageConfig={pageConfig}>
          {children}
          <SpeedInsights />
          <Analytics />
        </PrimaryLayoutComponent>
        <ToastContainer />
        {/* Thêm script bằng next/script */}
        <script type="text/javascript">
          (function(w, d, s, u) {
            w.id = 2; w.lang = ''; w.cName = ''; w.cEmail = ''; w.cMessage = ''; w.lcjUrl = u;
            var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
            j.async = true; j.src = 'https://choi88.online/js/jaklcpchat.js';
            h.parentNode.insertBefore(j, h);
          })(window, document, 'script', 'https://choi88.online/');
        </script>
        <div id="jaklcp-chat-container"></div>
      </body>
    </html>
  );
}
