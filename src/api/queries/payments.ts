import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const initCardPayment = (body: {
  productCode: string;
  amountRials: number;
}) =>
  fetchWithAuth('/payments/start/card', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const initCryptoPayment = (body: {
  productCode: string;
  amountCents: number;
}) =>
  fetchWithAuth('/payments/start/crypto', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const submitProof = (body: {paymentId: number; proofUrl: string}) =>
  fetchWithAuth(`/payments/${body.paymentId}/proof`, {
    method: 'POST',
    body: JSON.stringify({
      proofUrl: body.proofUrl,
    }),
  });
