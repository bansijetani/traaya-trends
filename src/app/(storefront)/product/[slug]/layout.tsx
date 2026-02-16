import { Metadata } from "next";
import { createClient } from "next-sanity";

export const revalidate = 3600;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  useCdn: true, 
});

// 👇 1. UPDATE THE PROPS TO EXPECT A PROMISE (Next.js 15 requirement)
type Props = {
  params: Promise<{ slug: string }>;
};
// Notice there is NO "use client" here. This runs securely on the server!
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const resolvedParams = await params;
    const currentSlug = resolvedParams.slug;

  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      name, description, "imageUrl": images[0].asset->url
    }`,
    { slug: currentSlug }
  );

  if (!product) {
    return { title: "Product Not Found | Traaya Trends" };
  }

  return {
    title: product.name, 
    description: product.description?.substring(0, 160), 
    alternates: {
      canonical: `/product/${currentSlug}`, // This dynamically creates the perfect, clean URL
    },
    openGraph: {
      title: `${product.name} | Traaya Trends`,
      description: product.description,
      images: [{ url: product.imageUrl, width: 800, height: 800, alt: product.name }],
    },
  };
}

// This layout simply wraps your page.tsx client component
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}