import {z} from 'zod';

export const changeMobileSchema = z
  .object({
    phone: z
      .string()
      .nonempty('شماره موبایل جدید را وارد کنید')
      .min(11, 'شماره موبایل نمیتواند کمتر از ۱۱ رقم باشد')
      .max(11, 'شماره موبایل نمیتواند بیشتر از ۱۱ رقم باشد')
      .regex(
        /^(09|\u06F0\u06F9)[0-9\u06F0-\u06F9]{9}$/,
        'شماره موبایل باید با 09 یا ۰۹ شروع شود',
      ),
    confirmPhone: z.string()
    .nonempty('تکرار شماره موبایل الزامیست'),
  })
  .refine(data => data.phone === data.confirmPhone, {
    message: 'شماره موبایل جدید و تکرار آن یکسان نیستند',
    path: ['confirmPhone'],
  });

export type ChangeMobileData = z.infer<typeof changeMobileSchema>;
