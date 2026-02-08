import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Grid3X3, ArrowDown } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton"; 
import HeroSlider from "@/components/HeroSlider";

// --- DATA FETCHING ---
async function getHeroProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc)[0...5] {
    _id, name, price, "slug": slug.current,
    "image": coalesce(image.asset->url, images[0].asset->url)
  }`;
  return await client.fetch(query);
}

// 👇 NEW: Fetch Categories from Sanity
async function getCategories() {
  const query = `*[_type == "category" && !defined(parent)] | order(_createdAt desc)[0...5] {
    _id,
    name,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
}

async function getTrending() {
  const query = `*[_type == "product"] | order(price desc)[0...8] {
    _id, name, price, "slug": slug.current,
    "image": coalesce(image.asset->url, images[0].asset->url)
  }`;
  return await client.fetch(query);
}

async function getSpotlight() {
  const query = `*[_type == "product"][5...8] {
    _id, name, price, "slug": slug.current,
    "image": coalesce(image.asset->url, images[0].asset->url)
  }`;
  return await client.fetch(query);
}

async function getBestSellers() {
  const query = `*[_type == "product"] | order(price desc)[0...4] {
    _id, name, price, "slug": slug.current,
    "image": coalesce(image.asset->url, images[0].asset->url)
  }`;
  return await client.fetch(query);
}

async function getMainCatalog() {
  const query = `*[_type == "product"] | order(_createdAt asc)[0...12] {
    _id, name, price, "slug": slug.current,
    "image": coalesce(image.asset->url, images[0].asset->url)
  }`;
  return await client.fetch(query);
}

export default async function Home() {
  const heroProducts = await getHeroProducts();
  const trending = await getTrending();
  const spotlight = await getSpotlight();
  const bestSellers = await getBestSellers();
  const catalog = await getMainCatalog();

  const categories = await getCategories();

  return (
    <>
      {/* Main BG: Uses 'bg-page' (Admin Background Color) */}
      <main className="min-h-screen bg-page">
        
        {/* ================= HERO BANNER SLIDER ================= */}
        <HeroSlider />

         {/* 2. OUR STORY SECTION */}
         <section className="bg-white py-16 md:py-24 px-4 sm:px-6">
            <div className="max-w-[1400px] mx-auto">
            
            {/* Content Container */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-32 mb-20 md:mb-28">
                  
                  {/* Circular Badge */}
                  <div className="flex-shrink-0 relative group animate-in fade-in slide-in-from-bottom-8 duration-1000">
                     <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-secondary flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:scale-105 bg-white">
                        <span className="font-serif text-3xl md:text-4xl text-secondary mb-1">TRAAYA</span>
                        <span className="font-serif italic text-secondary text-lg md:text-2xl">Trends</span>
                     </div>
                  </div>

                  {/* Text Content */}
                  <div className="max-w-2xl text-center md:text-left animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                     <p className="font-sans text-xl md:text-3xl md:leading-[1.4] text-primary mb-10 font-light">
                        We believe jewelry is more than an accessory—it’s a story of individuality and style. Our curated collection blends timeless craftsmanship with modern design, creating pieces that empower <span className="text-primary/40">you to express your unique elegance every day.</span>
                     </p>
                     
                     <Link href="/about" className="group inline-flex items-center gap-3 text-secondary text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors">
                        Our Story
                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                     </Link>
                  </div>
            </div>

            <div className="w-full h-px bg-secondary opacity-30"></div>

            </div>
         </section>

        {/* ================= CATEGORY HIGHLIGHTS ================= */}
        <section className="pt-0 pb-16 md:pb-24 max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl text-primary">Shop by Category</h2>
                <div className="w-20 h-0.5 bg-secondary mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((cat: any) => (
                    <Link 
                        key={cat._id} 
                        href={`/shop?category=${cat.slug}`} 
                        className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block rounded-sm shadow-sm"
                    >
                        {/* 1. PRODUCT IMAGE */}
                        {cat.imageUrl ? (
                            <Image 
                                src={cat.imageUrl} 
                                alt={cat.name || "Category"} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                        )}

                        {/* 2. THE NEW UI: Full Width Bottom Bar */}
                        <div className="absolute bottom-0 left-0 w-full py-4 bg-white/60 backdrop-blur-md border-t border-white/50 transition-colors duration-300 group-hover:bg-white/90">
                            <h3 className="text-center font-serif text-primary text-xs font-bold uppercase tracking-[0.2em]">
                                {cat.name}
                            </h3>
                        </div>

                    </Link>
                ))}

                <Link href="/shop" className="group relative aspect-[3/4] overflow-hidden bg-primary flex flex-col items-center justify-center text-white text-center border border-transparent hover:border-secondary transition-all rounded-sm">
                    <div className="p-6">
                        <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-2 block">Discover More</span>
                        <h3 className="font-serif text-2xl mb-6">View All <br/> Categories</h3>
                        <div className="w-10 h-10 rounded-full border border-secondary/50 flex items-center justify-center mx-auto group-hover:bg-secondary group-hover:text-white transition-colors">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </Link>
            </div>
        </section>


        {/* ================= ZONE 1: NEW ARRIVALS (UPDATED GRID) ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-0 pb-16 md:pb-24">
            <div className="text-center mb-16">
                <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2">
                    Fresh Drops
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-primary mt-3 mb-6">
                    New Arrivals
                </h2>
                <div className="w-20 h-[1px] bg-gray-200 mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-2 h-auto lg:h-[800px]">
                {heroProducts[0] && (
                    <div className="col-span-2 lg:col-span-2 lg:row-span-2 relative group bg-gray-50 overflow-hidden rounded-sm">
                        {/* 👆 ADDED 'col-span-2' above. This makes the FIRST product full-width on mobile. */}
                        
                        <Link href={`/product/${heroProducts[0].slug}`} className="block w-full h-full relative z-0">
                            {heroProducts[0].image && (
                                <Image 
                                    src={heroProducts[0].image} 
                                    alt={heroProducts[0].name || "Product Image"} 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/90 to-transparent p-8 text-primary translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-2 inline-block">New In</span>
                                <h2 className="font-serif text-3xl mb-1">{heroProducts[0].name}</h2>
                                <p className="font-bold text-lg mb-10 text-secondary">${heroProducts[0].price?.toLocaleString()}</p>
                            </div>
                        </Link>
                        <div className="absolute bottom-8 left-8 z-20 pointer-events-auto">
                           <AddToCartButton product={heroProducts[0]} styleType="minimal" />
                        </div>
                    </div>
                )}

                {/* These items will naturally take 1 column each, creating a 2-column grid below the first item */}
                {heroProducts.slice(1, 5).map((product: any) => (
                    <div key={product._id} className="relative group bg-white border border-gray-100 flex flex-col justify-between hover:border-secondary transition-colors shadow-sm hover:shadow-lg rounded-sm">
                         <Link href={`/product/${product.slug}`} className="block relative w-full aspect-square lg:h-full overflow-hidden">
                            {product.image && (
                                <Image 
                                    src={product.image} 
                                    alt={product.name || "Product"} 
                                    fill 
                                    className="object-contain p-4 md:p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                />
                            )}
                         </Link>
                         <div className="p-4 border-t border-gray-100 bg-white relative z-10">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <Link href={`/product/${product.slug}`}>
                                         <h3 className="font-serif text-sm text-primary hover:text-secondary hover:underline">{product.name}</h3>
                                     </Link>
                                     <p className="text-xs font-bold text-secondary mt-1">${product.price?.toLocaleString()}</p>
                                 </div>
                                <div className="flex-shrink-0">
                                    <AddToCartButton product={product} styleType="icon" />
                                </div>
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </section>


        {/* ================= ZONE 2: TRENDING ================= */}
        <section className="relative py-16 mb-24 overflow-hidden">
             <div className="absolute inset-0 bg-primary z-0"></div>
             
             <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 mb-10 flex justify-between items-end text-white">
                <h2 className="font-serif text-3xl">Trending Now</h2>
                <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-white transition-colors">See All</Link>
             </div>
             
             <div className="relative z-10 flex overflow-x-auto gap-6 px-4 sm:px-6 pb-8 no-scrollbar snap-x">
                 {trending.map((product: any) => (
                     <div key={product._id} className="min-w-[280px] md:min-w-[320px] snap-start group">
                         <div className="relative aspect-[3/4] bg-primary/50 mb-4 overflow-hidden border border-white/10 group-hover:border-secondary transition-colors rounded-sm shadow-xl">
                             <Link href={`/product/${product.slug}`}>
                                 {product.image && (
                                     <Image src={product.image} alt={product.name} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                 )}
                             </Link>
                             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                 <AddToCartButton product={product} styleType="icon" />
                             </div>
                         </div>
                         <h3 className="font-serif text-lg truncate text-white">{product.name}</h3>
                         <p className="text-secondary text-sm font-bold">${product.price?.toLocaleString()}</p>
                     </div>
                 ))}
             </div>
        </section>


        {/* ================= ZONE 3: SPOTLIGHT ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-0 pb-16 md:pb-24">
             <div className="text-center mb-16">
                <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em]">
                    Handpicked
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-primary mt-3 mb-6">
                    The Spotlight
                </h2>
                <div className="w-20 h-[1px] bg-gray-200 mx-auto"></div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {spotlight.map((product: any, idx: number) => (
                     <div key={product._id} className="group border border-gray-100 hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col bg-white rounded-sm">
                         
                         <div className="text-center p-6 pb-2">
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Exclusive 0{idx+1}</span>
                             <Link href={`/product/${product.slug}`}>
                                <h3 className="font-serif text-2xl mt-2 text-primary group-hover:text-secondary transition-colors">{product.name}</h3>
                             </Link>
                         </div>

                         <div className="relative aspect-square w-full overflow-hidden mt-4 bg-gray-50">
                             <Link href={`/product/${product.slug}`}>
                                 {product.image && (
                                     <Image 
                                         src={product.image} 
                                         alt={product.name} 
                                         fill 
                                         className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                     />
                                 )}
                             </Link>
                         </div>

                         <div className="flex flex-col gap-3 p-6 pt-4 mt-auto">
                             <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-4 text-primary">
                                 <span>Price</span>
                                 <span>${product.price?.toLocaleString()}</span>
                             </div>
                             <AddToCartButton product={product} styleType="full" />
                         </div>
                     </div>
                 ))}
             </div>
        </section>


        {/* ================= ZONE 4: BEST SELLERS ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-24">
             <div className="text-center mb-16">
                <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em]">Customer Favorites</span>
                <h2 className="font-serif text-4xl md:text-5xl text-primary mt-3 mb-6">Best Sellers</h2>
                <div className="w-20 h-[1px] bg-gray-200 mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                 {bestSellers.map((product: any) => (
                     <div key={product._id} className="group flex flex-col">
                         <div className="relative aspect-[4/5] bg-gray-50 mb-4 overflow-hidden border border-transparent group-hover:border-secondary transition-colors rounded-sm shadow-sm">
                             <Link href={`/product/${product.slug}`} className="block w-full h-full">
                                 {product.image && (
                                     <Image 
                                         src={product.image} 
                                         alt={product.name} 
                                         fill 
                                         className="object-cover transition-transform duration-700 group-hover:scale-105"
                                     />
                                 )}
                             </Link>
                             <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-lg">
                                 Best Seller
                             </div>
                             <div className="absolute bottom-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                                 <AddToCartButton product={product} styleType="icon" />
                             </div>
                         </div>
                         
                         <div className="text-center">
                             <Link href={`/product/${product.slug}`}>
                                <h3 className="font-serif text-lg text-primary mb-1 group-hover:text-secondary transition-colors">{product.name}</h3>
                             </Link>
                             <p className="text-sm font-bold text-secondary">${product.price?.toLocaleString()}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </section>


        {/* ================= ZONE 5: CATALOG ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-20">
             <div className="flex items-center gap-4 mb-10">
                 <Grid3X3 size={18} className="text-primary" />
                 <h2 className="font-serif text-2xl uppercase tracking-wide text-primary">Full Catalog</h2>
                 <div className="h-px bg-gray-200 flex-1" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12">
                 {catalog.map((product: any) => (
                     <div key={product._id} className="group">
                         <div className="relative aspect-[4/5] bg-gray-50 mb-3 overflow-hidden rounded-sm">
                             <Link href={`/product/${product.slug}`}>
                                 {product.image && <Image src={product.image} alt={product.name} fill className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />}
                             </Link>
                             <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                                 <AddToCartButton product={product} styleType="full" />
                             </div>
                         </div>
                         <div>
                             <Link href={`/product/${product.slug}`}><h3 className="font-serif text-sm truncate text-primary hover:text-secondary transition-colors">{product.name}</h3></Link>
                             <p className="text-xs font-bold text-secondary mt-1">${product.price?.toLocaleString()}</p>
                         </div>
                     </div>
                 ))}
             </div>
             <div className="mt-20 text-center">
                 <Link href="/shop" className="inline-block border border-primary text-primary px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
                     Load More Products
                 </Link>
             </div>
        </section>

      </main>
    </>
  );
}