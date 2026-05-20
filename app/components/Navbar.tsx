import Link from "next/link";
import { ChevronDown, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#E02424] rounded-full flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <div className="leading-tight">
            <div className="text-[#1B2E5E] font-bold text-lg lowercase">indian</div>
            <div className="text-[#1B2E5E] font-bold text-lg lowercase -mt-1">trademart</div>
          </div>
        </Link>
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
  );
}
