import { MetadataRoute } from 'next';
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  useCdn: true,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://traaya-trends.vercel.app"; // Update to your custom domain later!

  // 1. Fetch all product slugs and their last updated dates from Sanity
  const products = await client.fetch(
    `*[_type == "product"]{
      "slug": slug.current,
      _updatedAt
    }`
  );

  // 2. Map the Sanity products into the exact format Google requires
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product._updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8, // Products get high priority
  }));

  // 3. Define your static routes
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 4. Combine them and hand them to Google!
  return [...staticRoutes, ...productUrls];
}