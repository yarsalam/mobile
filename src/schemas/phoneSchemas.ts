// schemas/phoneSchemas.ts
import {z} from 'zod';

export const changePhoneSchema = z.object({
  phone: z.string().min(10, 'شماره معتبر نیست'),
});

export const verifyPhoneSchema = z.object({
  phone: z.string(),
  code: z.string().length(4, 'کد باید ۴ رقمی باشد'),
});

export type ChangePhoneData = z.infer<typeof changePhoneSchema>;
export type VerifyPhoneData = z.infer<typeof verifyPhoneSchema>;
