export interface ReplySuggestionConsentHandlers {
  showModal: (
    title: string,
    message: string,
    buttons: Array<{
      text: string;
      onPress: () => void;
      style?: 'cancel' | 'destructive';
    }>,
  ) => void;
  hideModal: () => void;
  onConfirm: () => void;
}

/**
 * Explicitly disclose the external AI processing performed by the backend:
 * the latest incoming message and up to five prior messages from this chat
 * are sent to the configured external AI provider to produce a draft reply.
 */
export function requestReplySuggestionConsent({
  showModal,
  hideModal,
  onConfirm,
}: ReplySuggestionConsentHandlers): void {
  showModal(
    'تأیید ارسال متن گفتگو به هوش مصنوعی',
    'برای ساخت پیشنهاد پاسخ، آخرین پیام دریافتی و حداکثر ۵ پیام قبلی همین گفتگو به سرویس هوش مصنوعی بیرونیِ پیکربندی‌شده در یارسلام ارسال و پردازش می‌شود. نحوه نگهداری یا پردازش بعدی متن در سمت ارائه‌دهنده تابع سیاست همان سرویس است. پیشنهاد فقط در کادر پیش‌نویس قرار می‌گیرد و ارسال پیام با تأیید خود شما انجام می‌شود. اگر با ارسال متن گفتگو به سرویس بیرونی موافق نیستید، انصراف را بزنید.',
    [
      {text: 'انصراف', style: 'cancel', onPress: hideModal},
      {
        text: 'تأیید و ساخت پیشنهاد',
        onPress: () => {
          hideModal();
          onConfirm();
        },
      },
    ],
  );
}
