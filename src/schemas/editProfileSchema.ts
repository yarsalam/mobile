import {z} from 'zod';

export const editProfileSchema = z.object({
  nickname: z.string().min(3, 'حداقل ۳ کاراکتر').max(7, 'حداکثر ۷ کاراکتر'),
  birth_day: z.string().min(1, 'انتخاب کنید'),
  birth_month: z.string().min(1, 'انتخاب کنید'),
  birth_year: z.string().min(1, 'انتخاب کنید'),
  marital: z.string().min(1, 'انتخاب کنید'),
  province: z.string().min(1, 'انتخاب کنید'),
  city: z.string().min(1, 'انتخاب کنید'),
  nationality: z.string().min(1, 'انتخاب کنید'),
  employment: z.string().min(1, 'انتخاب کنید'),
  education: z.string().min(1, 'انتخاب کنید'),
  weight: z.string().min(1, 'انتخاب کنید'),
  height: z.string().min(1, 'انتخاب کنید'),
  religion: z.string().min(1, 'انتخاب کنید'),
  health: z.string().min(1, 'انتخاب کنید'),
  values_partner: z.array(z.string()).min(1).max(3),
  partner_about: z.string().optional(),
  hobbies_partner: z.array(z.string()).min(1).max(5),
  aboutme: z.string().optional(),
  values_self: z.array(z.string()).min(1).max(3),
  hobbies_self: z.array(z.string()).min(1).max(5),
});

export type EditProfileData = z.infer<typeof editProfileSchema>;
