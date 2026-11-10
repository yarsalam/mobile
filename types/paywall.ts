export interface PaywallAction {
  product: 'boost' | 'credits' | 'vip' | 'bundle' | string;
  productId: string;
  label: string;
  highlight?: boolean;
}

export interface PaywallResponse {
  title: string;
  description: string;
  primaryAction: PaywallAction;
  secondaryAction?: PaywallAction;
}
