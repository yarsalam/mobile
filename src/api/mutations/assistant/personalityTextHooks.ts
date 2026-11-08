import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export interface PersonalityTextConsent {
  enabled: boolean;
  policyVersion: string | null;
  grantedAt: string | null;
  revokedAt: string | null;
}
export interface OceanTextDimension {
  score: number;
  confidence: number;
  evidence: string[];
  confidenceCalibration: 'uncalibrated';
}
export interface OceanTextAssessment {
  status: string;
  source: string;
  assessedAt?: string;
  matchingEligible: false;
  calibrated: false;
  minimumTextCharacters?: number;
  input?: {profileCharacters: number; ownMessageCount: number; totalCharacters: number};
  scores: Partial<Record<'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism', OceanTextDimension | null>>;
  limitations: string[];
}
export interface OceanTextEstimateResponse {
  enabled: boolean;
  assessment: OceanTextAssessment | null;
}
const consentKey = ['personality', 'text-analysis-consent'];
const estimateKey = ['personality', 'ocean', 'text-estimate'];

export const getPersonalityTextConsent = () =>
  fetchWithAuth('/personality/text-analysis-consent') as Promise<PersonalityTextConsent>;
export const getPersonalityTextEstimate = () =>
  fetchWithAuth('/personality/ocean/text-estimate') as Promise<OceanTextEstimateResponse>;
export const setPersonalityTextConsent = (enabled: boolean) =>
  fetchWithAuth('/personality/text-analysis-consent', {
    method: 'PATCH',
    body: JSON.stringify({enabled}),
  }) as Promise<PersonalityTextConsent>;
export const analyzePersonalityText = () =>
  fetchWithAuth('/personality/ocean/text-estimate', {method: 'POST'}) as Promise<OceanTextAssessment>;

export const usePersonalityTextConsent = () =>
  useQuery<PersonalityTextConsent>({queryKey: consentKey, queryFn: getPersonalityTextConsent});
export const usePersonalityTextEstimate = (enabled: boolean) =>
  useQuery<OceanTextEstimateResponse>({queryKey: estimateKey, queryFn: getPersonalityTextEstimate, enabled});

export const useSetPersonalityTextConsent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setPersonalityTextConsent,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({queryKey: consentKey}),
        queryClient.invalidateQueries({queryKey: estimateKey}),
      ]);
    },
  });
};
export const useAnalyzePersonalityText = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: analyzePersonalityText,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: estimateKey});
    },
  });
};
