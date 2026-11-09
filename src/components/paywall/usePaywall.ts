import {useState} from 'react';
import type {PaywallResponse} from '../../types/paywall';

export function usePaywall() {
  const [paywall, setPaywall] = useState<PaywallResponse | null>(null);

  const showPaywall = (data: PaywallResponse) => {
    setPaywall(data);
  };

  const closePaywall = () => setPaywall(null);

  return {paywall, showPaywall, closePaywall};
}
