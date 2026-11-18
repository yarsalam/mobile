import React from 'react';
import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../../types/rootStackParamList';
import type {ProductOption} from '../../types/productsType';
import { ScrollView } from 'react-native';
import GlobalText from '../components/GlobalText';
import { usePublicProducts } from '../api/mutations/product/useProducts';
import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const { data: products } = usePublicProducts();
  const route = useRoute<RouteProp<RootStackParamList, 'Products'>>();
  const promotionId = route.params?.promotionId;
  const manualPromotionId = route.params?.manualPromotionId;
  const manualBundleCode = route.params?.bundleCode;
  const campaignFlow = Boolean(manualPromotionId && manualBundleCode);

  // فرض می‌کنیم پاسخ سرور یک آبجکت با سه آرایه است:
  // { boost: ProductOption[], credits: ProductOption[], vip: ProductOption[] }
  // در غیر اینصورت بر اساس فیلد type فیلتر کنید.

  const boostOptions = products?.boost || [];
  const creditOptions = products?.credits || [];
  const vipOptions = products?.vip || [];

  return (
    <MainLayout>
      <SectionWithLine text="فروشگاه" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {(!campaignFlow || boostOptions.some((option: ProductOption) => option.id === manualBundleCode)) && <ProductCard
          title="Boost"
          description="پروفایلت رو برای ۳۰ دقیقه به همه نشون بده و شانس مچ شدن رو چند برابر کن!"
          icon="🚀"
          options={boostOptions}
          promotionId={promotionId}
          manualPromotionId={manualPromotionId}
          manualBundleCode={manualBundleCode}
        />}
        {(!campaignFlow || creditOptions.some((option: ProductOption) => option.id === manualBundleCode)) && <ProductCard
          title="Credits"
          description="با اعتبار می‌تونی پیام بفرستی، ویو کنی یا سوپرلایک بزنی بدون محدودیت"
          icon="🔋"
          options={creditOptions}
          promotionId={promotionId}
          manualPromotionId={manualPromotionId}
          manualBundleCode={manualBundleCode}
        />}
        {(!campaignFlow || vipOptions.some((option: ProductOption) => option.id === manualBundleCode)) && <ProductCard
          title="VIP"
          description="پیام نامحدود، ویو نامحدود، بدون نیاز به اعتبار، بوست ماهانه رایگان، اولویت نمایش"
          icon="⭐"
          options={vipOptions}
          promotionId={promotionId}
          manualPromotionId={manualPromotionId}
          manualBundleCode={manualBundleCode}
        />}
        {campaignFlow &&
          ![...boostOptions, ...creditOptions, ...vipOptions].some(
            (option: ProductOption) => option.id === manualBundleCode,
          ) && (
            <GlobalText style={{textAlign: 'center', margin: 16, color: '#dc2626'}}>
              بسته مشمول این تخفیف دیگر در فروشگاه فعال نیست.
            </GlobalText>
          )}
      </ScrollView>
    </MainLayout>
  );
};

export default Products;