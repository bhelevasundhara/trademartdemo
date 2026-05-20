import Image from "next/image";
import { 
  ChevronDown, 
  Bell, 
  User, 
  Settings2, 
  Building2, 
  Zap, 
  Car, 
  ShoppingBag, 
  Package, 
  MoreHorizontal 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      {/* ===== SECTION 1 — NAVBAR ===== */}
      <nav className="sticky top-0 z-50 px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#E02424] rounded-full flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <div className="leading-tight">
              <div className="text-[#1B2E5E] font-bold text-lg lowercase">indian</div>
              <div className="text-[#1B2E5E] font-bold text-lg lowercase -mt-1">trademart</div>
            </div>
          </div>
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#1A56DB]">
              Categories <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-sm font-medium text-gray-700 hover:text-[#1A56DB]">
              Suppliers
            </button>
          </div>
        </div>

        {/* Center Search */}
        <div className="hidden lg:flex items-center">
          <input 
            type="text" 
            placeholder="What are you looking for..." 
            className="border border-gray-300 rounded-l-lg h-10 px-4 text-sm w-64 focus:outline-none focus:border-[#1A56DB]"
          />
          <select className="border-y border-r border-l border-gray-300 h-10 px-3 text-sm bg-white focus:outline-none focus:border-[#1A56DB]">
            <option>All Categories</option>
          </select>
          <button className="bg-[#1A56DB] hover:bg-blue-700 text-white h-10 px-5 rounded-r-lg text-sm font-medium transition-colors">
            Search
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="hidden md:block text-sm font-medium text-gray-700 hover:text-[#1A56DB]">
            Become a Supplier
          </button>
          <button className="text-gray-700 hover:text-[#1A56DB]">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#1A56DB]">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Login / Sign Up</span>
          </button>
        </div>
      </nav>

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
          <button className="text-sm text-[#1A56DB] font-medium hover:underline">View all</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: "Industrial Machinery", icon: Settings2 },
            { name: "Building & Construction", icon: Building2 },
            { name: "Electrical & Electronics", icon: Zap },
            { name: "Automobiles & Parts", icon: Car },
            { name: "Consumer Goods", icon: ShoppingBag },
            { name: "Packaging & Printing", icon: Package },
            { name: "More Categories", icon: MoreHorizontal },
          ].map((cat, i) => (
            <div key={i} className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col items-center gap-3 bg-white hover:shadow-sm transition-shadow cursor-pointer">
              <cat.icon className="w-8 h-8 stroke-[1.5] text-gray-700" />
              <span className="text-xs text-gray-700 text-center font-medium leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 4 — FEATURED PRODUCTS ===== */}
      <section className="bg-[#F9FAFB] px-6 lg:px-12 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          <button className="text-sm text-[#1A56DB] font-medium hover:underline">View all</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Hydraulic Excavator", price: "₹23,00,000 / Unit", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80" },
            { name: "Diesel Generator Set", price: "₹2,45,000 / Unit", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
            { name: "CNC Lathe Machine", price: "₹18,75,000 / Unit", img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&q=80" },
            { name: "Industrial Pump", price: "₹48,500 / Piece", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80" },
            { name: "Air Compressor", price: "₹96,000 / Unit", img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80" },
            { name: "Solar Panel 550W", price: "₹9,500 / Piece", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&q=80" },
          ].map((product, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
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
            </div>
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
