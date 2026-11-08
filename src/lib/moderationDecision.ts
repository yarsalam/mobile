export type ModerationDecision = 'allow' | 'confirm' | 'block';

/**
 * Only an explicit low-risk allow may proceed automatically.
 * Medium-risk messages require an explicit acknowledgement; all other
 * outcomes (including low-severity pending/unavailable results) fail closed.
 */
export const getModerationDecision = (result: any): ModerationDecision => {
  if (result?.data?.allowed === true) return 'allow';
  if (result?.data?.severity === 'medium') return 'confirm';
  return 'block';
};
