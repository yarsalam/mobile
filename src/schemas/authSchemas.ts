import {z} from 'zod';

// مرحله اول ثبت‌نام (موبایل، جنسیت، نوع ازدواج)
export const registerStep1Schema = z.object({
  phone: z
    .string()
    .nonempty('شماره موبایل خود را وارد کنید')
    .min(11, 'شماره موبایل نمیتواند کمتر از ۱۱ رقم باشد')
    .max(11, 'شماره موبایل نمیتواند بیشتر از ۱۱ رقم باشد')
    .regex(
      /^(09|\u06F0\u06F9)[0-9\u06F0-\u06F9]{9}$/,
      'شماره موبایل باید با 09 یا ۰۹ شروع شود',
    ),
  gender: z.string().nonempty('جنسیت خود را انتخاب کنید'),
});

export const sendOtpWithChannelSchema = z.object({
  phone: z.string().nonempty(),
  channel: z.enum(['telegram', 'whatsapp']),
});

export const selectChannelSchema = z.object({
  channel: z.enum(['whatsapp', 'telegram'], {
    required_error: 'انتخاب روش دریافت کد اجباری است',
    invalid_type_error: 'یکی از گزینه‌ها را انتخاب کنید',
  }),
});

// مرحله تأیید کد
export const verifyTelegramCodeSchema = z.object({
  phone: z.string().nonempty(),
  code: z
    .string()
    .nonempty('کد ارسال شده به ربات تلگرام را وارد کنید')
    .min(4, 'کد تأیید باید ۴ رقم باشد'),
  channel: z.literal('telegram'),
});

export const telegramOtpFormSchema = z.object({
  code: z
    .string()
    .nonempty('کد ارسال شده را وارد کنید')
    .min(4, 'کد باید ۴ رقمی باشد'),
});

export const loginSchema = z.object({
  phone: z
    .string({required_error: 'شماره موبایل را وارد کنید'})
    .nonempty('شماره موبایل نمیتواند خالی باشد')
    .min(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .max(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .regex(
      /^(09|\u06F0\u06F9)[0-9\u06F0-\u06F9]{9}$/,
      'شماره موبایل باید با 09 یا ۰۹ شروع شود',
    ),
  password: z
    .string({required_error: 'رمز عبور را وارد کنید'})
    .nonempty('رمز عبور نمیتوانپ خالی باشد کنید'),
});

const baseMultiStepProfileSchema = z.object({
  phone: z.string(),
  nickname: z
    .string({required_error: 'نام کاربری الزامی است'})
    .min(2, 'نام کاربری حداقل 3 حرفی باشد')
    .max(7, 'نام کاربری حداکثر 7 حرفی باشد')
    .regex(/^[\u0600-\u06FF\s]+$/, 'نام کاربری باید فارسی باشد'),
  birthDate: z.object({
    day: z.string().min(1, 'روز را انتخاب کنید'),
    month: z.string().min(1, 'ماه را انتخاب کنید'),
    year: z.string().min(1, 'سال را انتخاب کنید'),
  }),
  marital: z.string().min(1, 'وضعیت تاهل را انتخاب کنید'),
  province: z.string().min(1, 'استان محل زندگی را وارد کنید'),
  city: z.string().min(1, 'شهر محل زندگی را وارد کنید'),
  nationality: z.string().min(1, 'قومیت را وارد کنید'),
  employment: z.string().min(1, 'وضعیت اشتغال را انتخاب کنید'),
  education: z.string().min(1, 'مدرک تحصیلی را انتخاب کنید'),
  weight: z.string().min(1, 'وزن را انتخاب کنید'),
  height: z.string().min(1, 'قد را انتخاب کنید'),
  religion: z.string().min(1, 'دین و مذهب را انتخاب کنید'),
  health: z.string().min(1, 'وضعیت سلامت را انتخاب کنید'),
  values_partner: z
    .array(z.string())
    .max(3, 'حداکثر ۳ اولویت شخصیتی را می‌توانید انتخاب کنید')
    .min(1, 'اولویت شخصیتی نمیتواند خالی باشد'),
  partner_about: z
    .string({required_error: 'درباره همراه من الزامی است'})
    .min(10, 'حداقل ۱۰ کاراکتر درباره همسر ایده آلتان بنویسید')
    .max(500, 'درباره همسرم نباید بیشتر از 500 کاراکتر باشد')
    .regex(
      /^[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\u06F0-\u06F9\s‌،.,؛!؟]+$/,
      'فقط فارسی مجاز است',
    ),
  hobbies_partner: z
    .array(z.string({required_error: 'سبک زندگی الزامی است'}))
    .max(5, 'حداکثر ۵ سبک زندگی را می‌توانید انتخاب کنید')
    .min(1, 'سبک زندگی نمیتواند خالی باشد'),
  aboutme: z
    .string({required_error: 'درباره من الزامی است'})
    .min(10, 'حداقل ۱۰ کاراکتر درباره خودتان بنویسید')
    .max(500, 'درباره خودم نباید بیشتر از 500 کاراکتر باشد')
    .regex(/^[\u0600-\u06FF\s]+$/, 'درباره خودم را باید به فارسی باشد'),
  values_self: z
    .array(z.string())
    .max(3, 'حداکثر ۳ اولویت شخصیتی را می‌توانید انتخاب کنید')
    .min(1, 'اولویت شخصیتی نمیتواند خالی باشد'),
  hobbies_self: z
    .array(z.string({required_error: 'سبک زندگی الزامی است'}))
    .max(5, 'حداکثر ۵ سبک زندگی را می‌توانید انتخاب کنید')
    .min(1, 'سبک زندگی نمیتواند خالی باشد'),
  password: z
    .string({required_error: 'رمز ورود الزامی است'})
    .min(3, 'رمز ورود حداقل باید ۳ کاراکتر داشته باشد')
    .max(12, 'حداکثر ۱۲ کاراکتر برای رمز ورود مجاز است'),
  confirmPassword: z.string({
    required_error: 'تکرار رمز ورود الزامی است',
  }),
});

// 👇 اسکیمای اصلی با refine
export const multiStepProfileSchema = baseMultiStepProfileSchema.refine(
  data => data.password === data.confirmPassword,
  {
    path: ['confirmPassword'],
    message: 'رمز عبور و تکرار آن یکسان نیست',
  },
);

// 👇 برای ارسال به سرور بدون confirmPassword
export const multiStepProfilePayloadSchema = baseMultiStepProfileSchema
  .omit({confirmPassword: true, phone: true})
export type RegisterStep1Type = z.infer<typeof registerStep1Schema>;
export type SelectChannelType = z.infer<typeof selectChannelSchema>;
export type MultiStepProfileForm = z.infer<typeof multiStepProfileSchema>;
export type MultiStepProfilePayload = z.infer<
  typeof multiStepProfilePayloadSchema
>;
