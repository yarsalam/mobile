export interface User {
  id: number;
  nickname: string;
  phone: string;
  isCompleted: boolean; // این فیلد جدید رو اضافه کن
  // اضافه کردن دیگر فیلدهای مربوط به کاربر
  [key: string]: any; // برای دیگر فیلدهای احتمالی
}
