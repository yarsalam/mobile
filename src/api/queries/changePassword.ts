import { fetchWithAuth } from "../../lib/fetchWithAuth";


export const changePassword = async (password: string) => {
  return await fetchWithAuth("http://192.168.0.133:5001/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
};
