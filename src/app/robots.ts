import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // This applies to Google, Bing, Yahoo, etc.
      allow: '/', // Allows them to scan your home page, shop, and products
      disallow: [
        '/checkout',       // Keep private checkout data hidden
        '/order-success',  // Hide customer receipts
        '/cart',           // Hide empty cart states
        '/api/',           // Hide your backend routes
        '/admin/',         // Keep your admin dashboard completely invisible
      ],
    },
    // Points search engines directly to the dynamic sitemap we built earlier
    sitemap: 'https://traayatrends.com/sitemap.xml',
  };
}