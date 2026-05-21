export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const moq = searchParams.get('moq');
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * 20;

  let where = "WHERE IsActive__c = true";

  if (category && category !== 'all') {
    where += ` AND Product_SubCategory__r.Product_Custom_Category__r.Name = '${category.replace(/'/g, "\\'")}'`;
  }
  if (minPrice) {
    where += ` AND Product_Price__c >= ${parseFloat(minPrice)}`;
  }
  if (maxPrice) {
    where += ` AND Product_Price__c <= ${parseFloat(maxPrice)}`;
  }
  if (moq && moq !== 'any') {
    const moqMap: Record<string, string> = {
      '1-10': 'AND MOQ__c >= 1 AND MOQ__c <= 10',
      '10-50': 'AND MOQ__c >= 10 AND MOQ__c <= 50',
      '50-100': 'AND MOQ__c >= 50 AND MOQ__c <= 100',
      '100+': 'AND MOQ__c >= 100',
    };
    if (moqMap[moq]) where += ' ' + moqMap[moq];
  }

  const soql = `
    SELECT Id, Name, Product_Price__c, Units__c, MOQ__c,
           Brand__c,
           Account__r.Id, Account__r.Name,
           Account__r.BillingCity, Account__r.BillingState,
           Account__r.Rating, Account__r.IsVerified__c,
           Product_SubCategory__r.Name,
           Product_SubCategory__r.Product_Custom_Category__r.Name
    FROM Product_Custom_Object__c
    ${where}
    ORDER BY CreatedDate DESC
    LIMIT 20 OFFSET ${offset}
  `;

  const countSoql = `
    SELECT COUNT() FROM Product_Custom_Object__c ${where}
  `;

  try {
    const { salesforceQuery, salesforceCount } = await import('@/app/lib/salesforce');
    const [products, total] = await Promise.all([
      salesforceQuery(soql),
      salesforceCount(countSoql),
    ]);
    return Response.json({ products, total, page });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
