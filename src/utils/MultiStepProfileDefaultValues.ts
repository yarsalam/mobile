import {z} from 'zod';
import {multiStepProfileSchema} from '../schemas/authSchemas';

export const MultiStepProfileDefaultValues: z.infer<
  typeof multiStepProfileSchema
> = {
  nickname: '',
  birthDate: {
    day: '',
    month: '',
    year: '',
  },
  marital: '',
  province: '',
  city: '',
  nationality: '',

  // Step 2
  employment: '',
  education: '',
  weight: '',
  height: '',
  health: '',
  religion: '',

  // Step 3 — درباره همسر ایده‌آل
  partner_about: '',
  values_partner: [],
  hobbies_partner: [],

  // Step 4 — درباره خودم
  aboutme: '',
  values_self: [],
  hobbies_self: [],

  // security
  password: '',
  confirmPassword: '',
  phone:'',
};
