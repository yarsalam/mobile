import {getModerationDecision} from './moderationDecision';

describe('getModerationDecision', () => {
  it('allows only an explicit low-risk allow result', () => {
    expect(getModerationDecision({data: {allowed: true, severity: 'low'}})).toBe('allow');
  });

  it('requires confirmation for medium-risk content', () => {
    expect(getModerationDecision({data: {allowed: false, severity: 'medium'}})).toBe('confirm');
  });

  it('blocks high-risk content', () => {
    expect(getModerationDecision({data: {allowed: false, severity: 'high'}})).toBe('block');
  });

  it('fails closed when moderation is pending or unavailable', () => {
    expect(getModerationDecision({data: {allowed: false, severity: 'low'}})).toBe('block');
    expect(getModerationDecision(null)).toBe('block');
  });
});
