import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const requestVerification = async (selfieFile: {uri: string; type: string; name: string}) => {
  const formData = new FormData();
  formData.append('selfie', {
    uri: selfieFile.uri,
    type: selfieFile.type || 'image/jpeg',
    name: selfieFile.name || 'selfie.jpg',
  } as any);

  return fetchWithAuth('/verification/request', {
    method: 'POST',
    body: formData,
  });
};

export const getVerificationStatus = () => fetchWithAuth('/verification/status');
