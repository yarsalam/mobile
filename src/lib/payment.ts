// import {navigate} from '../navigation/rootNavigation';

// export type PaymentProduct = 'boost' | 'credits' | 'vip' | 'bundle';

// export interface ProductPricing {
//   productId: string;
//   productCode: string;
//   amountRials: number; // برای card_to_card
//   amountCents: number; // برای crypto (500 = 5 USDT)
// }

// /**
//  * نقطه مرکزی شروع پرداخت.
//  * به جای redirect مستقیم به درگاه، به صفحه انتخاب روش می‌رود.
//  */
// export function startPayment(product: PaymentProduct, productId: string) {
//   navigate('PaymentMethod', {product, productId});
// }
