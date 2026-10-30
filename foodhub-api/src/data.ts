export interface Restaurant { id: number; name: string; area: string }
export interface Order { id: string; restaurantId: number; items: string[]; status: string }

export const RESTAURANTS: Restaurant[] = [
    { id: 1, name: 'Num Banh Chok Corner', area: 'Daun Penh' },
    { id: 2, name: 'Lok Lak House', area: 'BKK1' },
    { id: 3, name: 'Amok Garden', area: 'Toul Kork' },
];
export const ORDERS = new Map<string, Order>();        // order id -> order
export const IDEMPOTENCY = new Map<string, string>();  // idempotency key -> order id
export const SESSIONS = new Map<string, string>();     // session id -> username
