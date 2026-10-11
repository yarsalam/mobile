import {fetchWithAuth} from '../../lib/fetchWithAuth';

// Active bundles are read from ProductBundle by the backend.
export const fetchPublicProducts = () => fetchWithAuth('/product/public');

// Purchases are made with wallet balance through POST /payments/buy/:bundleCode.
// This function deliberately accepts a bundle code (not a database product ID).
export const startPayment = (bundleCode: string) =>
  fetchWithAuth(`/payments/buy/${encodeURIComponent(bundleCode)}`, {
    method: 'POST',
  });

export const buyProductWithWallet = (bundleCode: string) =>
  fetchWithAuth(`/payments/buy/${encodeURIComponent(bundleCode)}`, {
    method: 'POST',
  });
