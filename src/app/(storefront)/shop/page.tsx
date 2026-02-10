import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
// 👇 FIXED: Added 'X' and 'Check' to the imports
import { ChevronDown, X, Check, Grid, LayoutGrid, Columns, ChevronLeft, ChevronRight } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import Price from "@/components/Price";
import MobileFilterBar from "@/components/MobileFilter"; 
import ShopSidebar from "@/components/ShopSidebar";       

export const dynamic = "force-dynamic";
const ITEMS_PER_PAGE = 12;

// --- 1. DATA FETCHING ---
async function getShopData() {
  const categoryQuery = `*[_type == "category" && !defined(parent)] {
    _id, name, "slug": slug.current, 
    "imageUrl": image.asset->url,
    "productCount": count(*[_type == "product" && references(^._id)])
  } | order(productCount desc)`;

  const allCategoriesQuery = `*[_type == "category"] {
    _id, name, "slug": slug.current
  } | order(name asc)`;

  const productQuery = `*[_type == "product"] | order(_createdAt desc) {
    _id, name, price, 
    "stock": coalesce(stockLevel, 0),
    "slug": slug.current,
    "image": coalesce(image.asset->url, images[0].asset->url),
    "categories": categories[]->slug.current
  }`;

  const [categoriesData, allCategoriesData, productsData] = await Promise.all([
    client.fetch(categoryQuery),
    client.fetch(allCategoriesQuery),
    client.fetch(productQuery),
  ]);

  return { categories: categoriesData || [], allCategories: allCategoriesData || [], products: productsData || [] };
}

type SearchParamsType = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ShopPage(props: { searchParams: SearchParamsType }) {
  const searchParams = await props.searchParams;
  const { categories, allCategories, products } = await getShopData();

  // Params
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : "";
  const selectedCategories = categoryParam ? categoryParam.split(',') : [];
  const stockParam = typeof searchParams.stock === 'string' ? searchParams.stock : ""; 
  const priceParam = typeof searchParams.price === 'string' ? searchParams.price : "";
  const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : "";
  const gridParam = typeof searchParams.grid === 'string' ? searchParams.grid : "3"; // Default Mobile 2
  const pageParam = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

  // Filter Logic
  let filteredProducts = products;
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p: any) => p.categories && p.categories.some((catSlug: string) => selectedCategories.includes(catSlug)));
  }
  if (stockParam === "in_stock") filteredProducts = filteredProducts.filter((p: any) => p.stock > 0);
  else if (stockParam === "out_of_stock") filteredProducts = filteredProducts.filter((p: any) => p.stock <= 0);

  if (priceParam === "under_500") filteredProducts = filteredProducts.filter((p: any) => p.price < 500);
  if (priceParam === "500_1000") filteredProducts = filteredProducts.filter((p: any) => p.price >= 500 && p.price <= 1000);
  if (priceParam === "over_1000") filteredProducts = filteredProducts.filter((p: any) => p.price > 1000);

  if (sortParam === "price_asc") filteredProducts.sort((a: any, b: any) => a.price - b.price);
  else if (sortParam === "price_desc") filteredProducts.sort((a: any, b: any) => b.price - a.price);
  else if (sortParam === "title_asc") filteredProducts.sort((a: any, b: any) => a.name.localeCompare(b.name));
  else if (sortParam === "title_desc") filteredProducts.sort((a: any, b: any) => b.name.localeCompare(a.name));

  // Pagination & Counts
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((pageParam - 1) * ITEMS_PER_PAGE, pageParam * ITEMS_PER_PAGE);

  const categoryCounts = allCategories.reduce((acc: any, cat: any) => {
      acc[cat.slug] = products.filter((p: any) => p.categories && p.categories.includes(cat.slug)).length;
      return acc;
  }, {});
  const stockCounts = { inStock: products.filter((p: any) => p.stock > 0).length, outOfStock: products.filter((p: any) => p.stock <= 0).length };
  const priceCounts = { under500: products.filter((p: any) => p.price < 500).length, range500_1000: products.filter((p: any) => p.price >= 500 && p.price <= 1000).length, above1000: products.filter((p: any) => p.price > 1000).length };

  const buildUrl = (key: string, value: string | number) => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(','));
    if (stockParam) params.set("stock", stockParam);
    if (priceParam) params.set("price", priceParam);
    if (sortParam) params.set("sort", sortParam);
    if (gridParam) params.set("grid", gridParam);
    if (key === "page") params.set("page", value.toString());
    if (value && key !== "page") params.set(key, value.toString());
    else if (!value && key !== "page") params.delete(key);
    return `/shop?${params.toString()}`;
  };

  const clearAllUrl = "/shop";
  const currentCategory = allCategories.find((c: any) => c.slug === selectedCategories[0]);
  const title = selectedCategories.length === 1 ? (currentCategory?.name || "Category") : "All Products";
  const getGridClass = () => {
      if (gridParam === "1") return "grid-cols-1";
      if (gridParam === "2") return "grid-cols-2";
      if (gridParam === "4") return "grid-cols-2 md:grid-cols-4";
      return "grid-cols-2 md:grid-cols-3"; 
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-[1600px] mx-auto px-6 pt-32 md:pt-40 pb-8">
        
        {/* HEADER */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link> <span className="mx-2">—</span> <span className="text-primary">{title}</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-8 border-b border-gray-100 pb-8">
            <div className="relative">
                <h1 className="font-serif text-4xl md:text-6xl text-primary uppercase tracking-tight">{title}</h1>
                <span className="absolute -top-2 -right-6 text-sm font-bold text-secondary">{filteredProducts.length}</span>
            </div>
        </div>

        {/* TOP CATEGORIES (Slider) */}
        <div className="flex pt-4 flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible justify-start md:justify-center gap-4 md:gap-10 mb-8 border-b border-gray-100 pb-8 px-4 md:px-0 -mx-6 md:mx-0 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Link href={buildUrl('category', '')} className="group flex flex-col items-center gap-3 flex-shrink-0 snap-center">
                <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border transition-all duration-300 bg-primary text-white ${selectedCategories.length === 0 ? 'border-secondary ring-1 ring-secondary ring-offset-4' : 'border-transparent group-hover:border-secondary'}`}>
                    <div className="w-full h-full flex items-center justify-center text-xs font-serif tracking-widest uppercase">All</div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedCategories.length === 0 ? 'text-secondary' : 'text-primary'}`}>All</span>
            </Link>
            {categories.slice(0, 5).map((cat: any) => (
                <Link key={cat._id} href={`/shop?category=${cat.slug}`} className="group flex flex-col items-center gap-3 flex-shrink-0 snap-center">
                    <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border transition-all duration-300 ${selectedCategories.includes(cat.slug) ? 'border-secondary ring-1 ring-secondary ring-offset-4' : 'border-gray-100 group-hover:border-secondary shadow-sm'}`}>
                        {cat.imageUrl ? <Image src={cat.imageUrl} alt={cat.name || "Category"} fill className="object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedCategories.includes(cat.slug) ? 'text-secondary' : 'text-primary'}`}>{cat.name}</span>
                </Link>
            ))}
        </div>

        {/* MOBILE INLINE FILTER BAR */}
        <MobileFilterBar 
            allCategories={allCategories} 
            categoryCounts={categoryCounts} 
            stockCounts={stockCounts} 
            priceCounts={priceCounts} 
        />

        {/* DESKTOP TOOLBAR (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-12 gap-6">
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-lg mr-4">Active Filters:</span>
                {selectedCategories.map(slug => (
                    <span key={slug} className="bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">{allCategories.find((c: any) => c.slug === slug)?.name || slug} <X size={12} /></span>
                ))}
                {stockParam && <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">{stockParam.replace('_', ' ')} <X size={12} /></span>}
                {(selectedCategories.length > 0 || stockParam || priceParam) ? <Link href={clearAllUrl} className="text-[10px] font-bold uppercase underline text-gray-400 hover:text-red-500 ml-2">Clear All</Link> : <span className="text-sm text-gray-400 italic">None</span>}
            </div>
            <div className="flex items-center gap-6 ml-auto">
                <div className="flex items-center gap-3 text-gray-300">
                    <Link href={buildUrl('grid', '2')}><Columns size={20} className={gridParam === '2' ? 'text-primary' : 'hover:text-primary'} /></Link>
                    <Link href={buildUrl('grid', '3')}><Grid size={20} className={gridParam === '3' ? 'text-primary' : 'hover:text-primary'} /></Link>
                    <Link href={buildUrl('grid', '4')} className="hidden md:block"><LayoutGrid size={20} className={gridParam === '4' ? 'text-primary' : 'hover:text-primary'} /></Link>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="relative group">
                     <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-secondary">Sort by <ChevronDown size={14} /></button>
                     <div className="absolute right-0 top-full bg-white shadow-xl border border-gray-100 w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col">
                        <Link href={buildUrl('sort', '')} className="px-6 py-3 text-xs hover:bg-gray-50">Default</Link>
                        <Link href={buildUrl('sort', 'title_asc')} className="px-6 py-3 text-xs hover:bg-gray-50">Title: A-Z</Link>
                        <Link href={buildUrl('sort', 'title_desc')} className="px-6 py-3 text-xs hover:bg-gray-50">Title: Z-A</Link>
                        <Link href={buildUrl('sort', 'price_asc')} className="px-6 py-3 text-xs hover:bg-gray-50">Price: Low to High</Link>
                        <Link href={buildUrl('sort', 'price_desc')} className="px-6 py-3 text-xs hover:bg-gray-50">Price: High to Low</Link>
                     </div>
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* DESKTOP SIDEBAR */}
            <ShopSidebar 
                allCategories={allCategories} 
                categoryCounts={categoryCounts} 
                stockCounts={stockCounts} 
                priceCounts={priceCounts} 
            />

            {/* PRODUCT GRID */}
            <div className="flex-1">
                 {filteredProducts.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center text-center bg-gray-50 rounded-sm p-12">
                        <h3 className="font-serif text-2xl text-primary mb-2">No products found</h3>
                        <Link href="/shop" className="bg-primary text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-secondary">Clear All</Link>
                    </div>
                 ) : (
                    <>
                        <div className={`grid gap-x-6 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ${getGridClass()}`}>
                            {paginatedProducts.map((product: any) => (
                                <div key={product._id} className="group flex flex-col">
                                    <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden rounded-sm">
                                        <Link href={`/product/${product.slug}`} className="block w-full h-full">
                                            {product.image ? <Image src={product.image} alt={product.name || "Img"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full bg-gray-100" />}
                                        </Link>
                                        {product.stock <= 0 && <div className="absolute top-0 left-0 w-full bg-black/80 text-white text-[10px] font-bold uppercase py-2 text-center z-10">Out of Stock</div>}
                                        <div className="absolute bottom-3 right-3 z-20"><AddToCartButton product={product} styleType="icon" stock={product.stock} /></div>
                                    </div>
                                    <div>
                                        <Link href={`/product/${product.slug}`}><h3 className="font-serif text-base text-primary hover:text-secondary line-clamp-1">{product.name}</h3></Link>
                                        <div className="flex gap-2 items-center mt-1"><span className="text-sm font-bold text-secondary"><Price amount={product.price} /></span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-16 pt-10 border-t border-gray-100">
                                {pageParam > 1 && <Link href={buildUrl('page', pageParam - 1)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-sm hover:border-primary hover:text-primary"><ChevronLeft size={16} /></Link>}
                                {[...Array(totalPages)].map((_, idx) => (
                                    <Link key={idx} href={buildUrl('page', idx + 1)} className={`w-10 h-10 flex items-center justify-center text-xs font-bold border rounded-sm transition-all ${idx + 1 === pageParam ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>{idx + 1}</Link>
                                ))}
                                {pageParam < totalPages && <Link href={buildUrl('page', pageParam + 1)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-sm hover:border-primary hover:text-primary"><ChevronRight size={16} /></Link>}
                            </div>
                        )}
                    </>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}