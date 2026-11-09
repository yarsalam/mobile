import {navigationRef} from './navigationRef';

export type PaymentProduct = 'boost' | 'credits' | 'vip' | 'bundle' | string;

/** Route a paywall action to the existing server-priced deposit flow. */
export function startPayment(_product: PaymentProduct, productId: string) {
  if (!productId?.trim()) {
    throw new Error('شناسه محصول برای شروع پرداخت معتبر نیست.');
  }
  if (!navigationRef.isReady()) {
    throw new Error('ناوبری برنامه هنوز آماده نیست. دوباره تلاش کنید.');
  }
  navigationRef.navigate('PaymentMethod', {productId: String(productId)});
}
