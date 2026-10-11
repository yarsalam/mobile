
export const getAgeFromShamsiBirthYear = (
  birthYear?: string,
): number | null => {
  if (!birthYear) return null;

  const englishYear = Number(
    birthYear
      .replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 0x06f0))
      .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660)),
  );

  if (isNaN(englishYear)) return null;

  const birthGregorian = englishYear + 621;
  const currentYear = new Date().getFullYear();
  return currentYear - birthGregorian;
};
