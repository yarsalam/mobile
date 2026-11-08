import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export interface TextAnalysisConsent {
  enabled: boolean;
  policyVersion: string | null;
  grantedAt: string | null;
  revokedAt: string | null;
}

export interface OceanDimensionEstimate {
  score: number;
  confidence: number;
  evidence: string[];
  confidenceCalibration: 'uncalibrated';
}

export interface TextOceanAssessment {
  status: string;
  source?: string;
  assessedAt?: string;
  matchingEligible: false;
  calibrated: false;
  input?: {
    profileCharacters?: number;
    ownMessageCount?: number;
    totalCharacters?: number;
  };
  scores?: Partial<Record<
    'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism',
    OceanDimensionEstimate | null
  >>;
  limitations?: string[];
}

type EstimateResponse = {
  enabled: boolean;
  assessment: TextOceanAssessment | null;
};

const CONSENT_KEY = ['personality', 'text-analysis-consent'] as const;
const ESTIMATE_KEY = ['personality', 'text-ocean-estimate'] as const;

const unwrap = <T,>(value: any): T => (value?.data ?? value) as T;

export function useTextAnalysisConsent() {
  return useQuery({
    queryKey: CONSENT_KEY,
    queryFn: async () =>
      unwrap<TextAnalysisConsent>(
        await fetchWithAuth('/personality/text-analysis-consent'),
      ),
    staleTime: 30_000,
  });
}

export function useTextOceanEstimate(enabled: boolean) {
  return useQuery({
    queryKey: ESTIMATE_KEY,
    enabled,
    queryFn: async () =>
      unwrap<EstimateResponse>(
        await fetchWithAuth('/personality/ocean/text-estimate'),
      ),
    staleTime: 30_000,
  });
}

export function useSetTextAnalysisConsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (enabled: boolean) =>
      unwrap<TextAnalysisConsent>(
        await fetchWithAuth('/personality/text-analysis-consent', {
          method: 'PATCH',
          body: JSON.stringify({enabled}),
        }),
      ),
    onSuccess: async (consent) => {
      queryClient.setQueryData(CONSENT_KEY, consent);
      if (!consent.enabled) {
        queryClient.setQueryData(ESTIMATE_KEY, {
          enabled: false,
          assessment: null,
        });
      }
      await queryClient.invalidateQueries({queryKey: ESTIMATE_KEY});
    },
  });
}

export function useRunTextOceanEstimate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      unwrap<TextOceanAssessment>(
        await fetchWithAuth('/personality/ocean/text-estimate', {
          method: 'POST',
        }),
      ),
    onSuccess: async (assessment) => {
      queryClient.setQueryData(ESTIMATE_KEY, {
        enabled: true,
        assessment,
      });
      await queryClient.invalidateQueries({queryKey: ESTIMATE_KEY});
    },
  });
}
