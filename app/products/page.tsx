import Link from "next/link";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import ProductFilters from "./ProductFilters";
import { salesforceQuery } from "@/app/lib/salesforce";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ProductRecord {
  Id: string;
  Name: string;
  Price__c: number;
  Unit__c: string;
  MOQ__c: number;
  Supplier__r?: {
    Name: string;
    BillingCity: string;
    BillingState: string;
    IsVerified__c: boolean;
    Rating: number;
  };
  // Flattened fallback shape (mock data)
  "Supplier__r.Name"?: string;
  "Supplier__r.BillingCity"?: string;
  "Supplier__r.BillingState"?: string;
  "Supplier__r.IsVerified__c"?: boolean;
  "Supplier__r.Rating"?: number;
}

// ---------------------------------------------------------------------------
// Mock data — used as fallback when Salesforce is unreachable
// ---------------------------------------------------------------------------
const mockProducts: ProductRecord[] = [
  {
    Id: "1",
    Name: "Hydraulic Press Machine 100 Ton",
    Price__c: 1850000,
    Unit__c: "Unit",
    MOQ__c: 1,
    "Supplier__r.Name": "Apex Machines Pvt. Ltd.",
    "Supplier__r.BillingCity": "Rajkot",
    "Supplier__r.BillingState": "Gujarat",
    "Supplier__r.IsVerified__c": true,
    "Supplier__r.Rating": 4.5,
  },
  {
    Id: "2",
    Name: "CNC Milling Machine - VMC 850",
    Price__c: 2400000,
    Unit__c: "Unit",
    MOQ__c: 1,
    "Supplier__r.Name": "Bhavya Engineering Works",
    "Supplier__r.BillingCity": "Pune",
    "Supplier__r.BillingState": "Maharashtra",
    "Supplier__r.IsVerified__c": true,
    "Supplier__r.Rating": 4.7,
  },
  {
    Id: "3",
    Name: "Diesel Generator Set 125 KVA",
    Price__c: 245000,
    Unit__c: "Unit",
    MOQ__c: 1,
    "Supplier__r.Name": "PowerGen Solutions",
    "Supplier__r.BillingCity": "Delhi",
    "Supplier__r.BillingState": "India",
    "Supplier__r.IsVerified__c": false,
    "Supplier__r.Rating": 4.5,
  },
  {
    Id: "4",
    Name: "Industrial Air Compressor 10 HP",
    Price__c: 95000,
    Unit__c: "Unit",
    MOQ__c: 1,
    "Supplier__r.Name": "AirMas Systems",
    "Supplier__r.BillingCity": "Coimbatore",
    "Supplier__r.BillingState": "Tamil Nadu",
    "Supplier__r.IsVerified__c": true,
    "Supplier__r.Rating": 4.4,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN").format(amount);
}

function getProductImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("excavator") || lower.includes("hydraulic press"))
    return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80";
  if (lower.includes("generator") || lower.includes("diesel"))
    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80";
  if (lower.includes("cnc") || lower.includes("lathe") || lower.includes("milling"))
    return "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&q=80";
  if (lower.includes("pump"))
    return "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&q=80";
  if (lower.includes("compressor"))
    return "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80";
  if (lower.includes("solar"))
    return "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&q=80";
  return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80";
}

/** Normalise a record — handles both SF nested shape and flat mock shape. */
function getSupplierField(
  record: ProductRecord,
  field: "Name" | "BillingCity" | "BillingState" | "IsVerified__c" | "Rating"
): any {
  if (record.Supplier__r) return record.Supplier__r[field];
  const key = `Supplier__r.${field}` as keyof ProductRecord;
  return record[key];
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function getProducts(): Promise<ProductRecord[]> {
  try {
    const soql = `SELECT Id, Name, Price__c, Unit__c, MOQ__c, Supplier__r.Name, Supplier__r.BillingCity, Supplier__r.BillingState, Supplier__r.IsVerified__c, Supplier__r.Rating FROM Product_Custom_Object__c WHERE IsActive__c = true LIMIT 20`;
    const records = await salesforceQuery(soql);
    if (records && records.length > 0) return records as ProductRecord[];
    return mockProducts;
  } catch (err) {
    console.error("[ProductsPage] Salesforce fetch failed, using mock data:", err);
    return mockProducts;
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="flex">
        {/* Left Sidebar */}
        <ProductFilters />

        {/* Main Content */}
        <main className="flex-1 bg-[#F9FAFB] p-6">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              Showing 1 - {products.length} of 12,566 products
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border border-[#E5E7EB] rounded-lg px-3 h-10 text-sm bg-white focus:outline-none focus:border-[#1A56DB]">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          {/* Product List */}
          <div className="flex flex-col gap-4">
            {products.map((product) => {
              const supplierName = getSupplierField(product, "Name") || "Supplier";
              const city = getSupplierField(product, "BillingCity") || "";
              const state = getSupplierField(product, "BillingState") || "";
              const isVerified = getSupplierField(product, "IsVerified__c") || false;
              const rating = getSupplierField(product, "Rating") || 0;
              const location = [city, state].filter(Boolean).join(", ");

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
                        ₹{formatINR(product.Price__c)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1 mb-1">
                        / {product.Unit__c || "Unit"}
                      </span>
                    </div>

                    <div className="mt-1">
                      <span className="text-sm text-gray-500">
                        MOQ: {product.MOQ__c || 1} {product.Unit__c || "Unit"}
                      </span>
                    </div>
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

                    {rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-sm font-medium text-gray-700">
                          {rating}
                        </span>
                      </div>
                    )}

                    {isVerified && (
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
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-1 mt-8">
            <button className="border border-[#E5E7EB] rounded-lg w-9 h-9 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50">
              ‹
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`rounded-lg w-9 h-9 flex items-center justify-center text-sm font-medium ${
                  page === 1
                    ? "bg-[#1A56DB] text-white"
                    : "border border-[#E5E7EB] text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-gray-400 text-sm px-1">...</span>
            <button className="border border-[#E5E7EB] rounded-lg w-9 h-9 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50">
              629
            </button>
            <button className="border border-[#E5E7EB] rounded-lg px-4 h-9 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next ›
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
