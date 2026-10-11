import {fetchWithAuth} from '../../lib/fetchWithAuth';

// Backend contract: POST /payments/deposit/card accepts { amountRials }.
export const initCardPayment = (body: {amountRials: number}) =>
  fetchWithAuth('/payments/deposit/card', {
    method: 'POST',
    body: JSON.stringify({amountRials: body.amountRials}),
  });

// Backend contract: POST /payments/deposit/crypto also accepts { amountRials }.
// The backend performs the currency conversion; the client must not send amountCents.
export const initCryptoPayment = (body: {amountRials: number}) =>
  fetchWithAuth('/payments/deposit/crypto', {
    method: 'POST',
    body: JSON.stringify({amountRials: body.amountRials}),
  });

export const submitProof = (body: {paymentId: number; proofUrl: string}) =>
  fetchWithAuth(`/payments/${body.paymentId}/proof`, {
    method: 'POST',
    body: JSON.stringify({proofUrl: body.proofUrl}),
  });
