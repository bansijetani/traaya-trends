import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Grid3X3, Tag } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton"; 
import Price from "@/components/Price";
import HeroStatic from "@/components/HeroStatic";

const productFields = `
  _id, name, price, salePrice, "slug": slug.current, "stock": coalesce(stockLevel, 0),
  "image": image.asset->url,
  "gallery": gallery[].asset->url
`;

// --- DATA FETCHING ---
async function getHeroProducts() {
  return await client.fetch(`*[_type == "product"] | order(_createdAt desc)[0...5] { ${productFields} }`);
}

async function getCategories() {
  const query = `*[_type == "category" && !defined(parent)] | order(_createdAt desc)[0...5] {
    _id, name, "slug": slug.current, "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
}

async function getTrending() {
  return await client.fetch(`*[_type == "product"] | order(price desc)[0...8] { ${productFields} }`);
}

async function getSpotlight() {
  return await client.fetch(`*[_type == "product"][5...8] { ${productFields} }`);
}

async function getBestSellers() {
  return await client.fetch(`*[_type == "product"] | order(price desc)[0...4] { ${productFields} }`);
}

async function getMainCatalog() {
  return await client.fetch(`*[_type == "product"] | order(_createdAt asc)[0...12] { ${productFields} }`);
}

export default async function Home() {
  const heroProducts = await getHeroProducts();
  const trending = await getTrending();
  const spotlight = await getSpotlight();
  const bestSellers = await getBestSellers();
  const catalog = await getMainCatalog();
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-page">
        <HeroStatic />

        {/* ================= CATEGORY HIGHLIGHTS ================= */}
        <section className="pt-16 pb-16 md:pb-24 max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-3xl text-primary"> Discover Traaya's Jewelry </h2>
                <div className="w-20 h-0.5 bg-secondary mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((cat: any) => (
                    <Link key={cat._id} href={`/shop?category=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block rounded-sm shadow-sm">
                        {cat.imageUrl ? <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>}
                        <div className="absolute bottom-0 left-0 w-full py-4 bg-white/60 backdrop-blur-md border-t border-white/50 transition-colors duration-300 group-hover:bg-white/90">
                            <h3 className="text-center font-serif text-primary text-xs font-bold uppercase tracking-[0.2em]">{cat.name}</h3>
                        </div>
                    </Link>
                ))}
                <Link href="/shop" className="group relative aspect-[3/4] overflow-hidden bg-primary flex flex-col items-center justify-center text-white text-center border border-transparent hover:border-secondary transition-all rounded-sm">
                    <div className="p-6">
                        <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-2 block">Discover More</span>
                        <h3 className="font-serif text-2xl mb-6">View All <br/> Categories</h3>
                        <div className="w-10 h-10 rounded-full border border-secondary/50 flex items-center justify-center mx-auto group-hover:bg-secondary group-hover:text-white transition-colors"><ArrowRight size={16} /></div>
                    </div>
                </Link>
            </div>
        </section>

        {/* ================= ZONE 1: NEW ARRIVALS (REFINED FULL-SIZE) ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-0 pb-16 md:pb-24">
            <div className="text-center mb-12 md:mb-16">
                <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.4em] mb-3 block">
                    The Latest Collection
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-primary">
                    New Arrivals
                </h2>
                <div className="w-16 h-0.5 bg-secondary mx-auto mt-6"></div>
            </div>

            {/* Removed fixed height 'lg:h-[600px]' to allow images to be truly "full size" */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                
                {/* --- LARGE HERO PRODUCT --- */}
                {heroProducts[0] && (() => {
                    const hasHoverImage = heroProducts[0].gallery && heroProducts[0].gallery.length > 0;
                    const isOutOfStock = heroProducts[0].stock <= 0;

                    return (
                        <div className="col-span-2 lg:row-span-2 relative group bg-[#F9F9F9] overflow-hidden rounded-sm border border-gray-100 shadow-sm">
                            {/* Floating Badges */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                {heroProducts[0].salePrice && (
                                    <div className="flex items-center gap-1.5 bg-secondary text-white pl-2.5 pr-3 py-1.5 rounded-full shadow-md ring-1 ring-white/20">
                                        <Tag size={10} fill="currentColor" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Sale</span>
                                    </div>
                                )}
                                {isOutOfStock && (
                                    <div className="bg-black/90 text-white px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-[0.15em] shadow-md ring-1 ring-white/20">
                                        Out of Stock
                                    </div>
                                )}
                            </div>

                            <Link href={`/product/${heroProducts[0].slug}`} className="block h-full relative">
                                {/* Image Switcher - Using aspect-[4/5] for a tall, full-size look */}
                                <div className="relative aspect-[4/5] lg:h-full w-full overflow-hidden">
                                    <Image 
                                        src={heroProducts[0].image} 
                                        alt={heroProducts[0].name} 
                                        fill 
                                        className={`object-cover transition-opacity duration-1000 ease-in-out ${hasHoverImage ? 'group-hover:opacity-0' : ''} ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                    />
                                    {hasHoverImage && (
                                        <Image 
                                            src={heroProducts[0].gallery[0]} 
                                            alt="alternate view" 
                                            fill 
                                            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100" 
                                        />
                                    )}
                                </div>

                                {/* Minimalist Content Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12 bg-gradient-to-t from-white via-white/80 to-transparent">
                                    <div className="flex flex-col gap-2">
                                        <span className="bg-primary text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest w-fit">Featured</span>
                                        <h3 className="font-serif text-2xl lg:text-4xl text-primary leading-tight max-w-[80%]">
                                            {heroProducts[0].name}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            {heroProducts[0].salePrice ? (
                                                <>
                                                    <span className="text-m font-bold text-secondary">
                                                        <Price amount={heroProducts[0].salePrice} />
                                                    </span>
                                                    <span className="text-[15px] text-gray-400 line-through italic">
                                                        <Price amount={heroProducts[0].price} />
                                                    </span>
                                                </>
                                            ) : (
                                                <Price amount={heroProducts[0].price} className="font-bold text-xl text-primary" />
                                            )}
                                        </div>
                                        <div className="mt-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <AddToCartButton product={heroProducts[0]} styleType="minimal" stock={heroProducts[0].stock} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })()}

                {/* --- SMALLER GRID CARDS --- */}
                {heroProducts.slice(1, 5).map((product: any) => {
                    const hasHoverImage = product.gallery && product.gallery.length > 0;
                    const isOutOfStock = product.stock <= 0;

                    return (
                        <div key={product._id} className="relative group bg-white flex flex-col hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden border border-gray-50">
                            {/* Image Area - Aspect ratio set to 4/5 for taller, full-size presentation */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F9F9F9]">
                                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                                    {product.salePrice && (
                                        <div className="bg-secondary text-white p-1.5 rounded-full shadow-sm ring-1 ring-white/20">
                                            <Tag size={10} fill="currentColor" />
                                        </div>
                                    )}
                                </div>

                                {isOutOfStock && (
                                    <div className="absolute top-0 left-0 w-full bg-black/80 text-white text-[7px] font-bold uppercase py-1.5 text-center tracking-widest z-20">
                                        Out of Stock
                                    </div>
                                )}

                                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        fill 
                                        className={`object-cover transition-opacity duration-700 ease-in-out ${hasHoverImage ? 'group-hover:opacity-0' : ''} ${isOutOfStock ? 'grayscale opacity-40' : ''}`}
                                    />
                                    {hasHoverImage && (
                                        <Image 
                                            src={product.gallery[0]} 
                                            alt="hover view" 
                                            fill 
                                            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out scale-105 group-hover:scale-100" 
                                        />
                                    )}
                                </Link>
                                
                                <div className="absolute bottom-3 right-3 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <AddToCartButton product={product} styleType="icon" stock={product.stock} />
                                </div>
                            </div>

                            {/* Pricing & Text Details */}
                            <div className="p-4 flex flex-col items-center text-center">
                                <Link href={`/product/${product.slug}`}>
                                    <h4 className="font-serif text-[14px] text-primary hover:text-secondary transition-colors line-clamp-1 mb-1">
                                        {product.name}
                                    </h4>
                                </Link>
                                <div className="flex items-center gap-2">
                                    {product.salePrice ? (
                                        <>
                                            <span className="text-xs font-bold text-secondary">
                                                <Price amount={product.salePrice} />
                                            </span>
                                            <span className="text-[10px] text-gray-400 line-through italic">
                                                <Price amount={product.price} />
                                            </span>
                                        </>
                                    ) : (
                                        <Price amount={product.price} className="text-gray-500 text-[14px] font-medium" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
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
                         <div className="relative aspect-[3/4] bg-primary/50 mb-4 overflow-hidden border border-white/10 group-hover:border-secondary transition-colors rounded-sm shadow-xl cursor-pointer">
                             {product.stock <= 0 && <div className="absolute top-0 left-0 w-full bg-black/80 text-white text-[9px] font-bold uppercase py-2 text-center tracking-[0.2em] z-20">Out of Stock</div>}
                             {product.salePrice && (
                                        <div className="bg-secondary text-white p-1.5 rounded-full shadow-sm ring-1 ring-white/20">
                                            <Tag size={10} fill="currentColor" />
                                        </div>
                                    )}
                             <Link href={`/product/${product.slug}`}>
                                 {product.image && <Image src={product.image} alt={product.name} fill className={`object-cover transition-opacity duration-700 ${product.gallery?.[0] ? 'group-hover:opacity-0' : ''} ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`} />}
                                 {product.gallery?.[0] && <Image src={product.gallery[0]} alt="hover" fill className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />}
                             </Link>
                             <div className="absolute bottom-4 right-4 z-20 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                 <AddToCartButton product={product} styleType="icon" stock={product.stock} />
                             </div>
                         </div>
                         <h3 className="font-serif text-lg truncate text-white">{product.name}</h3>
                         <div className="flex gap-2 items-center">
                            <Price amount={product.salePrice || product.price} className="text-secondary text-sm font-bold" />
                            {product.salePrice && <Price amount={product.price} className="text-gray-400 line-through text-[10px] italic" />}
                         </div>
                     </div>
                 ))}
             </div>
        </section>

        {/* ================= ZONE 3: SPOTLIGHT ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-0 pb-16 md:pb-24">
             <div className="text-center mb-16">
                <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em]">Handpicked</span>
                <h2 className="font-serif text-4xl md:text-4xl text-primary mt-3 mb-6">The Spotlight</h2>
                <div className="w-20 h-[1px] bg-gray-200 mx-auto"></div>
            </div>
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 no-scrollbar snap-x">
                 {spotlight.map((product: any, idx: number) => (
                     <div key={product._id} className="min-w-[85vw] md:min-w-0 snap-center group border border-gray-100 hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col bg-white rounded-sm overflow-hidden">
                         <div className="text-center p-4 md:p-6 pb-2">
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Exclusive 0{idx+1}</span>
                             <Link href={`/product/${product.slug}`}><h3 className="font-serif text-xl md:text-2xl mt-2 text-primary group-hover:text-secondary transition-colors line-clamp-1">{product.name}</h3></Link>
                         </div>
                         <div className="relative aspect-square w-full overflow-hidden mt-2 bg-gray-50 cursor-pointer">
                             {product.stock <= 0 && <div className="absolute top-0 left-0 w-full bg-black/80 text-white text-[9px] font-bold uppercase py-2.5 text-center tracking-[0.2em] z-20">Out of Stock</div>}
                             <Link href={`/product/${product.slug}`}>
                                 {product.image && <Image src={product.image} alt={product.name} fill className={`object-cover transition-opacity duration-700 ${product.gallery?.[0] ? 'group-hover:opacity-0' : ''} ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`} />}
                                 {product.gallery?.[0] && <Image src={product.gallery[0]} alt="hover" fill className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100" />}
                             </Link>
                         </div>
                         <div className="flex flex-col gap-3 p-4 md:p-6 pt-4 mt-auto">
                             <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-4 text-primary">
                                 <span>Price</span>
                                 <div className="flex gap-2">
                                     <Price amount={product.salePrice || product.price} />
                                     {product.salePrice && <Price amount={product.price} className="text-gray-400 line-through text-[10px] italic font-normal" />}
                                 </div>
                             </div>
                             <AddToCartButton product={product} styleType="full" stock={product.stock} />
                         </div>
                     </div>
                 ))}
             </div>
        </section>

        {/* ================= ZONE 4: BEST SELLERS ================= */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-24">
             <div className="text-center mb-16">
                <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em]">Customer Favorites</span>
                <h2 className="font-serif text-4xl md:text-4xl text-primary mt-3 mb-6">Best Sellers</h2>
                <div className="w-20 h-[1px] bg-gray-200 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                 {bestSellers.map((product: any) => (
                     <div key={product._id} className="group flex flex-col animate-in fade-in duration-700">
                         <div className="relative aspect-[4/5] bg-gray-50 mb-4 overflow-hidden border border-transparent group-hover:border-secondary transition-colors rounded-sm shadow-sm cursor-pointer">
                             {product.stock <= 0 && <div className="absolute top-0 left-0 w-full bg-black/80 text-white text-[9px] font-bold uppercase py-2.5 text-center tracking-[0.2em] z-20">Out of Stock</div>}
                             <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-lg">Best Seller</div>
                             <Link href={`/product/${product.slug}`} className="block w-full h-full">
                                 {product.image && <Image src={product.image} alt={product.name} fill className={`object-cover transition-opacity duration-700 ${product.gallery?.[0] ? 'group-hover:opacity-0' : ''} ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`} />}
                                 {product.gallery?.[0] && <Image src={product.gallery[0]} alt="hover" fill className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100" />}
                             </Link>
                             <div className="absolute bottom-4 right-4 z-20 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"><AddToCartButton product={product} styleType="icon" stock={product.stock} /></div>
                         </div>
                         <div className="text-center">
                             <Link href={`/product/${product.slug}`}><h3 className="font-serif text-lg text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">{product.name}</h3></Link>
                             <div className="flex justify-center gap-2 items-center">
                                <Price amount={product.salePrice || product.price} className="text-secondary text-sm font-bold" />
                                {product.salePrice && <Price amount={product.price} className="text-gray-400 line-through text-[10px] italic" />}
                             </div>
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
                 {catalog.map((product: any) => {
                    const featuredImage = product.image || (product.gallery && product.gallery[0]);
                    const hoverImage = product.gallery && product.gallery.length > 0 ? product.gallery[0] : null;
                    const isOutOfStock = product.stock <= 0;
                    return (
                        <div key={product._id} className="group flex flex-col animate-in fade-in duration-700">
                            <div className="relative aspect-[3/4] bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm cursor-pointer">
                                {product.salePrice && (
                                    <div className="absolute top-3 left-3 z-20">
                                        <div className="flex items-center gap-1 bg-secondary text-white px-2 py-1 rounded-full shadow-sm"><Tag size={8} fill="currentColor" /><span className="text-[8px] font-bold uppercase tracking-widest">Sale</span></div>
                                    </div>
                                )}
                                {isOutOfStock && <div className="absolute top-0 left-0 w-full bg-black/80 text-white text-[9px] font-bold uppercase py-2.5 text-center tracking-[0.2em] z-20 backdrop-blur-sm">Out of Stock</div>}
                                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                                    {featuredImage && <Image src={featuredImage} alt={product.name} fill className={`object-cover transition-opacity duration-700 ease-in-out ${hoverImage ? 'group-hover:opacity-0' : ''} ${isOutOfStock ? 'opacity-60 grayscale' : ''}`} />}
                                    {hoverImage && <Image src={hoverImage} alt="hover" fill className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out scale-105 group-hover:scale-100" />}
                                </Link>
                                <div className="absolute bottom-3 right-3 z-20 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"><AddToCartButton product={product} styleType="icon" stock={product.stock} /></div>
                            </div>
                            <div className="text-center px-2">
                                <Link href={`/product/${product.slug}`}><h3 className="font-serif text-sm text-primary hover:text-secondary transition-colors mb-1 line-clamp-1">{product.name}</h3></Link>
                                <div className="flex items-center justify-center gap-2">
                                    {product.salePrice ? (
                                        <><span className="text-xs font-bold text-secondary"><Price amount={product.salePrice} /></span><span className="text-[10px] text-gray-400 line-through italic"><Price amount={product.price} /></span></>
                                    ) : <span className="text-xs font-bold text-gray-500"><Price amount={product.price} /></span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
             </div>
             <div className="mt-20 text-center">
                 <Link href="/shop" className="inline-block border border-primary text-primary px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">Load More Products</Link>
             </div>
        </section>
      </main>
  );
}