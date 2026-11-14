import {z} from 'zod';

// مرحله اول ثبت‌نام (موبایل، جنسیت، نوع ازدواج)
export const registerStep1Schema = z.object({
  phone: z
    .string()
    .nonempty('شماره موبایل خود را وارد کنید')
    .min(11, 'شماره موبایل نمیتواند کمتر از ۱۱ رقم باشد')
    .max(11, 'شماره موبایل نمیتواند بیشتر از ۱۱ رقم باشد')
    .regex(
      /^(09|\u06F0\u06F9|\u0660\u0669)[0-9\u06F0-\u06F9\u0660-\u0669]{9}$/,
      'شماره موبایل باید با 09 یا ۰۹ شروع شود',
    ),
  gender: z.string().nonempty('جنسیت خود را انتخاب کنید'),
  acquisitionSource: z.string().max(80).optional(),
  acquisitionKeyword: z.string().max(160).nullable().optional(),
  referralCode: z.string().max(96).nullable().optional(),
  metadata: z.object({
    referralCode: z.string().max(96).nullable().optional(),
    campaign: z.string().max(160).nullable().optional(),
    campaignId: z.string().max(120).nullable().optional(),
    medium: z.string().max(80).nullable().optional(),
    landingPage: z.string().max(600).nullable().optional(),
    referrer: z.string().max(160).nullable().optional(),
  }).optional(),
  acquisition: z.object({
    firstTouch: z.object({
      source: z.string().max(80),
      medium: z.string().max(80).nullable(),
      campaign: z.string().max(160).nullable(),
      campaignId: z.string().max(120).nullable(),
      content: z.string().max(160).nullable(),
      term: z.string().max(160).nullable(),
      landingPage: z.string().max(600).nullable(),
      referrer: z.string().max(160).nullable(),
      referralCode: z.string().max(96).nullable(),
      capturedAt: z.string().datetime(),
    }),
    lastTouch: z.object({
      source: z.string().max(80),
      medium: z.string().max(80).nullable(),
      campaign: z.string().max(160).nullable(),
      campaignId: z.string().max(120).nullable(),
      content: z.string().max(160).nullable(),
      term: z.string().max(160).nullable(),
      landingPage: z.string().max(600).nullable(),
      referrer: z.string().max(160).nullable(),
      referralCode: z.string().max(96).nullable(),
      capturedAt: z.string().datetime(),
    }),
  }).optional(),
});

export const sendOtpWithChannelSchema = z.object({
  phone: z.string().nonempty(),
  channel: z.enum(['telegram', 'whatsapp']),
});

export const selectChannelSchema = z.object({
  channel: z.enum(['whatsapp', 'telegram'], {
    message: 'یکی از روش‌های دریافت کد را انتخاب کنید',
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
    .string({message: 'شماره موبایل را وارد کنید'})
    .nonempty('شماره موبایل نمیتواند خالی باشد')
    .min(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .max(11, 'شماره موبایل باید ۱۱ رقم باشد')
    .regex(
      /^(09|\u06F0\u06F9|\u0660\u0669)[0-9\u06F0-\u06F9\u0660-\u0669]{9}$/,
      'شماره موبایل باید با 09 یا ۰۹ شروع شود',
    ),
  password: z
    .string({message: 'رمز عبور را وارد کنید'})
    .nonempty('رمز عبور نمیتوانپ خالی باشد کنید'),
});

const baseMultiStepProfileSchema = z.object({
  phone: z.string(),
  nickname: z
    .string({message: 'نام کاربری الزامی است'})
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
    .string({message: 'درباره همراه من الزامی است'})
    .min(10, 'حداقل ۱۰ کاراکتر درباره همسر ایده آلتان بنویسید')
    .max(500, 'درباره همسرم نباید بیشتر از 500 کاراکتر باشد')
    .regex(
      /^[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\u06F0-\u06F9\s‌،.,؛!؟]+$/,
      'فقط فارسی مجاز است',
    ),
  hobbies_partner: z
    .array(z.string({message: 'سبک زندگی الزامی است'}))
    .max(5, 'حداکثر ۵ سبک زندگی را می‌توانید انتخاب کنید')
    .min(1, 'سبک زندگی نمیتواند خالی باشد'),
  aboutme: z
    .string({message: 'درباره من الزامی است'})
    .min(10, 'حداقل ۱۰ کاراکتر درباره خودتان بنویسید')
    .max(500, 'درباره خودم نباید بیشتر از 500 کاراکتر باشد')
    .regex(/^[\u0600-\u06FF\s]+$/, 'درباره خودم را باید به فارسی باشد'),
  values_self: z
    .array(z.string())
    .max(3, 'حداکثر ۳ اولویت شخصیتی را می‌توانید انتخاب کنید')
    .min(1, 'اولویت شخصیتی نمیتواند خالی باشد'),
  hobbies_self: z
    .array(z.string({message: 'سبک زندگی الزامی است'}))
    .max(5, 'حداکثر ۵ سبک زندگی را می‌توانید انتخاب کنید')
    .min(1, 'سبک زندگی نمیتواند خالی باشد'),
  password: z
    .string({message: 'رمز ورود الزامی است'})
    .min(3, 'رمز ورود حداقل باید ۳ کاراکتر داشته باشد')
    .max(12, 'حداکثر ۱۲ کاراکتر برای رمز ورود مجاز است'),
  confirmPassword: z.string({
    message: 'تکرار رمز ورود الزامی است',
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
