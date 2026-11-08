import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import apiClient from '../../client';

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
  input?: {
    profileCharacters: number;
    ownMessageCount: number;
    totalCharacters: number;
  };
  scores: Partial<
    Record<
      'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism',
      OceanTextDimension | null
    >
  >;
  limitations: string[];
}

export interface OceanTextEstimateResponse {
  enabled: boolean;
  assessment: OceanTextAssessment | null;
}

const consentKey = ['personality', 'text-analysis-consent'];
const estimateKey = ['personality', 'ocean', 'text-estimate'];

export const usePersonalityTextConsent = () =>
  useQuery<PersonalityTextConsent>({
    queryKey: consentKey,
    queryFn: async () => {
      const {data} = await apiClient.get('/personality/text-analysis-consent');
      return data;
    },
  });

export const usePersonalityTextEstimate = (enabled: boolean) =>
  useQuery<OceanTextEstimateResponse>({
    queryKey: estimateKey,
    queryFn: async () => {
      const {data} = await apiClient.get('/personality/ocean/text-estimate');
      return data;
    },
    enabled,
  });

export const useSetPersonalityTextConsent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const {data} = await apiClient.patch('/personality/text-analysis-consent', {
        enabled,
      });
      return data as PersonalityTextConsent;
    },
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
    mutationFn: async () => {
      const {data} = await apiClient.post('/personality/ocean/text-estimate');
      return data as OceanTextAssessment;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: estimateKey});
    },
  });
};
