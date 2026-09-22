export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  status: string;
  email?: string;
  phone?: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: number;
  maxProducts?: number;
  maxOrders?: number;
  features: string;
  isPopular: boolean;
}

export interface Payment {
  id: string;
  storeId: string;
  planId: string;
  amount: number;
  transactionRef: string;
  receiptUrl?: string;
  status: string;
  adminNote?: string;
  createdAt: string;
  plan?: Plan;
  store?: { id: string; name: string; slug: string; email?: string };
}

export interface Subscription {
  status: string;
  plan?: Plan;
  endDate?: string;
  daysLeft: number;
}
