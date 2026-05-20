import Image from "next/image";
import Link from "next/link";
import { 
  Settings2, 
  Building2, 
  Zap, 
  Car, 
  ShoppingBag, 
  Package, 
  MoreHorizontal,
  type LucideIcon
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { salesforceQuery } from "@/app/lib/salesforce";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN").format(amount);
}

function getProductImage(name: string): string {
  const lower = (name || "").toLowerCase();
  if (lower.includes("excavator") || lower.includes("hydraulic"))
    return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80";
  if (lower.includes("generator") || lower.includes("diesel"))
    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80";
  if (lower.includes("cnc") || lower.includes("lathe") || lower.includes("milling"))
    return "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&q=80";
  if (lower.includes("pump"))
    return "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80";
  if (lower.includes("compressor"))
    return "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80";
  if (lower.includes("solar"))
    return "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&q=80";
  return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80";
}

function getCategoryIcon(name: string): LucideIcon {
  const lower = (name || "").toLowerCase();
  if (lower.includes("machinery") || lower.includes("industrial")) return Settings2;
  if (lower.includes("construction") || lower.includes("building")) return Building2;
  if (lower.includes("electrical") || lower.includes("electronics")) return Zap;
  if (lower.includes("automobile") || lower.includes("auto")) return Car;
  if (lower.includes("consumer")) return ShoppingBag;
  if (lower.includes("packaging") || lower.includes("printing")) return Package;
  return MoreHorizontal;
}

// ---------------------------------------------------------------------------
// Hardcoded fallback data (used when Salesforce is unreachable)
// ---------------------------------------------------------------------------
const fallbackCategories = [
  { name: "Industrial Machinery", icon: Settings2 },
  { name: "Building & Construction", icon: Building2 },
  { name: "Electrical & Electronics", icon: Zap },
  { name: "Automobiles & Parts", icon: Car },
  { name: "Consumer Goods", icon: ShoppingBag },
  { name: "Packaging & Printing", icon: Package },
  { name: "More Categories", icon: MoreHorizontal },
];

const fallbackProducts = [
  { Id: "1", name: "Hydraulic Excavator", price: "₹23,00,000 / Unit", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80" },
  { Id: "2", name: "Diesel Generator Set", price: "₹2,45,000 / Unit", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
  { Id: "3", name: "CNC Lathe Machine", price: "₹18,75,000 / Unit", img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&q=80" },
  { Id: "4", name: "Industrial Pump", price: "₹48,500 / Piece", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80" },
  { Id: "5", name: "Air Compressor", price: "₹96,000 / Unit", img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80" },
  { Id: "6", name: "Solar Panel 550W", price: "₹9,500 / Piece", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&q=80" },
];

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function fetchCategories(): Promise<{ name: string; icon: LucideIcon }[]> {
  try {
    const records = await salesforceQuery(
      `SELECT Id, Name, CategoryCode__c FROM Product_Custom_Category__c WHERE IsActive__c = true ORDER BY Name ASC LIMIT 7`
    );
    if (records && records.length > 0) {
      return records.map((r: any) => ({
        name: r.Name || "Category",
        icon: getCategoryIcon(r.Name),
      }));
    }
    return fallbackCategories;
  } catch (err) {
    console.error("[Home] Category fetch failed, using fallback:", err);
    return fallbackCategories;
  }
}

async function fetchFeaturedProducts(): Promise<
  { Id: string; name: string; price: string; img: string }[]
> {
  try {
    const records = await salesforceQuery(
      `SELECT Id, Name, Product_Price__c, Units__c, MOQ__c, Account__r.Name, Account__r.BillingCity, Account__r.BillingState, Product_SubCategory__r.Name, Product_SubCategory__r.Product_Custom_Category__r.Name FROM Product_Custom_Object__c WHERE IsActive__c = true ORDER BY CreatedDate DESC LIMIT 6`
    );
    if (records && records.length > 0) {
      return records.map((r: any) => ({
        Id: r.Id,
        name: r.Name || "Product",
        price: `₹${formatINR(r.Product_Price__c || 0)} / ${r.Units__c || "Unit"}`,
        img: getProductImage(r.Name),
      }));
    }
    return fallbackProducts;
  } catch (err) {
    console.error("[Home] Product fetch failed, using fallback:", err);
    return fallbackProducts;
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default async function Home() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchFeaturedProducts(),
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      {/* ===== SECTION 1 — NAVBAR ===== */}
      <Navbar />

      {/* ===== SECTION 2 — HERO BANNER ===== */}
      <section className="bg-[#1B2E5E] min-h-[380px] px-6 lg:px-12 py-10 flex flex-col lg:flex-row items-center relative overflow-hidden">
        {/* Left side */}
        <div className="w-full lg:w-3/5 z-10">
          <h1 className="text-4xl font-bold text-white leading-tight">
            India's Most Trusted<br />B2B Marketplace
          </h1>
          <p className="mt-3 text-white/90 text-base max-w-xl">
            Connect with verified suppliers, explore quality products, grow your business.
          </p>
          
          <div className="mt-6 bg-white rounded-lg flex h-12 max-w-lg">
            <input 
              type="text" 
              placeholder="Search products, categories, suppliers..." 
              className="flex-1 px-4 text-sm rounded-l-lg focus:outline-none text-gray-900"
            />
            <select className="border-l border-gray-200 px-3 text-sm bg-white focus:outline-none hidden sm:block text-gray-700">
              <option>All Categories</option>
            </select>
            <button className="bg-[#E02424] hover:bg-red-700 text-white px-6 h-full text-sm font-medium rounded-r-lg transition-colors">
              Search
            </button>
          </div>

          <div className="mt-6 flex divide-x divide-white/30">
            <div className="pr-6">
              <div className="text-2xl font-bold text-white">10M+</div>
              <div className="text-xs text-white/80">Products</div>
            </div>
            <div className="px-6">
              <div className="text-2xl font-bold text-white">2,5M+</div>
              <div className="text-xs text-white/80">Suppliers</div>
            </div>
            <div className="px-6">
              <div className="text-2xl font-bold text-white">5M+</div>
              <div className="text-xs text-white/80">Buyers</div>
            </div>
            <div className="px-6">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-xs text-white/80">Countries</div>
            </div>
          </div>
        </div>

        {/* Right side (Image) */}
        <div className="absolute right-0 bottom-0 h-full w-2/5 hidden lg:block">
          <Image 
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80" 
            alt="Industrial Worker" 
            fill
            className="object-cover object-left"
            priority
          />
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-4 left-12 flex gap-2 z-10 hidden lg:flex">
          <div className="bg-white w-6 h-2 rounded-full cursor-pointer"></div>
          <div className="bg-white/40 w-2 h-2 rounded-full cursor-pointer hover:bg-white/60 transition-colors"></div>
          <div className="bg-white/40 w-2 h-2 rounded-full cursor-pointer hover:bg-white/60 transition-colors"></div>
          <div className="bg-white/40 w-2 h-2 rounded-full cursor-pointer hover:bg-white/60 transition-colors"></div>
          <div className="bg-white/40 w-2 h-2 rounded-full cursor-pointer hover:bg-white/60 transition-colors"></div>
        </div>
      </section>

      {/* ===== SECTION 3 — TOP CATEGORIES ===== */}
      <section className="bg-white px-6 lg:px-12 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
          <Link href="/products" className="text-sm text-[#1A56DB] font-medium hover:underline">View all</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat, i) => {
            const IconComponent = cat.icon;
            return (
              <div key={i} className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col items-center gap-3 bg-white hover:shadow-sm transition-shadow cursor-pointer">
                <IconComponent className="w-8 h-8 stroke-[1.5] text-gray-700" />
                <span className="text-xs text-gray-700 text-center font-medium leading-tight">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== SECTION 4 — FEATURED PRODUCTS ===== */}
      <section className="bg-[#F9FAFB] px-6 lg:px-12 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-sm text-[#1A56DB] font-medium hover:underline">View all</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product, i) => (
            <Link key={i} href={`/products/${product.Id}`} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
              <div className="rounded-lg mb-3 h-36 relative overflow-hidden bg-gray-100">
                <Image 
                  src={product.img} 
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 leading-snug">{product.name}</h3>
              <p className="text-sm text-gray-700 mt-1">{product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SECTION 5 — SUPPLIER CTA BANNER ===== */}
      <section className="px-6 lg:px-12 py-8 bg-[#F9FAFB]">
        <div className="bg-[#1B2E5E] rounded-xl px-8 lg:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-xl font-bold text-white text-center md:text-left">Are you a supplier?</h2>
            <p className="text-sm text-white/80 mt-1 text-center md:text-left">Grow your business with Indian Trade Mart</p>
          </div>
          <button className="bg-[#E02424] hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap">
            Join Now
          </button>
        </div>
      </section>

    </div>
  );
}
