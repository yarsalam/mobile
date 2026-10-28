export const convertPersianNumbersToEnglish = (text: string): string => {
  const persianNumbers: {[key: string]: string} = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };

  return text.replace(/[۰-۹٠-٩]/g, char => {
    if (persianNumbers[char] !== undefined) {
      return persianNumbers[char];
    }

    // Arabic-Indic digits (٠١٢٣...) are also used by some keyboards.
    return String(char.charCodeAt(0) - 0x0660);
  });
};
