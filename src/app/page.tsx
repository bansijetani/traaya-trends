import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Grid3X3, ArrowDown } from "lucide-react";
import Navbar from "@/app/components/Navbar"; 
import Footer from "@/app/components/Footer";
import AddToCartButton from "@/components/AddToCartButton"; 

// --- DATA FETCHING ---
async function getHeroProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc)[0...5] {
    _id, name, price, "slug": slug.current,
    "image": coalesce(image.asset->url, images[0].asset->url)
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

  const categories = [
    { name: "Rings", slug: "ring", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800" },
    { name: "Necklaces", slug: "necklace", image: "https://images.unsplash.com/photo-1599643477877-5313557d8302?q=80&w=800" },
    { name: "Earrings", slug: "earring", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800" },
    { name: "Bracelets", slug: "bracelet", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800" },
    { name: "Bridal Sets", slug: "bridal", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800" },
  ];

  return (
    <>
      <Navbar />

      {/* Main BG: Gradient Fusion (Silver -> Warm Beige Mist -> Silver) */}
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F4F6F8] via-[#FDFBF7] to-[#F0F2F5]">
        
        {/* ================= HERO BANNER ================= */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/images/banner.avif" 
                    alt="Luxury Jewelry Background" 
                    fill 
                    className="object-cover"
                    priority
                />
                {/* Overlay: Gradient from Midnight Blue to Transparent to blend */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#020C1B]/80 via-[#051525]/100 to-[#020C1B]/100 mix-blend-multiply" />
            </div>

            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-20">
                {/* Metallic Beige Gradient Text */}
                <p className="bg-gradient-to-r from-[#C5A075] via-[#E8D4B9] to-[#C5A075] bg-clip-text text-transparent text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Est. 2024 • Luxury Redefined
                </p>
                <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                    Timeless <br/> 
                    {/* Italic text with a 'Gold/Silver' Liquid Gradient */}
                    <span className="italic font-light bg-gradient-to-r from-[#D4B996] via-[#F3F5F7] to-[#D4B996] bg-clip-text text-transparent">
                        Elegance
                    </span>
                </h1>
                <p className="text-[#E0E6ED] text-base md:text-lg max-w-xl mx-auto mb-12 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    Discover a world where craftsmanship meets sophistication. Every piece tells a story of beauty, passion, and perfection.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    {/* Button with Beige Gradient */}
                    <Link href="/shop" className="bg-gradient-to-r from-[#C5A075] to-[#B08D55] text-[#020C1B] px-12 py-4 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform min-w-[200px] shadow-[0_0_20px_rgba(197,160,117,0.3)]">
                        Shop Collection
                    </Link>
                </div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                <ArrowDown size={24} strokeWidth={1} />
            </div>
        </section>


        {/* ================= CATEGORY HIGHLIGHTS ================= */}
        <section className="py-24 max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl text-[#031121]">Shop by Category</h2>
                {/* Gradient Divider */}
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C5A075] to-transparent mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((cat) => (
                    <Link key={cat.name} href={`/shop?category=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-[#E2E8F0] block rounded-sm shadow-sm">
                        <Image 
                            src={cat.image} 
                            alt={cat.name} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        {/* Overlay: Deep Blue Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B]/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute bottom-6 left-0 w-full text-center text-white">
                            <h3 className="font-serif text-xl tracking-wide group-hover:text-[#C5A075] transition-colors">{cat.name}</h3>
                        </div>
                    </Link>
                ))}

                {/* View All Card: Royal Blue Gradient */}
                <Link href="/shop" className="group relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#020C1B] to-[#0A2540] flex flex-col items-center justify-center text-white text-center border border-transparent hover:border-[#C5A075]/30 transition-all rounded-sm">
                    <div className="p-6">
                        <span className="text-[#C5A075] text-xs font-bold uppercase tracking-widest mb-2 block">Discover More</span>
                        <h3 className="font-serif text-2xl mb-6">View All <br/> Categories</h3>
                        <div className="w-10 h-10 rounded-full border border-[#C5A075]/30 flex items-center justify-center mx-auto group-hover:bg-[#C5A075] group-hover:text-[#031121] transition-colors">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </Link>
            </div>
        </section>


        {/* ================= ZONE 1: THE HERO MOSAIC ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-24 mt-20">
            <div className="text-center mb-16">
                <span className="bg-gradient-to-r from-[#C5A075] to-[#B08D55] bg-clip-text text-transparent text-xs font-bold uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2">
                    Fresh Drops
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-[#031121] mt-3 mb-6">
                    New Arrivals
                </h2>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-2 gap-2 h-auto lg:h-[800px]">
                {heroProducts[0] && (
                    <div className="lg:col-span-2 lg:row-span-2 relative group bg-[#E2E8F0] overflow-hidden">
                        <Link href={`/product/${heroProducts[0].slug}`} className="block w-full h-full relative z-0">
                            {heroProducts[0].image && (
                                <Image 
                                    src={heroProducts[0].image} 
                                    alt={heroProducts[0].name || "Product Image"} 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            {/* Gradient Overlay: Shady Blue */}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#020C1B] via-[#020C1B]/50 to-transparent p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span className="bg-white text-[#031121] text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-2 inline-block">New In</span>
                                <h2 className="font-serif text-3xl mb-1">{heroProducts[0].name}</h2>
                                <p className="font-bold text-lg mb-10 text-[#C5A075]">${heroProducts[0].price?.toLocaleString()}</p>
                            </div>
                        </Link>
                        <div className="absolute bottom-8 left-8 z-20 pointer-events-auto">
                           <AddToCartButton product={heroProducts[0]} styleType="minimal" />
                        </div>
                    </div>
                )}

                {heroProducts.slice(1, 5).map((product: any) => (
                    <div key={product._id} className="relative group bg-white border border-[#E2E8F0] flex flex-col justify-between hover:border-[#C5A075]/50 transition-colors shadow-sm hover:shadow-md">
                         <Link href={`/product/${product.slug}`} className="block relative w-full h-[300px] lg:h-full overflow-hidden">
                            {product.image && (
                                <Image 
                                    src={product.image} 
                                    alt={product.name || "Product"} 
                                    fill 
                                    className="object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                />
                            )}
                         </Link>
                         <div className="p-4 border-t border-[#E2E8F0] bg-white relative z-10">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <Link href={`/product/${product.slug}`}>
                                         <h3 className="font-serif text-sm text-[#031121] hover:underline">{product.name}</h3>
                                     </Link>
                                     <p className="text-xs font-bold text-[#C5A075] mt-1">${product.price?.toLocaleString()}</p>
                                 </div>
                                 <AddToCartButton product={product} styleType="icon" />
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </section>


        {/* ================= ZONE 2: TRENDING (DEEP ROYAL GRADIENT BG) ================= */}
        <section className="relative py-16 mb-24 overflow-hidden">
             {/* Background: Diagonal Gradient Royal Blue -> Midnight */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#020C1B] via-[#051525] to-[#0B1E33] z-0"></div>
             
             <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 mb-10 flex justify-between items-end text-white">
                <h2 className="font-serif text-3xl">Trending Now</h2>
                <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#C5A075] hover:text-white transition-colors">See All</Link>
             </div>
             
             <div className="relative z-10 flex overflow-x-auto gap-6 px-4 sm:px-6 pb-8 no-scrollbar snap-x">
                 {trending.map((product: any) => (
                     <div key={product._id} className="min-w-[280px] md:min-w-[320px] snap-start group">
                         {/* Card BG: Slightly lighter gradient for contrast */}
                         <div className="relative aspect-[3/4] bg-gradient-to-b from-[#0A2540] to-[#031121] mb-4 overflow-hidden border border-white/5 group-hover:border-[#C5A075]/50 transition-colors rounded-sm shadow-xl">
                             <Link href={`/product/${product.slug}`}>
                                 {product.image && (
                                     <Image src={product.image} alt={product.name} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                 )}
                             </Link>
                             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                 <AddToCartButton product={product} styleType="icon" />
                             </div>
                         </div>
                         <h3 className="font-serif text-lg truncate text-[#E2E8F0]">{product.name}</h3>
                         <p className="text-[#C5A075] text-sm font-bold">${product.price?.toLocaleString()}</p>
                     </div>
                 ))}
             </div>
        </section>


        {/* ================= ZONE 3: SPOTLIGHT ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-24">
             <div className="text-center mb-16">
                <span className="bg-gradient-to-r from-[#C5A075] to-[#B08D55] bg-clip-text text-transparent text-xs font-bold uppercase tracking-[0.2em]">
                    Handpicked
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-[#031121] mt-3 mb-6">
                    The Spotlight
                </h2>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent mx-auto"></div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {spotlight.map((product: any, idx: number) => (
                     <div key={product._id} className="group border border-[#E2E8F0] hover:border-[#C5A075] hover:shadow-[0_10px_40px_-10px_rgba(197,160,117,0.1)] transition-all duration-500 flex flex-col bg-white">
                         
                         <div className="text-center p-6 pb-2">
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Exclusive 0{idx+1}</span>
                             <Link href={`/product/${product.slug}`}>
                                <h3 className="font-serif text-2xl mt-2 text-[#031121] group-hover:text-[#C5A075] transition-colors">{product.name}</h3>
                             </Link>
                         </div>

                         <div className="relative aspect-square w-full overflow-hidden mt-4 bg-gradient-to-b from-white to-[#F8FAFC]">
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
                             <div className="flex justify-between items-center text-sm font-bold border-b border-[#E2E8F0] pb-4 text-[#031121]">
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
                <span className="text-[#C5A075] text-xs font-bold uppercase tracking-[0.2em]">Customer Favorites</span>
                <h2 className="font-serif text-4xl md:text-5xl text-[#031121] mt-3 mb-6">Best Sellers</h2>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                 {bestSellers.map((product: any) => (
                     <div key={product._id} className="group flex flex-col">
                         <div className="relative aspect-[4/5] bg-[#F1F5F9] mb-4 overflow-hidden border border-transparent group-hover:border-[#C5A075] transition-colors">
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
                             {/* Badge in Deep Blue */}
                             <div className="absolute top-4 left-4 bg-[#031121] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-lg">
                                 Best Seller
                             </div>
                             <div className="absolute bottom-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                                 <AddToCartButton product={product} styleType="icon" />
                             </div>
                         </div>
                         
                         <div className="text-center">
                             <Link href={`/product/${product.slug}`}>
                                <h3 className="font-serif text-lg text-[#031121] mb-1 group-hover:text-[#C5A075] transition-colors">{product.name}</h3>
                             </Link>
                             <p className="text-sm font-bold text-[#C5A075]">${product.price?.toLocaleString()}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </section>


        {/* ================= ZONE 5: CATALOG ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-20">
             <div className="flex items-center gap-4 mb-10">
                 <Grid3X3 size={18} className="text-[#031121]" />
                 <h2 className="font-serif text-2xl uppercase tracking-wide text-[#031121]">Full Catalog</h2>
                 <div className="h-px bg-gradient-to-r from-[#CBD5E1] to-transparent flex-1" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12">
                 {catalog.map((product: any) => (
                     <div key={product._id} className="group">
                         <div className="relative aspect-[4/5] bg-[#F9F9F9] mb-3 overflow-hidden rounded-sm">
                             <Link href={`/product/${product.slug}`}>
                                 {product.image && <Image src={product.image} alt={product.name} fill className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />}
                             </Link>
                             <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                                 <AddToCartButton product={product} styleType="full" />
                             </div>
                         </div>
                         <div>
                             <Link href={`/product/${product.slug}`}><h3 className="font-serif text-sm truncate text-[#031121] hover:text-[#C5A075] transition-colors">{product.name}</h3></Link>
                             <p className="text-xs font-bold text-[#C5A075] mt-1">${product.price?.toLocaleString()}</p>
                         </div>
                     </div>
                 ))}
             </div>
             <div className="mt-20 text-center">
                 <Link href="/shop" className="inline-block border border-[#031121] text-[#031121] px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#031121] hover:text-white transition-colors">
                     Load More Products
                 </Link>
             </div>
        </section>

      </main>
      <Footer />
    </>
  );
}