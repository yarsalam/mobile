import apiClient from '../../client';
import {
  analyzePersonalityText,
  getPersonalityTextConsent,
  getPersonalityTextEstimate,
  setPersonalityTextConsent,
} from './personalityTextHooks';

jest.mock('../../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedClient = apiClient as jest.Mocked<typeof apiClient>;

describe('personality text-analysis API contract', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reads consent state', async () => {
    const response = {enabled: false, policyVersion: 'ocean-text-v1', grantedAt: null, revokedAt: null};
    mockedClient.get.mockResolvedValueOnce({data: response} as any);

    await expect(getPersonalityTextConsent()).resolves.toEqual(response);
    expect(mockedClient.get).toHaveBeenCalledWith('/personality/text-analysis-consent');
  });

  it('reads the stored estimate only through the consent-gated read endpoint', async () => {
    const response = {enabled: true, assessment: {status: 'text_estimate_uncalibrated'}};
    mockedClient.get.mockResolvedValueOnce({data: response} as any);

    await expect(getPersonalityTextEstimate()).resolves.toEqual(response);
    expect(mockedClient.get).toHaveBeenCalledWith('/personality/ocean/text-estimate');
  });

  it('records explicit consent changes', async () => {
    const response = {enabled: true, policyVersion: 'ocean-text-v1'};
    mockedClient.patch.mockResolvedValueOnce({data: response} as any);

    await expect(setPersonalityTextConsent(true)).resolves.toEqual(response);
    expect(mockedClient.patch).toHaveBeenCalledWith(
      '/personality/text-analysis-consent',
      {enabled: true},
    );
  });

  it('requests a text estimate only through the existing consent-protected endpoint', async () => {
    const response = {status: 'insufficient_data', matchingEligible: false};
    mockedClient.post.mockResolvedValueOnce({data: response} as any);

    await expect(analyzePersonalityText()).resolves.toEqual(response);
    expect(mockedClient.post).toHaveBeenCalledWith('/personality/ocean/text-estimate');
  });
});
