"use client";

import { Search } from "lucide-react";

export default function ProductFilters() {
  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-[#E5E7EB] p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button className="text-sm text-[#1A56DB] font-medium hover:underline">
          Clear All
        </button>
      </div>

      <div className="border-b border-[#E5E7EB] my-4" />

      {/* FILTER GROUP 1 — Category */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Industrial Machinery", count: 1204 },
            { label: "Construction Equipment", count: 843 },
            { label: "Electricals", count: 864 },
            { label: "Tools & Hardware", count: 552 },
            { label: "Safety Equipment", count: 312 },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1A56DB] focus:ring-[#1A56DB]" />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-gray-400 text-sm ml-auto">({item.count})</span>
            </label>
          ))}
        </div>
        <button className="text-[#1A56DB] text-sm font-medium mt-3 hover:underline">
          + View more
        </button>
      </div>

      <div className="border-b border-[#E5E7EB] my-4" />

      {/* FILTER GROUP 2 — Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="₹ Min"
            className="border border-[#E5E7EB] rounded-lg h-10 px-3 text-sm w-full focus:outline-none focus:border-[#1A56DB]"
          />
          <input
            type="text"
            placeholder="₹ Max"
            className="border border-[#E5E7EB] rounded-lg h-10 px-3 text-sm w-full focus:outline-none focus:border-[#1A56DB]"
          />
        </div>
        <button className="border border-[#1A56DB] text-[#1A56DB] rounded-lg px-4 h-10 text-sm font-medium mt-2 hover:bg-blue-50 transition-colors">
          Apply
        </button>
      </div>

      <div className="border-b border-[#E5E7EB] my-4" />

      {/* FILTER GROUP 3 — MOQ */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">MOQ</h3>
        <div className="flex flex-col gap-2.5">
          {["Any", "1 - 10", "10 - 50", "50 - 100", "100+"].map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="moq"
                defaultChecked={i === 0}
                className="w-4 h-4 text-[#1A56DB] focus:ring-[#1A56DB]"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-[#E5E7EB] my-4" />

      {/* FILTER GROUP 4 — Supplier Location */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Supplier Location</h3>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search location"
            className="border border-[#E5E7EB] rounded-lg h-10 pl-9 pr-3 text-sm w-full focus:outline-none focus:border-[#1A56DB]"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          {[
            { label: "India", count: 5600 },
            { label: "Maharashtra", count: 1200 },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1A56DB] focus:ring-[#1A56DB]" />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-gray-400 text-sm ml-auto">({item.count})</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
