import {fetchWithAuth} from '../../../lib/fetchWithAuth';
import {
  analyzePersonalityText,
  getPersonalityTextConsent,
  getPersonalityTextEstimate,
  setPersonalityTextConsent,
} from './personalityTextHooks';

jest.mock('../../../lib/fetchWithAuth', () => ({fetchWithAuth: jest.fn()}));
const mockedFetch = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

describe('personality text-analysis API contract', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reads consent state', async () => {
    const response = {enabled: false, policyVersion: 'ocean-text-v1', grantedAt: null, revokedAt: null};
    mockedFetch.mockResolvedValueOnce(response as any);
    await expect(getPersonalityTextConsent()).resolves.toEqual(response);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/text-analysis-consent');
  });

  it('reads the stored estimate only through the consent-gated read endpoint', async () => {
    const response = {enabled: true, assessment: {status: 'text_estimate_uncalibrated'}};
    mockedFetch.mockResolvedValueOnce(response as any);
    await expect(getPersonalityTextEstimate()).resolves.toEqual(response);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/ocean/text-estimate');
  });

  it('records explicit consent changes', async () => {
    const response = {enabled: true, policyVersion: 'ocean-text-v1'};
    mockedFetch.mockResolvedValueOnce(response as any);
    await expect(setPersonalityTextConsent(true)).resolves.toEqual(response);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/text-analysis-consent', {
      method: 'PATCH',
      body: JSON.stringify({enabled: true}),
    });
  });

  it('requests a text estimate only through the existing consent-protected endpoint', async () => {
    const response = {status: 'insufficient_data', matchingEligible: false};
    mockedFetch.mockResolvedValueOnce(response as any);
    await expect(analyzePersonalityText()).resolves.toEqual(response);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/ocean/text-estimate', {method: 'POST'});
  });
});
