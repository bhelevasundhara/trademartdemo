import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  BadgeCheck,
  Send,
  MessageCircle,
  Share2,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import ImageGallery from "./ImageGallery";
import { salesforceQuery } from "@/app/lib/salesforce";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ProductDetail {
  Id: string;
  Name: string;
  Price__c: number;
  Unit__c: string;
  MOQ__c: number;
  Supplier__r?: {
    Id: string;
    Name: string;
    BillingCity: string;
    BillingState: string;
    BillingCountry: string;
    IsVerified__c: boolean;
    Rating: number;
    ResponseRate__c: number;
    NumberOfEmployees: number;
  };
}

// ---------------------------------------------------------------------------
// Mock fallback
// ---------------------------------------------------------------------------
const mockProduct: ProductDetail = {
  Id: "1",
  Name: "Hydraulic Press Machine 100 Ton",
  Price__c: 1850000,
  Unit__c: "Unit",
  MOQ__c: 1,
  Supplier__r: {
    Id: "supplier-1",
    Name: "Apex Machines Pvt. Ltd.",
    BillingCity: "Rajkot",
    BillingState: "Gujarat",
    BillingCountry: "India",
    IsVerified__c: true,
    Rating: 4.5,
    ResponseRate__c: 90,
    NumberOfEmployees: 250,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN").format(amount);
}

function getProductImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("excavator") || lower.includes("hydraulic press"))
    return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80";
  if (lower.includes("generator") || lower.includes("diesel"))
    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80";
  if (lower.includes("cnc") || lower.includes("lathe") || lower.includes("milling"))
    return "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80";
  if (lower.includes("pump"))
    return "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80";
  if (lower.includes("compressor"))
    return "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80";
  if (lower.includes("solar"))
    return "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80";
  return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80";
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function getProduct(id: string): Promise<ProductDetail> {
  try {
    const safeId = id.replace(/'/g, "\\'");
    const soql = `SELECT Id, Name, Price__c, Unit__c, MOQ__c, Supplier__r.Id, Supplier__r.Name, Supplier__r.BillingCity, Supplier__r.BillingState, Supplier__r.BillingCountry, Supplier__r.IsVerified__c, Supplier__r.Rating, Supplier__r.ResponseRate__c, Supplier__r.NumberOfEmployees FROM Product_Custom_Object__c WHERE Id = '${safeId}' LIMIT 1`;
    const records = await salesforceQuery(soql);
    if (records && records.length > 0) return records[0] as ProductDetail;
    return mockProduct;
  } catch (err) {
    console.error("[ProductDetailPage] Salesforce fetch failed, using mock:", err);
    return mockProduct;
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  const supplier = product.Supplier__r || mockProduct.Supplier__r!;
  const isVerified = supplier.IsVerified__c;
  const location = [supplier.BillingCity, supplier.BillingState, supplier.BillingCountry]
    .filter(Boolean)
    .join(", ");

  const mainImage = getProductImage(product.Name);

  // Key specifications (static for the demo)
  const specifications = [
    { label: "Capacity", value: "100 Ton" },
    { label: "Type", value: "Hydraulic" },
    { label: "Condition", value: "New" },
    { label: "Automation Grade", value: "Semi-Automatic" },
    { label: "Power Source", value: "Electric" },
    { label: "Country of Origin", value: "India" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#1A56DB] hover:underline">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/products" className="text-[#1A56DB] hover:underline">
            Industrial Machinery
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-500">{product.Name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Column 1 — Image Gallery */}
          <div className="col-span-4">
            <ImageGallery mainImage={mainImage} productName={product.Name} />
          </div>

          {/* Column 2 — Product Info */}
          <div className="col-span-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {product.Name}
            </h1>

            {/* Verified badge */}
            {isVerified && (
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck className="w-[18px] h-[18px] text-[#16A34A]" />
                <span className="text-sm font-medium text-[#16A34A]">
                  Verified Supplier
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-2 flex items-end">
              <span className="text-4xl font-bold text-[#1A56DB]">
                ₹{formatINR(product.Price__c)}
              </span>
              <span className="text-lg text-gray-500 ml-2">
                / {product.Unit__c || "Unit"}
              </span>
            </div>

            {/* MOQ */}
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                MOQ: {product.MOQ__c || 1} {product.Unit__c || "Unit"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-4">
              <button className="bg-[#1A56DB] text-white rounded-lg px-8 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send RFQ
              </button>
              <button className="border-2 border-[#1A56DB] text-[#1A56DB] rounded-lg px-8 py-3 text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat with Supplier
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex items-center gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#1A56DB] focus:ring-[#1A56DB]"
                />
                <span className="text-sm text-gray-600">Add to Compare</span>
              </label>
              <button className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Key Specifications */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Key Specifications
              </h2>

              <div className="w-full">
                {specifications.map((spec, i) => (
                  <div
                    key={i}
                    className={`py-3 flex justify-between items-center ${
                      i < specifications.length - 1
                        ? "border-b border-[#E5E7EB]"
                        : ""
                    }`}
                  >
                    <span className="text-sm text-gray-500">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="#"
                className="mt-4 text-center block text-sm text-[#1A56DB] font-medium hover:underline"
              >
                View full specifications
              </Link>
            </div>
          </div>

          {/* Column 3 — Supplier Sidebar */}
          <div className="col-span-3">
            {/* Card 1 — Supplier Overview */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Supplier Overview
              </h3>

              {/* Supplier identity */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-lg border border-[#E5E7EB] bg-gray-50 overflow-hidden flex-shrink-0 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&q=80"
                    alt={supplier.Name}
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                </div>
                <div>
                  <Link
                    href={`/suppliers/${supplier.Id}`}
                    className="text-sm font-semibold text-[#1A56DB] hover:underline"
                  >
                    {supplier.Name}
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-medium text-gray-700">
                      {supplier.Rating}
                    </span>
                    <span className="text-xs text-gray-400">(168 Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-600">{location}</span>
              </div>

              {/* Years in business */}
              <div className="flex items-center gap-1 mb-4">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  10+ Years in Business
                </span>
              </div>

              {/* View Profile button */}
              <Link
                href={`/suppliers/${supplier.Id}`}
                className="w-full block text-center border-2 border-[#1A56DB] text-[#1A56DB] rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                View Profile
              </Link>
            </div>

            {/* Card 2 — Supplier Stats */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              {[
                {
                  label: "Response Rate",
                  value: `${supplier.ResponseRate__c || 90}%`,
                },
                { label: "On-time Delivery", value: "98%" },
                {
                  label: "Products",
                  value: `${supplier.NumberOfEmployees || 250}+`,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center py-2 ${
                    i < 2 ? "border-b border-[#E5E7EB]" : ""
                  }`}
                >
                  <span className="text-sm text-gray-500">{stat.label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stat.value}
                  </span>
                </div>
              ))}

              {/* Verified badge */}
              {isVerified && (
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#16A34A]" />
                  <span className="text-sm font-semibold text-[#16A34A]">
                    Verified Supplier
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
