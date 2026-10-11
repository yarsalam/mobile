import { useState } from "react";

export function usePaywall() {
  const [paywall, setPaywall] = useState<PaywallResponse | null>(null);

  const showPaywall = (data: PaywallResponse) => {
    setPaywall(data);
  };

  const closePaywall = () => setPaywall(null);

  return { paywall, showPaywall, closePaywall };
}