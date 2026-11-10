import {fetchWithAuth} from '../../../lib/fetchWithAuth';
import {
  getTextAnalysisConsent,
  getTextOceanEstimate,
  setTextAnalysisConsent,
  runTextOceanEstimate,
} from './useTextPersonality';

jest.mock('../../../lib/fetchWithAuth', () => ({fetchWithAuth: jest.fn()}));
const mockedFetch = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

describe('text-derived OCEAN API contract', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reads consent status', async () => {
    const value = {enabled: false, policyVersion: 'ocean-text-v1', grantedAt: null, revokedAt: null};
    mockedFetch.mockResolvedValueOnce({data: value} as any);
    await expect(getTextAnalysisConsent()).resolves.toEqual(value);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/text-analysis-consent');
  });

  it('reads the latest stored estimate from the consent-gated route', async () => {
    const value = {enabled: true, assessment: {status: 'text_estimate_uncalibrated'}};
    mockedFetch.mockResolvedValueOnce(value as any);
    await expect(getTextOceanEstimate()).resolves.toEqual(value);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/ocean/text-estimate');
  });

  it('records explicit consent changes', async () => {
    const value = {enabled: true, policyVersion: 'ocean-text-v1'};
    mockedFetch.mockResolvedValueOnce({data: value} as any);
    await expect(setTextAnalysisConsent(true)).resolves.toEqual(value);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/text-analysis-consent', {
      method: 'PATCH',
      body: JSON.stringify({enabled: true}),
    });
  });

  it('requests an estimate only through the consent-protected endpoint', async () => {
    const value = {status: 'insufficient_data', matchingEligible: false};
    mockedFetch.mockResolvedValueOnce({data: value} as any);
    await expect(runTextOceanEstimate()).resolves.toEqual(value);
    expect(mockedFetch).toHaveBeenCalledWith('/personality/ocean/text-estimate', {
      method: 'POST',
    });
  });
});
