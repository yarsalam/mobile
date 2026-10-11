import { fetchWithAuth } from "../../lib/fetchWithAuth";

export const getTransactions = async (password: string) => {
  return await fetchWithAuth("transactions", {
    method: "GET",
    body: JSON.stringify({ password }),
  });
};