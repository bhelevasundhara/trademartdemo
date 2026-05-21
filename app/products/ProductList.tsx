"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2, Search } from "lucide-react";
import { getProductImage } from "@/app/lib/helpers";

interface ProductRecord {
  Id: string;
  Name: string;
  Product_Price__c: number;
  Units__c: string;
  MOQ__c: number;
  Brand__c?: string;
  Description__c?: string;
  Account__r?: {
    Id: string;
    Name: string;
    BillingCity: string;
    BillingState: string;
  };
  Product_SubCategory__r?: {
    Name: string;
    Product_Custom_Category__r?: {
      Name: string;
    };
  };
}

interface CategoryRecord {
  catName: string;
  total: number;
}

export default function ProductList({
  initialProducts,
  categories,
  initialTotal,
}: {
  initialProducts: ProductRecord[];
  categories: CategoryRecord[];
  initialTotal: number;
}) {
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedMOQ, setSelectedMOQ] = useState("any");
  const [currentPage, setCurrentPage] = useState(1);

  // Use a ref or state for price inputs so they don't fetch on every keystroke, but on Apply click
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  useEffect(() => {
    // Only fetch if it's not the initial load state, or let it fetch to be safe.
    // Actually, to avoid a double fetch on mount, we can track if mounted.
    // But it's simple enough to just let it run or rely on strict dependency matching.
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") params.append("category", selectedCategory);
        if (appliedMinPrice) params.append("minPrice", appliedMinPrice);
        if (appliedMaxPrice) params.append("maxPrice", appliedMaxPrice);
        if (selectedMOQ !== "any") params.append("moq", selectedMOQ);
        params.append("page", currentPage.toString());

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
          setTotal(data.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, appliedMinPrice, appliedMaxPrice, selectedMOQ, currentPage]);

  const handlePriceApply = () => {
    setCurrentPage(1);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  const handleClearAll = () => {
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setSelectedMOQ("any");
    setCurrentPage(1);
  };

  const formatINR = (amount: number) => new Intl.NumberFormat("en-IN").format(amount);

  const totalPages = Math.ceil(total / 20) || 1;
  const startX = total === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const endY = Math.min(currentPage * 20, total);

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-[#E5E7EB] p-6 min-h-screen">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button onClick={handleClearAll} className="text-sm text-[#1A56DB] font-medium hover:underline">
            Clear All
          </button>
        </div>

        <div className="border-b border-[#E5E7EB] my-4" />

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedCategory === "all"}
                onChange={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded border-gray-300 text-[#1A56DB] focus:ring-[#1A56DB]" 
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((cat, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedCategory === cat.catName}
                  onChange={() => {
                    setSelectedCategory(cat.catName);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-[#1A56DB] focus:ring-[#1A56DB]" 
                />
                <span className="text-sm text-gray-700">{cat.catName}</span>
                <span className="text-gray-400 text-sm ml-auto">({cat.total})</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-b border-[#E5E7EB] my-4" />

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="₹ Min"
              className="border border-[#E5E7EB] rounded-lg h-10 px-3 text-sm w-full focus:outline-none focus:border-[#1A56DB]"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="₹ Max"
              className="border border-[#E5E7EB] rounded-lg h-10 px-3 text-sm w-full focus:outline-none focus:border-[#1A56DB]"
            />
          </div>
          <button 
            onClick={handlePriceApply}
            className="border border-[#1A56DB] text-[#1A56DB] rounded-lg px-4 h-10 text-sm font-medium mt-2 hover:bg-blue-50 transition-colors"
          >
            Apply
          </button>
        </div>

        <div className="border-b border-[#E5E7EB] my-4" />

        {/* MOQ Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">MOQ</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { id: "any", label: "Any" },
              { id: "1-10", label: "1 - 10" },
              { id: "10-50", label: "10 - 50" },
              { id: "50-100", label: "50 - 100" },
              { id: "100+", label: "100+" }
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="moq"
                  checked={selectedMOQ === item.id}
                  onChange={() => {
                    setSelectedMOQ(item.id);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 text-[#1A56DB] focus:ring-[#1A56DB]"
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F9FAFB] p-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-start justify-center pt-20">
            <span className="text-gray-500 font-medium text-sm">Loading products...</span>
          </div>
        )}
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-600">
            Showing {startX} - {endY} of {total.toLocaleString("en-IN")} products
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-[#E5E7EB] rounded-lg px-3 h-10 text-sm bg-white focus:outline-none focus:border-[#1A56DB]">
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-4">
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No products available at the moment.</p>
            </div>
          ) : (
            products.map((product) => {
              const supplierName = product.Account__r?.Name || "Supplier";
              const city = product.Account__r?.BillingCity || "";
              const state = product.Account__r?.BillingState || "";
              const location = [city, state].filter(Boolean).join(", ");
              const category = product.Product_SubCategory__r?.Product_Custom_Category__r?.Name || "";

              return (
                <div
                  key={product.Id}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-row items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-32 h-32 rounded-lg bg-gray-50 overflow-hidden border border-[#E5E7EB] relative">
                    <Image
                      src={getProductImage(product.Name)}
                      alt={product.Name}
                      fill
                      className="object-contain"
                      sizes="128px"
                    />
                  </div>

                  {/* Center Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.Id}`}
                      className="text-lg font-semibold text-[#1B2E5E] hover:text-[#1A56DB] cursor-pointer line-clamp-2"
                    >
                      {product.Name}
                    </Link>

                    <div className="mt-2 flex items-end">
                      <span className="text-2xl font-bold text-[#1A56DB]">
                        ₹{formatINR(product.Product_Price__c || 0)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1 mb-1">
                        / {product.Units__c || "Unit"}
                      </span>
                    </div>

                    <div className="mt-1">
                      <span className="text-sm text-gray-500">
                        MOQ: {product.MOQ__c || 1} {product.Units__c || "Unit"}
                      </span>
                    </div>

                    {category && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-400">{category}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="w-48 flex-shrink-0 flex flex-col items-end gap-2">
                    <span className="text-sm font-semibold text-[#1A56DB] text-right">
                      {supplierName}
                    </span>

                    {location && (
                      <span className="text-xs text-gray-500 text-right">
                        {location}
                      </span>
                    )}

                    {product.Account__r && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-sm font-medium text-gray-700">
                          4.5
                        </span>
                      </div>
                    )}

                    {product.Account__r && (
                      <div className="flex items-center gap-1 bg-[#DCFCE7] rounded-full px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                        <span className="text-xs font-medium text-[#16A34A]">
                          Verified Supplier
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/products/${product.Id}`}
                      className="border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-8">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="border border-[#E5E7EB] rounded-lg w-9 h-9 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg w-9 h-9 flex items-center justify-center text-sm font-medium ${
                  page === currentPage
                    ? "bg-[#1A56DB] text-white"
                    : "border border-[#E5E7EB] text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="border border-[#E5E7EB] rounded-lg px-4 h-9 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
