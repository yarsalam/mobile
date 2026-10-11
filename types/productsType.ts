export type ProductType = 'boost' | 'credits' | 'vip';

export interface ProductOption {
  id: string; // backend productId
  label: string;
  price: number;
  meta?: any; // boostCount, creditsAmount, vipDuration
}
