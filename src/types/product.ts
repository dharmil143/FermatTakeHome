export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    rating: number;
    inStock: boolean;
    imageUrl: string;
    tags: string[];
    purchaseCount?: number; // For popularity tracking
    coPurchaseCount?: number; // For recommendations
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface Order {
    orderId: string;
    date: string;
    customerId: string;
    items: OrderItem[];
    total: number;
}

export interface FilterOptions {
    search: string;
    categories: string[];
    brands: string[];
    tags: string[];
    availability: string[];
    minPrice: number;
    maxPrice: number;
    sortBy: 'price-asc' | 'price-desc' | 'rating' | 'popular' | '';
    page: number;
    limit: number;
}
