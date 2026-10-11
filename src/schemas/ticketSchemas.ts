import {z} from 'zod';

export const createTicketSchema = z.object({
  title: z
    .string({
      required_error: 'عنوان الزامی است',
    })
    .min(5, 'عنوان باید حداقل ۵ کاراکتر باشد'),

  description: z
    .string({
      required_error: 'توضیحات الزامی است',
    })
    .min(10, 'توضیحات باید حداقل ۱۰ کاراکتر باشد'),

  category: z
    .string({
      required_error: 'دسته‌بندی الزامی است',
    })
    .min(1, 'دسته‌بندی الزامی است'),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
