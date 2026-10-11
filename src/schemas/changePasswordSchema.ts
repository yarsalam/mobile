import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(3, 'رمز عبور حداقل ۳ کاراکتر است')
      .max(12, 'رمز عبور حداکثر ۱۲ کاراکتر است')
      .regex(
        /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9۰-۹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/,
        'رمز شامل حروف، اعداد یا علائم نامعتبر است'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
