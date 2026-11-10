import {requestReplySuggestionConsent} from './requestReplySuggestionConsent';

describe('reply suggestion external AI consent', () => {
  it('discloses the exact conversation data sent before confirming generation', () => {
    const showModal = jest.fn();
    const hideModal = jest.fn();
    const onConfirm = jest.fn();

    requestReplySuggestionConsent({showModal, hideModal, onConfirm});

    expect(showModal).toHaveBeenCalledTimes(1);
    const [title, message, buttons] = showModal.mock.calls[0] as [
      string,
      string,
      Array<{text: string; onPress: () => void}>,
    ];
    expect(title).toContain('تأیید');
    expect(message).toContain('آخرین پیام دریافتی');
    expect(message).toContain('حداکثر ۵ پیام قبلی');
    expect(message).toContain('هوش مصنوعی بیرونی');
    expect(message).toContain('سیاست همان سرویس');
    expect(message).toContain('ارسال پیام با تأیید خود شما');

    expect(onConfirm).not.toHaveBeenCalled();
    expect(buttons).toHaveLength(2);
  });

  it('does not call the AI provider when the user cancels', () => {
    const showModal = jest.fn();
    const hideModal = jest.fn();
    const onConfirm = jest.fn();

    requestReplySuggestionConsent({showModal, hideModal, onConfirm});

    const buttons = showModal.mock.calls[0][2] as Array<{
      text: string;
      onPress: () => void;
    }>;
    buttons[0].onPress();

    expect(hideModal).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls the AI provider only after explicit confirmation', () => {
    const showModal = jest.fn();
    const hideModal = jest.fn();
    const onConfirm = jest.fn();

    requestReplySuggestionConsent({showModal, hideModal, onConfirm});

    const buttons = showModal.mock.calls[0][2] as Array<{
      text: string;
      onPress: () => void;
    }>;
    buttons[1].onPress();

    expect(hideModal).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
