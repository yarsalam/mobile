import React from 'react';
import { ScrollView } from 'react-native';
import { usePublicProducts } from '../api/mutations/product/useProducts';
import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const { data: products } = usePublicProducts();

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
        <ProductCard
          title="Boost"
          description="پروفایلت رو برای ۳۰ دقیقه به همه نشون بده و شانس مچ شدن رو چند برابر کن!"
          icon="🚀"
          options={boostOptions}
        />
        <ProductCard
          title="Credits"
          description="با اعتبار می‌تونی پیام بفرستی، ویو کنی یا سوپرلایک بزنی بدون محدودیت"
          icon="🔋"
          options={creditOptions}
        />
        <ProductCard
          title="VIP"
          description="پیام نامحدود، ویو نامحدود، بدون نیاز به اعتبار، بوست ماهانه رایگان، اولویت نمایش"
          icon="⭐"
          options={vipOptions}
        />
      </ScrollView>
    </MainLayout>
  );
};

export default Products;