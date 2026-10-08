export interface RetailStore {
  id: string;
  storeNumber: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  distanceMiles: number;
  phone: string;
  hours: string;
  inStockCount: number;
  totalCatalogCount: number;
  hasPickup: boolean;
  hasExpressDelivery: boolean;
  deliveryTimeEstimate: string;
  pickupTimeEstimate: string;
  badge?: string;
}

export const MOCK_RETAIL_STORES: RetailStore[] = [
  {
    id: 'store-402',
    storeNumber: 'Store #402',
    name: 'Seattle Downtown Flagship',
    address: '500 Pine St',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    distanceMiles: 0.8,
    phone: '(206) 555-0142',
    hours: 'Open today until 10:00 PM',
    inStockCount: 12,
    totalCatalogCount: 12,
    hasPickup: true,
    hasExpressDelivery: true,
    deliveryTimeEstimate: '⚡ 2-Hour Courier Delivery',
    pickupTimeEstimate: 'Ready in 1 hour • Aisle Desk',
    badge: 'Nearest Store • Fast Fulfillment'
  },
  {
    id: 'store-205',
    storeNumber: 'Store #205',
    name: 'Capitol Hill Urban Market',
    address: '1201 E Pike St',
    city: 'Seattle',
    state: 'WA',
    zip: '98122',
    distanceMiles: 1.4,
    phone: '(206) 555-0188',
    hours: 'Open today until 11:00 PM',
    inStockCount: 10,
    totalCatalogCount: 12,
    hasPickup: true,
    hasExpressDelivery: true,
    deliveryTimeEstimate: '⚡ 1-Hour Bike Courier',
    pickupTimeEstimate: 'Ready in 30 mins • Express Counter'
  },
  {
    id: 'store-108',
    storeNumber: 'Store #108',
    name: 'Bellevue Square Experience Hub',
    address: '575 Bellevue Way NE',
    city: 'Bellevue',
    state: 'WA',
    zip: '98004',
    distanceMiles: 4.2,
    phone: '(425) 555-0199',
    hours: 'Open today until 9:00 PM',
    inStockCount: 11,
    totalCatalogCount: 12,
    hasPickup: true,
    hasExpressDelivery: true,
    deliveryTimeEstimate: 'Same-Day Delivery by 7 PM',
    pickupTimeEstimate: 'Ready in 1 hour • Curbside Bay 3'
  },
  {
    id: 'store-312',
    storeNumber: 'Store #312',
    name: 'University Village Lifestyle Store',
    address: '2623 NE University Village St',
    city: 'Seattle',
    state: 'WA',
    zip: '98105',
    distanceMiles: 5.1,
    phone: '(206) 555-0164',
    hours: 'Open today until 9:30 PM',
    inStockCount: 11,
    totalCatalogCount: 12,
    hasPickup: true,
    hasExpressDelivery: true,
    deliveryTimeEstimate: 'Same-Day Delivery by 8 PM',
    pickupTimeEstimate: 'Ready in 1 hour • Service Hub'
  }
];
