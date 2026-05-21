import { salesforceQuery, salesforceCount } from "@/app/lib/salesforce";
export const dynamic = 'force-dynamic';
import ProductList from "./ProductList";
import Navbar from "@/app/components/Navbar";

export default async function ProductsPage() {
  const [initialProducts, categories, initialTotal] = await Promise.all([
    salesforceQuery(`SELECT Id, Name, Product_Price__c, Units__c,
      MOQ__c, Brand__c, Account__r.Id, Account__r.Name,
      Account__r.BillingCity, Account__r.BillingState,
      Account__r.Rating, Account__r.IsVerified__c,
      Product_SubCategory__r.Name,
      Product_SubCategory__r.Product_Custom_Category__r.Name
      FROM Product_Custom_Object__c
      WHERE IsActive__c = true
      ORDER BY CreatedDate DESC LIMIT 20`),
    salesforceQuery(`SELECT Product_SubCategory__r.Product_Custom_Category__r.Name catName,
      COUNT(Id) total
      FROM Product_Custom_Object__c
      WHERE IsActive__c = true
      GROUP BY Product_SubCategory__r.Product_Custom_Category__r.Name`),
    salesforceCount(`SELECT COUNT() FROM Product_Custom_Object__c WHERE IsActive__c = true`),
  ]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <ProductList
        initialProducts={initialProducts}
        categories={categories}
        initialTotal={initialTotal}
      />
    </div>
  );
}
